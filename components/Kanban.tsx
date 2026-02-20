
import React, { useState, useMemo } from 'react';
import { KanbanStatus, Client } from '../types';
import { dataService } from '../services/dataService';
import ClientFormModal from './ClientFormModal';
import CRMModal from './CRMModal';
import PageHeader from './PageHeader';

const Kanban: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCRMModalOpen, setIsCRMModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      const data = await dataService.getClients();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients for kanban:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClients();
  }, []);

  // Filters
  const [filterResponsavel, setFilterResponsavel] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const columns = Object.values(KanbanStatus);

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      if (c.arquivado) return false; // Remove cards arquivados da visão do funil

      const matchResp = filterResponsavel ? c.responsavel.toLowerCase().includes(filterResponsavel.toLowerCase()) : true;
      const clientDate = new Date(c.createdAt).getTime();
      const start = filterStartDate ? new Date(filterStartDate).getTime() : 0;
      const end = filterEndDate ? new Date(filterEndDate).getTime() : Infinity;
      return matchResp && clientDate >= start && clientDate <= end;
    });
  }, [clients, filterResponsavel, filterStartDate, filterEndDate]);

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('clientId', id);
  };

  const onDrop = async (e: React.DragEvent, targetStatus: KanbanStatus) => {
    const id = e.dataTransfer.getData('clientId');
    await dataService.updateClientStatus(id, targetStatus);
    fetchClients();
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleOpenCRM = (client: Client) => {
    setSelectedClient(client);
    setIsCRMModalOpen(true);
    setActiveDropdown(null);
  };

  const handleEditLead = (client: Client) => {
    setActiveDropdown(null);
    setSelectedClient({ ...client });
    setTimeout(() => {
      setIsClientModalOpen(true);
    }, 50);
  };

  const handleDeleteCard = async (clientId: string) => {
    if (window.confirm('Deseja remover este card do funil? O registro permanecerá disponível na lista de Clientes & Leads.')) {
      await dataService.archiveClient(clientId);
      fetchClients();
      setActiveDropdown(null);
    }
  };

  const handleSaveClient = async (data: any) => {
    if (data.id) {
      await dataService.updateClient(data.id, data);
    } else {
      await dataService.addClient(data);
    }
    fetchClients();
    setIsClientModalOpen(false);
    setSelectedClient(null);
  };

  const checkAlert = (client: Client) => {
    if (!client.proximaAcaoData) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const actionDate = new Date(client.proximaAcaoData);
    actionDate.setHours(0, 0, 0, 0);
    return actionDate <= today;
  };

  const getStageTime = (client: Client) => {
    const lastHistory = client.historicoEtapas[client.historicoEtapas.length - 1];
    if (!lastHistory) return 'Novo';
    const diff = Math.floor((Date.now() - new Date(lastHistory.data).getTime()) / (1000 * 60 * 60 * 24));
    return diff === 0 ? 'Hoje' : `${diff} dias`;
  };

  const getColumnColor = (status: KanbanStatus) => {
    switch (status) {
      case KanbanStatus.PROSPECCAO: return 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800';
      case KanbanStatus.ORCAMENTO: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30';
      case KanbanStatus.PEDIDO: return 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30';
      case KanbanStatus.DESENVOLVIMENTO: return 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30';
      case KanbanStatus.FATURADO: return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30';
      default: return 'bg-slate-50 dark:bg-slate-900';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <PageHeader title="Funil de Vendas" subtitle="Acompanhamento de CRM e Follow-up de pedidos.">
        <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Responsável</label>
            <input
              type="text"
              placeholder="Ex: Carlos"
              value={filterResponsavel}
              onChange={e => setFilterResponsavel(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-32"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Criado De</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={e => setFilterStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={() => { setSelectedClient(null); setIsClientModalOpen(true); }}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            <i className="fas fa-plus"></i> Novo Lead
          </button>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Sincronizando Leads...</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar flex-1 items-start min-h-[600px]">
          {columns.map((column) => (
            <div
              key={column}
              className={`flex-shrink-0 w-72 md:w-80 rounded-2xl border min-h-[500px] flex flex-col transition-colors ${getColumnColor(column)}`}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, column)}
            >
              <div className="p-4 border-b border-inherit flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase text-xs tracking-wider">{column}</h3>
                </div>
                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400 shadow-sm">
                  {filteredClients.filter(c => c.status === column).length}
                </span>
              </div>

              <div className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">
                {filteredClients
                  .filter(c => c.status === column)
                  .map(client => {
                    const hasAlert = checkAlert(client);
                    return (
                      <div
                        key={client.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, client.id)}
                        className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all group relative"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-2">
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${client.type === 'Cliente' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                              {client.type}
                            </span>
                            {hasAlert && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mt-1" title="Ação de CRM Necessária!"></span>
                            )}
                          </div>

                          <div className="relative">
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === client.id ? null : client.id); }}
                              className="text-slate-300 hover:text-indigo-600 transition p-1"
                            >
                              <i className="fas fa-ellipsis-v"></i>
                            </button>

                            {activeDropdown === client.id && (
                              <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <button onClick={() => handleOpenCRM(client)} className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition flex items-center gap-3 border-b border-slate-50 dark:border-slate-700">
                                  <i className="fas fa-history text-indigo-500"></i> CRM / Histórico
                                </button>
                                <button onClick={() => handleEditLead(client)} className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition flex items-center gap-3 border-b border-slate-50 dark:border-slate-700">
                                  <i className="fas fa-user-edit text-indigo-400"></i> Editar Dados
                                </button>
                                <button onClick={() => handleDeleteCard(client.id)} className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition flex items-center gap-3">
                                  <i className="fas fa-trash-alt text-rose-400"></i> Deletar Card
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight line-clamp-2">{client.nomeFantasia}</h4>

                        <div className="mt-4 space-y-2">
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <i className="fas fa-user-circle opacity-40"></i> {client.contato}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                            <i className="fas fa-clock opacity-40"></i> Na etapa há: <span className="text-indigo-500 font-bold">{getStageTime(client)}</span>
                          </p>
                        </div>

                        {client.proximaAcaoData && (
                          <div className={`mt-3 p-2 rounded-lg border ${hasAlert ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'}`}>
                            <p className={`text-[9px] font-black uppercase tracking-tighter ${hasAlert ? 'text-rose-600' : 'text-slate-400'}`}>
                              <i className="fas fa-calendar-alt mr-1"></i> Prox. Ação: {new Date(client.proximaAcaoData).toLocaleDateString()}
                            </p>
                            <p className="text-[9px] text-slate-500 mt-1 italic truncate">{client.proximaAcaoDesc}</p>
                          </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                          <span className="text-[9px] text-slate-400 font-bold">{client.responsavel}</span>
                          <div className="flex gap-2">
                            <a href={`https://wa.me/${client.whatsapp.replace(/\D/g, '')}`} target="_blank" className="text-emerald-500 hover:scale-110 transition"><i className="fab fa-whatsapp"></i></a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      <ClientFormModal
        isOpen={isClientModalOpen}
        onClose={() => { setIsClientModalOpen(false); setSelectedClient(null); }}
        onSave={handleSaveClient}
        initialData={selectedClient}
      />

      {selectedClient && (
        <CRMModal
          isOpen={isCRMModalOpen}
          onClose={() => { setIsCRMModalOpen(false); setSelectedClient(null); }}
          client={selectedClient}
          onUpdate={fetchClients}
        />
      )}
    </div>
  );
};

export default Kanban;
