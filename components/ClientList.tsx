
import React, { useState } from 'react';
import { Client, ClientType } from '../types';
import { dataService } from '../services/dataService';
import ClientFormModal from './ClientFormModal';
import PageHeader from './PageHeader';
import SearchInput from './SearchInput';
import EmptyState from './EmptyState';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const fetchClients = async () => {
    try {
      const data = await dataService.getClients();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c =>
    (c.nomeFantasia?.toLowerCase() || '').includes(filter.toLowerCase()) ||
    (c.razaoSocial?.toLowerCase() || '').includes(filter.toLowerCase())
  );

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = async (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este registro? Essa ação não poderá ser desfeita.')) {
      await dataService.deleteClient(clientId);
      fetchClients();
    }
  };

  const handleSave = async (data: any) => {
    if (data.id) {
      await dataService.updateClient(data.id, data);
    } else {
      await dataService.addClient(data);
    }
    fetchClients();
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Clientes & Leads" subtitle="Gestão centralizada da sua base de contatos. Clique em uma linha para editar.">
        <SearchInput value={filter} onChange={setFilter} placeholder="Buscar por nome..." />
      </PageHeader>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Lendo Base de Dados...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* ... (existing thead) ... */}
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Nome Fantasia / Razão Social</th>
                  <th className="px-6 py-4">Contato Principal</th>
                  <th className="px-6 py-4">Segmento</th>
                  <th className="px-6 py-4">Status Funil</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredClients.map(client => (
                  <tr
                    key={client.id}
                    onClick={() => handleEditClient(client)}
                    className="hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${client.type === ClientType.CLIENTE ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        {client.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition">{client.nomeFantasia}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{client.razaoSocial}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700 dark:text-slate-300 font-medium">{client.contato}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-500">{client.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 dark:text-slate-400 italic">{client.segmento}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-medium">
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-4 text-slate-400 dark:text-slate-600 transition">
                        <button
                          title="Editar"
                          className="hover:text-indigo-600 dark:hover:text-indigo-400"
                          onClick={(e) => { e.stopPropagation(); handleEditClient(client); }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          title="WhatsApp"
                          className="hover:text-emerald-600"
                        >
                          <a href={`https://wa.me/${(client.whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                            <i className="fab fa-whatsapp"></i>
                          </a>
                        </button>
                        <button
                          onClick={(e) => handleDeleteClient(e, client.id)}
                          title="Excluir"
                          className="hover:text-rose-600 transition-colors p-2"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && filteredClients.length === 0 && (
          <EmptyState icon="fa-users" message="Nenhum cliente encontrado para sua busca." />
        )}
      </div>

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedClient(null); }}
        onSave={handleSave}
        initialData={selectedClient}
      />
    </div>
  );
};

export default ClientList;
