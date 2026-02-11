
import React, { useState, useEffect } from 'react';
import { ClientType, KanbanStatus, Client, Provider } from '../types';
import { dataService } from '../services/dataService';
import ModalOverlay from './ModalOverlay';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: any) => void;
  initialData?: Client | null;
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    type: ClientType.LEAD,
    razaoSocial: '',
    nomeFantasia: '',
    documento: '',
    contato: '',
    whatsapp: '',
    email: '',
    endereco: '',
    segmento: '',
    origem: '',
    responsavel: 'Carlos Representante',
    status: KanbanStatus.PROSPECCAO,
    ativo: true,
    obs: ''
  });

  const origemOptions = [
    'Indicação Fábrica',
    'Indicação Fabricante de Máquina',
    'Contato Direto',
    'Rede Social',
    'E-mail'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        razaoSocial: initialData.razaoSocial,
        nomeFantasia: initialData.nomeFantasia,
        documento: initialData.documento,
        contato: initialData.contato,
        whatsapp: initialData.whatsapp,
        email: initialData.email,
        endereco: initialData.endereco,
        segmento: initialData.segmento,
        origem: initialData.origem,
        responsavel: initialData.responsavel,
        status: initialData.status,
        ativo: initialData.ativo ?? true,
        obs: initialData.obs
      });
    } else {
      setFormData({
        type: ClientType.LEAD,
        razaoSocial: '',
        nomeFantasia: '',
        documento: '',
        contato: '',
        whatsapp: '',
        email: '',
        endereco: '',
        segmento: '',
        origem: '',
        responsavel: 'Carlos Representante',
        status: KanbanStatus.PROSPECCAO,
        ativo: true,
        obs: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: name === 'ativo' ? value === 'true' : val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(initialData ? { ...formData, id: initialData.id } : formData);
    onClose();
  };

  return (
    <ModalOverlay>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar transition-colors">
        <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className={`fas ${initialData ? 'fa-edit' : 'fa-user-plus'} text-indigo-600`}></i>
            {initialData ? 'Editar Cadastro' : 'Novo Lead / Cliente'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5" autoComplete="off">
          {/* Identificação Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tipo <span className="text-rose-500">*</span></label>
              <select name="type" required value={formData.type} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold">
                <option value={ClientType.LEAD}>Lead</option>
                <option value={ClientType.CLIENTE}>Cliente</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status <span className="text-rose-500">*</span></label>
              <select name="ativo" required value={formData.ativo.toString()} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold">
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Razão Social <span className="text-rose-500">*</span></label>
              <input type="text" name="razaoSocial" required value={formData.razaoSocial} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nome Fantasia <span className="text-rose-500">*</span></label>
              <input
                type="text"
                name="nomeFantasia"
                required
                value={formData.nomeFantasia}
                onChange={handleChange}
                autoComplete="off"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">CNPJ / CPF <span className="text-rose-500">*</span></label>
              <input type="text" name="documento" required value={formData.documento} onChange={handleChange} placeholder="00.000.000/0000-00" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nome do Contato <span className="text-rose-500">*</span></label>
              <input type="text" name="contato" required value={formData.contato} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Telefone / WhatsApp <span className="text-rose-500">*</span></label>
              <input type="text" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} placeholder="(00) 00000-0000" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">E-mail <span className="text-rose-500">*</span></label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Endereço Completo <span className="text-rose-500">*</span></label>
              <input
                type="text"
                name="endereco"
                required
                value={formData.endereco}
                onChange={handleChange}
                autoComplete="off"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Segmento de Atuação <span className="text-rose-500">*</span></label>
              <input
                type="text"
                name="segmento"
                required
                value={formData.segmento}
                onChange={handleChange}
                autoComplete="off"
                placeholder="Ex: Alimentício, Farmacêutico"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Origem do Lead <span className="text-rose-500">*</span></label>
              <select
                name="origem"
                required
                value={formData.origem}
                onChange={handleChange}
                autoComplete="off"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              >
                <option value="">Selecione a origem...</option>
                {origemOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Observações</label>
            <textarea name="obs" rows={3} value={formData.obs} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Cancelar</button>
            <button type="submit" className="px-6 py-2 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition">Salvar Cadastro</button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
};

export default ClientFormModal;
