
import React, { useState, useRef, useEffect } from 'react';
import { Provider, ContactInfo } from '../types';
import ModalOverlay from './ModalOverlay';

interface ProviderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (provider: any) => void;
  initialData?: Provider | null;
}

const ProviderFormModal: React.FC<ProviderFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialContact = { nome: '', email: '', telefone: '' };

  const [formData, setFormData] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    logo: '',
    contatoComercial: { ...initialContact },
    contatoFinanceiro: { ...initialContact },
    contatoGerencia: { ...initialContact },
    contatoQualidade: { ...initialContact },
    whatsapp: '',
    email: '',
    site: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    endereco: '',
    cep: '',
    cidade: '',
    estado: '',
    linhaProdutos: [] as string[],
    prazoProducao: '',
    condicoesComerciais: '',
    comissaoPadrao: 0,
    observacoes: ''
  });

  const productOptions = ['Monocamada', 'Laminado', 'Saquinho', 'Standup-pouch'];

  useEffect(() => {
    if (initialData) {
      setFormData({
        razaoSocial: initialData.razaoSocial || '',
        nomeFantasia: initialData.nomeFantasia || '',
        cnpj: initialData.cnpj || '',
        logo: initialData.logo || '',
        contatoComercial: { ...initialData.contatoComercial } || { ...initialContact },
        contatoFinanceiro: { ...initialData.contatoFinanceiro } || { ...initialContact },
        contatoGerencia: { ...initialData.contatoGerencia } || { ...initialContact },
        contatoQualidade: { ...initialData.contatoQualidade } || { ...initialContact },
        whatsapp: initialData.whatsapp || '',
        email: initialData.email || '',
        site: initialData.site || '',
        instagram: initialData.instagram || '',
        facebook: initialData.facebook || '',
        linkedin: initialData.linkedin || '',
        youtube: initialData.youtube || '',
        endereco: initialData.endereco || '',
        cep: initialData.cep || '',
        cidade: initialData.cidade || '',
        estado: initialData.estado || '',
        linhaProdutos: initialData.linhaProdutos || [],
        prazoProducao: initialData.prazoProducao || '',
        condicoesComerciais: initialData.condicoesComerciais || '',
        comissaoPadrao: initialData.comissaoPadrao || 0,
        observacoes: initialData.observacoes || ''
      });
    } else {
      setFormData({
        razaoSocial: '',
        nomeFantasia: '',
        cnpj: '',
        logo: '',
        contatoComercial: { ...initialContact },
        contatoFinanceiro: { ...initialContact },
        contatoGerencia: { ...initialContact },
        contatoQualidade: { ...initialContact },
        whatsapp: '',
        email: '',
        site: '',
        instagram: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        endereco: '',
        cep: '',
        cidade: '',
        estado: '',
        linhaProdutos: [],
        prazoProducao: '',
        condicoesComerciais: '',
        comissaoPadrao: 0,
        observacoes: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(initialData ? { ...formData, id: initialData.id } : formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (dept: string, field: keyof ContactInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [dept]: {
        ...(prev[dept as keyof typeof prev] as ContactInfo),
        [field]: value
      }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Por favor, selecione uma imagem nos formatos JPG ou PNG.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      linhaProdutos: prev.linhaProdutos.includes(option)
        ? prev.linhaProdutos.filter(item => item !== option)
        : [...prev.linhaProdutos, option]
    }));
  };

  const ContactBlock = ({ label, dept }: { label: string, dept: string }) => (
    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
      <h5 className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter border-b border-slate-100 dark:border-slate-800 pb-1 mb-2">
        {label}
      </h5>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nome"
          className="w-full px-2 py-1.5 rounded border border-slate-100 dark:border-slate-800 bg-transparent focus:ring-1 focus:ring-indigo-500 outline-none text-[12px] dark:text-white"
          value={(formData[dept as keyof typeof formData] as ContactInfo).nome}
          onChange={(e) => handleContactChange(dept, 'nome', e.target.value)}
        />
        <input
          type="email"
          placeholder="E-mail"
          className="w-full px-2 py-1.5 rounded border border-slate-100 dark:border-slate-800 bg-transparent focus:ring-1 focus:ring-indigo-500 outline-none text-[12px] dark:text-white"
          value={(formData[dept as keyof typeof formData] as ContactInfo).email}
          onChange={(e) => handleContactChange(dept, 'email', e.target.value)}
        />
        <input
          type="text"
          placeholder="Tel / WhatsApp"
          className="w-full px-2 py-1.5 rounded border border-slate-100 dark:border-slate-800 bg-transparent focus:ring-1 focus:ring-indigo-500 outline-none text-[12px] dark:text-white"
          value={(formData[dept as keyof typeof formData] as ContactInfo).telefone}
          onChange={(e) => handleContactChange(dept, 'telefone', e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <ModalOverlay>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto custom-scrollbar transition-colors">
        <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="fas fa-industry text-indigo-600"></i>
            {initialData ? 'Editar Representada' : 'Cadastro de Representada'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
            {formData.logo ? (
              <div className="relative">
                <img src={formData.logo} alt="Preview" className="h-24 w-auto object-contain rounded-lg shadow-sm" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, logo: '' })); }}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <i className="fas fa-image text-4xl text-slate-300 dark:text-slate-700 group-hover:text-indigo-400 mb-2 transition"></i>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Upload da Logomarca</p>
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Clique para selecionar JPG ou PNG</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleLogoUpload}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Razão Social</label>
              <input type="text" name="razaoSocial" required value={formData.razaoSocial} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" />
            </div>
            <div className="md:col-span-1 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome Fantasia</label>
              <input type="text" name="nomeFantasia" required value={formData.nomeFantasia} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" />
            </div>
            <div className="md:col-span-1 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CNPJ</label>
              <input type="text" name="cnpj" required value={formData.cnpj} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" placeholder="00.000.000/0000-00" />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
            <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2 tracking-widest">
              <i className="fas fa-address-book text-indigo-500"></i> Contatos Setoriais
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <ContactBlock label="Comercial" dept="contatoComercial" />
              <ContactBlock label="Financeiro" dept="contatoFinanceiro" />
              <ContactBlock label="Controle de Qualidade" dept="contatoQualidade" />
              <ContactBlock label="Gerente" dept="contatoGerencia" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">WhatsApp Geral</label>
              <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" placeholder="(00) 00000-0000" />
            </div>
            <div className="md:col-span-1 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">E-mail Geral</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Site</label>
              <input type="url" name="site" value={formData.site} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" placeholder="https://..." />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Instagram</label>
              <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Facebook</label>
              <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">LinkedIn</label>
              <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">YouTube</label>
              <input type="text" name="youtube" value={formData.youtube} onChange={handleChange} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none dark:text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Endereço Completo</label>
              <input type="text" name="endereco" value={formData.endereco} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" placeholder="Rua, Número, Bairro" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CEP</label>
                <input type="text" name="cep" value={formData.cep} onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" placeholder="00000-000" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cidade</label>
                <input type="text" name="cidade" value={formData.cidade} onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" placeholder="Ex: São Paulo" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estado</label>
                <select name="estado" value={formData.estado} onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white">
                  <option value="">Selecione...</option>
                  <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option>
                  <option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option>
                  <option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option>
                  <option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option>
                  <option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option>
                  <option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option>
                  <option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option>
                  <option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option>
                  <option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-indigo-50/30 dark:bg-indigo-500/5 rounded-xl border border-indigo-100/50 dark:border-indigo-500/10">
            <label className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Linha de Produtos</label>
            <div className="flex flex-wrap gap-6">
              {productOptions.map(option => (
                <label key={option} className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => handleCheckboxChange(option)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.linhaProdutos.includes(option) ? 'bg-indigo-600 border-indigo-600' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 group-hover:border-indigo-400'}`}
                  >
                    {formData.linhaProdutos.includes(option) && <i className="fas fa-check text-white text-[10px]"></i>}
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Prazo Médio (Dias)</label>
              <input type="text" name="prazoProducao" value={formData.prazoProducao} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" placeholder="Ex: 15-20" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Comissão (%)</label>
              <input type="number" name="comissaoPadrao" value={formData.comissaoPadrao} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" />
            </div>
            <div className="md:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Condições Comerciais</label>
              <textarea name="condicoesComerciais" rows={2} value={formData.condicoesComerciais} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none dark:text-white" />
            </div>
            <div className="md:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Observações</label>
              <textarea name="observacoes" rows={2} value={formData.observacoes} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none dark:text-white" />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancelar</button>
            <button type="submit" className="px-6 py-2 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all">Salvar Fornecedor</button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
};

export default ProviderFormModal;
