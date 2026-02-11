
import React, { useState } from 'react';
import { Client, Interaction, KanbanStatus } from '../types';
import { dataService } from '../services/dataService';
import ModalOverlay from './ModalOverlay';

interface CRMModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onUpdate: () => void;
}

const CRMModal: React.FC<CRMModalProps> = ({ isOpen, onClose, client, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'interacao' | 'historico' | 'agendamento'>('interacao');
  const [interactionData, setInteractionData] = useState({
    tipo: 'Ligação' as Interaction['tipo'],
    descricao: ''
  });
  const [nextAction, setNextAction] = useState({
    data: client.proximaAcaoData || '',
    descricao: client.proximaAcaoDesc || ''
  });

  if (!isOpen) return null;

  const handleSaveInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.addInteraction(client.id, {
      tipo: interactionData.tipo,
      descricao: interactionData.descricao,
      responsavel: 'Carlos Silva' // Mock logged user
    });
    setInteractionData({ tipo: 'Ligação', descricao: '' });
    onUpdate();
    setActiveTab('historico');
  };

  const handleSaveNextAction = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.scheduleNextAction(client.id, nextAction.data, nextAction.descricao);
    onUpdate();
    onClose();
  };

  const combinedTimeline = [
    ...client.historicoEtapas.map(h => ({ type: 'status', data: h.data, label: `Status alterado para: ${h.status}`, icon: 'fa-exchange-alt', color: 'text-indigo-500' })),
    ...client.interacoes.map(i => ({ type: 'interacao', data: i.data, label: `${i.tipo}: ${i.descricao}`, icon: i.tipo === 'Ligação' ? 'fa-phone' : 'fa-users', color: 'text-emerald-500' }))
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <ModalOverlay className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <i className="fas fa-history text-indigo-600"></i>
              Gestão de CRM: {client.nomeFantasia}
            </h3>
            <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">{client.razaoSocial}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex border-b border-slate-100 dark:border-slate-800">
          {[
            { id: 'interacao', label: 'Registrar Ação', icon: 'fa-plus-circle' },
            { id: 'historico', label: 'Histórico Completo', icon: 'fa-list-ul' },
            { id: 'agendamento', label: 'Agendar Próxima', icon: 'fa-calendar-check' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-b-2 ${activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
              <i className={`fas ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'interacao' && (
            <form onSubmit={handleSaveInteraction} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipo de Interação</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {['Ligação', 'WhatsApp', 'E-mail', 'Visita', 'Reunião'].map(tipo => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setInteractionData(prev => ({ ...prev, tipo: tipo as any }))}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${interactionData.tipo === tipo
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                        }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Descrição da Interação</label>
                <textarea
                  required
                  value={interactionData.descricao}
                  onChange={e => setInteractionData(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  placeholder="Ex: Cliente solicitou nova amostra, liguei para confirmar recebimento..."
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all">
                Salvar Interação
              </button>
            </form>
          )}

          {activeTab === 'historico' && (
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800 before:z-0">
              {combinedTimeline.map((item, idx) => (
                <div key={idx} className="relative z-10 flex gap-6 items-start pl-8">
                  <div className={`absolute left-0 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 flex items-center justify-center -translate-x-1.5 ${item.color.replace('text', 'border')}`}>
                    <i className={`fas ${item.icon} text-[10px] ${item.color}`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                      {new Date(item.data).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
              {combinedTimeline.length === 0 && (
                <div className="text-center py-10 text-slate-400 italic text-sm">Nenhum registro encontrado.</div>
              )}
            </div>
          )}

          {activeTab === 'agendamento' && (
            <form onSubmit={handleSaveNextAction} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data da Próxima Ação</label>
                <input
                  type="date"
                  required
                  value={nextAction.data}
                  onChange={e => setNextAction(prev => ({ ...prev, data: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">O que deve ser feito?</label>
                <textarea
                  required
                  value={nextAction.descricao}
                  onChange={e => setNextAction(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  placeholder="Ex: Retornar para fechamento de pedido..."
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all">
                Agendar Próxima Ação
              </button>
            </form>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
};

export default CRMModal;
