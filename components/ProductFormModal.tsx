
import React, { useState, useEffect } from 'react';
import { ProductSpecification, Provider, Client } from '../types';
import { dataService } from '../services/dataService';
import ModalOverlay from './ModalOverlay';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  initialData?: ProductSpecification | null;
}

const UnwindingIcon: React.FC<{ num: number }> = ({ num }) => {
  const isVertical = num >= 11;
  const hasLabel = num >= 11 && num <= 16;
  const label = (num === 11 || num === 13 || num === 14) ? "HORÁRIO" : (num === 12 || num === 15 || num === 16) ? "ANTI-HORÁRIO" : "";

  const renderSquare = () => {
    if ([3, 5, 9, 13, 15, 19].includes(num)) return <div className="absolute bottom-1 left-1 w-3 h-2 bg-slate-500 border border-slate-700 z-30"></div>;
    if ([4, 6, 10, 14, 16, 17, 20].includes(num)) return <div className="absolute bottom-1 right-1 w-3 h-2 bg-slate-500 border border-slate-700 z-30"></div>;
    if (num === 18) return (
      <>
        <div className="absolute bottom-1 left-1 w-3 h-2 bg-slate-500 border border-slate-700 z-30"></div>
        <div className="absolute bottom-1 right-1 w-3 h-2 bg-slate-500 border border-slate-700 z-30"></div>
      </>
    );
    return null;
  };

  const renderText = (location: 'roll' | 'film') => {
    const textClasses = "font-black text-blue-800 dark:text-blue-400 select-none pointer-events-none";
    if (!isVertical) {
      const isFlipped = [2, 5, 6, 8, 10].includes(num);
      return <div className={`${textClasses} text-[7px] ${isFlipped ? 'rotate-180' : ''}`}>MAXCONVERT</div>;
    }
    if (num >= 11 && num <= 16) {
      if (location === 'film') return null;
      return (
        <div className="flex gap-1 -rotate-90">
          <div className={`${textClasses} text-[5px]`}>MAXCONVERT</div>
          <div className={`${textClasses} text-[5px]`}>MAXCONVERT</div>
        </div>
      );
    }
    if (num === 18) return <div className={`${textClasses} text-[7px] rotate-180`}>MAXCONVERT</div>;
    return <div className={`${textClasses} text-[7px] -rotate-90`}>MAXCONVERT</div>;
  };

  return (
    <div className="flex flex-col items-center gap-1 p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer group bg-white dark:bg-slate-900 shadow-sm w-full aspect-square justify-center relative overflow-hidden">
      {hasLabel && (
        <span className="absolute top-1 text-[7px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-tighter z-20">
          {label}
        </span>
      )}
      <div className={`relative flex items-center justify-center ${isVertical ? 'h-24 w-16' : 'w-24 h-16'}`}>
        <div className={`absolute border-2 border-slate-900 dark:border-slate-300 rounded-lg bg-white dark:bg-slate-800 z-10 shadow-sm flex items-center justify-center
          ${isVertical ? 'w-10 h-14 top-0' : 'h-10 w-14 left-0'}
          ${[5, 6, 7, 8].includes(num) && !isVertical ? 'bottom-0 top-auto' : ''}
          ${num === 18 ? 'left-0' : ''}`}>
          <div className={`absolute w-4 h-4 rounded-full border border-slate-900 dark:border-slate-300 bg-white dark:bg-slate-800 flex items-center justify-center text-[8px] font-black
            ${([1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 15, 16, 18].includes(num)) ? 'top-1 left-1' : 'top-1 right-1'}`}>
            O
          </div>
          {renderText('roll')}
        </div>
        <div className={`absolute border-2 border-slate-900 dark:border-slate-300 bg-white dark:bg-slate-800 flex items-center justify-center
          ${isVertical ? 'w-10 h-16 bottom-0' : 'h-10 w-16 right-0'} 
          ${[5, 6, 7, 8].includes(num) && !isVertical ? 'top-0' : ''}
          ${num >= 17 ? 'h-18' : ''}`}>
          {renderText('film')}
          {renderSquare()}
        </div>
        <div className="absolute bottom-0 right-1 text-sm font-black text-slate-900 dark:text-white z-40">
          {num}
        </div>
      </div>
    </div>
  );
};

const UnwindingDirectionSelector: React.FC<{
  selected: string;
  onSelect: (val: string) => void;
}> = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Sentido de Desbobinamento</label>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 font-bold hover:bg-blue-100 transition-all shadow-sm group"
      >
        <div className="flex items-center gap-2">
          <i className="fas fa-arrows-spin group-hover:rotate-180 transition-transform duration-500"></i>
          <span className="text-sm">{selected ? `Esquema Selecionado: Nº ${selected}` : 'Abrir Tabela de Sentidos'}</span>
        </div>
        <i className="fas fa-th text-xs opacity-50"></i>
      </button>

      {isOpen && (
        <ModalOverlay className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-slate-50 dark:bg-slate-950 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
                  <i className="fas fa-scroll text-xl"></i>
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Tabela de Sentido de Embobinamento</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Padrão Maxconvert - Selecione o esquema correspondente</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center text-slate-400">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {options.map(num => (
                  <div
                    key={num}
                    onClick={() => { onSelect(num.toString()); setIsOpen(false); }}
                    className={`relative transform transition-all hover:scale-105 active:scale-95 ${selected === num.toString() ? 'ring-4 ring-blue-500 ring-offset-4 dark:ring-offset-slate-950 rounded-2xl z-10' : ''}`}
                  >
                    <UnwindingIcon num={num} />
                    {selected === num.toString() && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-950 z-30 animate-bounce">
                        <i className="fas fa-check text-xs"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button type="button" onClick={() => setIsOpen(false)} className="px-8 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-700 transition shadow-lg">Fechar Tabela</button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
};

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [activeTab, setActiveTab] = useState<'tecnica' | 'cliche'>('tecnica');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [provData, cliData] = await Promise.all([
        dataService.getProviders(),
        dataService.getClients()
      ]);
      setProviders(provData);
      setClients(cliData);
    } catch (error) {
      console.error('Error fetching modal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const [formData, setFormData] = useState<Partial<ProductSpecification>>({
    nome: '',
    barcode: '',
    clientId: '',
    tipoEmbalagem: 'Saquinho monocamada',
    material: '',
    medidas: '',
    passo: '',
    largura: '',
    gramatura: '',
    espessura: '',
    personalizado: false,
    impressaoTipo: 'Externa',
    sentidoDesbobinamento: '',
    diametroMaximoBobina: '',
    cores: Array(8).fill(''),
    providerId: '',
    plantaTecnicaUrl: '',
    layoutUrl: '',
    observacoesTecnicas: '',

    // Ficha de Gravação
    fichaNumero: '',
    fichaData: new Date().toISOString().split('T')[0],
    fichaHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    modeloEmbalagem: 'bobina',
    faturamentoCliche: 'fabrica',
    valorCliche: 0,
    maquina: '',
    cilindroCamisa: '',
    distorcao: '',
    deslocar: 'não',
    duplaFace: '',
    espessuraCliche: '1,14',
    lineatura: '',
    fotocelula: '',
    filmeAberto: '',
    repeticaoLongitudinal: '',
    repeticaoLateral: '',
    quantidadeCoresFicha: 0,
    coresFicha: Array(8).fill(''),
    obsFicha: ''
  });

  const isBobina = formData.tipoEmbalagem?.toLowerCase().includes('bobina');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        cores: initialData.cores.length ? [...initialData.cores, ...Array(8 - initialData.cores.length).fill('')].slice(0, 8) : Array(8).fill(''),
        coresFicha: initialData.coresFicha?.length ? [...initialData.coresFicha, ...Array(8 - initialData.coresFicha.length).fill('')].slice(0, 8) : Array(8).fill(''),
      });
    } else {
      setFormData({
        nome: '',
        barcode: '',
        clientId: '',
        tipoEmbalagem: 'Saquinho monocamada',
        material: '',
        medidas: '',
        passo: '',
        largura: '',
        gramatura: '',
        espessura: '',
        personalizado: false,
        impressaoTipo: 'Externa',
        sentidoDesbobinamento: '',
        diametroMaximoBobina: '',
        cores: Array(8).fill(''),
        providerId: '',
        plantaTecnicaUrl: '',
        layoutUrl: '',
        observacoesTecnicas: '',
        fichaNumero: '',
        fichaData: new Date().toISOString().split('T')[0],
        fichaHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        modeloEmbalagem: 'bobina',
        faturamentoCliche: 'fabrica',
        valorCliche: 0,
        maquina: '',
        cilindroCamisa: '',
        distorcao: '',
        deslocar: 'não',
        duplaFace: '',
        espessuraCliche: '1,14',
        lineatura: '',
        fotocelula: '',
        filmeAberto: '',
        repeticaoLongitudinal: '',
        repeticaoLateral: '',
        quantidadeCoresFicha: 0,
        coresFicha: Array(8).fill(''),
        obsFicha: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleColorChange = (index: number, value: string, isFicha = false) => {
    const key = isFicha ? 'coresFicha' : 'cores';
    const newColors = [...(formData[key] || Array(8).fill(''))];
    newColors[index] = value;
    setFormData(prev => ({ ...prev, [key]: newColors }));
  };

  const selectedClient = clients.find(c => c.id === formData.clientId);

  return (
    <ModalOverlay>
      <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col transition-colors">

        {/* HEADER */}
        <div className="bg-white dark:bg-slate-950 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <i className="fas fa-flask text-indigo-600"></i>
              {initialData ? 'Editar Especificação' : 'Nova Especificação Técnica'}
            </h3>
            {initialData && <span className="text-xs font-mono text-indigo-500 font-bold mt-1">{initialData.sku}</span>}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition"><i className="fas fa-times text-xl"></i></button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4 flex-1 bg-white dark:bg-slate-950">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Lendo Ficha Técnica...</p>
          </div>
        ) : (
          <>
            {/* TABS */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button
                onClick={() => setActiveTab('tecnica')}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'tecnica' ? 'border-indigo-600 text-indigo-600 bg-white dark:bg-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                <i className="fas fa-microscope mr-2"></i> Especificação Técnica
              </button>
              <button
                onClick={() => setActiveTab('cliche')}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'cliche' ? 'border-indigo-600 text-indigo-600 bg-white dark:bg-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                <i className="fas fa-print mr-2"></i> Ficha de Gravação
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              {activeTab === 'tecnica' ? (
                <>
                  {/* TAB 1: ESPECIFICAÇÃO TÉCNICA */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Informações Gerais</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome do Produto</label>
                        <input type="text" name="nome" required value={formData.nome} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Código de Barras</label>
                        <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome do Cliente</label>
                        <select name="clientId" required value={formData.clientId} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white">
                          <option value="">Selecione um cliente...</option>
                          {clients.map(c => <option key={c.id} value={c.id}>{c.nomeFantasia || c.razaoSocial}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fornecedor (Representada)</label>
                        <select name="providerId" required value={formData.providerId} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white">
                          <option value="">Selecione uma representada...</option>
                          {providers.map(p => <option key={p.id} value={p.id}>{p.nomeFantasia}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipo de Embalagem</label>
                        <select name="tipoEmbalagem" value={formData.tipoEmbalagem} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white">
                          <option value="Saquinho monocamada">Saquinho monocamada</option>
                          <option value="Saquinho Laminado">Saquinho Laminado</option>
                          <option value="Bobina laminado">Bobina laminado</option>
                          <option value="Bobina Monocamada">Bobina Monocamada</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Especificações Técnicas</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estrutura Material</label>
                        <input type="text" name="material" value={formData.material} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" />
                      </div>
                      {!isBobina ? (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Medidas (L x A x C)</label>
                          <input type="text" name="medidas" value={formData.medidas} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Medidas Bobina (Passo)</label>
                            <input type="text" name="passo" value={formData.passo} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Medidas Bobina (Largura)</label>
                            <input type="text" name="largura" value={formData.largura} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                          </div>
                        </>
                      )}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gramatura (g/m²)</label>
                        <input type="text" name="gramatura" value={formData.gramatura} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Espessura (µ)</label>
                        <input type="text" name="espessura" value={formData.espessura} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                      <div className="md:col-span-2">
                        <UnwindingDirectionSelector selected={formData.sentidoDesbobinamento || ''} onSelect={(v) => setFormData(p => ({ ...p, sentidoDesbobinamento: v }))} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Diâmetro Máximo Bobina</label>
                        <input type="text" name="diametroMaximoBobina" value={formData.diametroMaximoBobina} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Observações Técnicas</h4>
                    <textarea name="observacoesTecnicas" rows={4} value={formData.observacoesTecnicas} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white resize-none" />
                  </section>
                </>
              ) : (
                <>
                  {/* TAB 2: FICHA DE GRAVAÇÃO */}

                  {/* Identificação */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border-b border-indigo-100 dark:border-indigo-900/30 pb-2">Identificação</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Nº Ficha de Gravação</label>
                        <input type="text" name="fichaNumero" value={formData.fichaNumero} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white font-mono" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Data</label>
                        <input type="date" name="fichaData" value={formData.fichaData} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Hora</label>
                        <input type="time" name="fichaHora" value={formData.fichaHora} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Cliente</label>
                        <div className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 truncate">{selectedClient?.nomeFantasia || 'Selecione na aba anterior'}</div>
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Produto / Código SKU</label>
                        <div className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 font-bold">{formData.nome || 'Pendente'} {formData.sku ? `- ${formData.sku}` : ''}</div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Modelo</label>
                        <select name="modeloEmbalagem" value={formData.modeloEmbalagem} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white">
                          <option value="bobina">Bobina</option>
                          <option value="saquinho">Saquinho</option>
                          <option value="rotulo">Rótulo</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Faturamento Clichê</label>
                        <select name="faturamentoCliche" value={formData.faturamentoCliche} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white">
                          <option value="cliente">Cliente</option>
                          <option value="fabrica">Fábrica</option>
                        </select>
                      </div>
                      <div className="md:col-span-1 space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Valor de Clichê R$</label>
                        <input type="number" name="valorCliche" value={formData.valorCliche} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white font-bold" />
                      </div>
                    </div>
                  </section>

                  {/* Parâmetros Técnicos */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border-b border-indigo-100 dark:border-indigo-900/30 pb-2">Parâmetros Técnicos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Tipo de Impressão</label>
                        <select name="impressaoTipo" value={formData.impressaoTipo} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white">
                          <option value="Interna">Interna</option>
                          <option value="Externa">Externa</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Máquina</label>
                        <input type="text" name="maquina" value={formData.maquina} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Cilindro / Camisa</label>
                        <input type="text" name="cilindroCamisa" value={formData.cilindroCamisa} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Distorção (mm)</label>
                        <input type="text" name="distorcao" value={formData.distorcao} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Deslocar?</label>
                        <select name="deslocar" value={formData.deslocar} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white">
                          <option value="sim">Sim</option>
                          <option value="não">Não</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Dupla Face</label>
                        <input type="text" name="duplaFace" value={formData.duplaFace} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Espessura Clichê</label>
                        <select name="espessuraCliche" value={formData.espessuraCliche} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white">
                          <option value="1,14">1,14</option>
                          <option value="2,80">2,80</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Lineatura</label>
                        <input type="text" name="lineatura" value={formData.lineatura} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Passo (mm)</label>
                        <div className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">{formData.passo || 'Consulte aba téc.'}</div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Largura (mm)</label>
                        <div className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">{formData.largura || 'Consulte aba téc.'}</div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Fotocélula</label>
                        <input type="text" name="fotocelula" value={formData.fotocelula} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Material</label>
                        <div className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 truncate">{formData.material || 'Pendente'}</div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Filme Aberto (mm)</label>
                        <input type="text" name="filmeAberto" value={formData.filmeAberto} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                    </div>
                  </section>

                  {/* Montagem */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border-b border-indigo-100 dark:border-indigo-900/30 pb-2">Montagem</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Repetição Longitudinal</label>
                        <input type="text" name="repeticaoLongitudinal" value={formData.repeticaoLongitudinal} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Repetição Lateral</label>
                        <input type="text" name="repeticaoLateral" value={formData.repeticaoLateral} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                    </div>
                  </section>

                  {/* Cores / Anilox / BCM */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border-b border-indigo-100 dark:border-indigo-900/30 pb-2">Cores / Anilox / BCM</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-4 space-y-1 mb-2">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantidade de Cores</label>
                        <input type="number" name="quantidadeCoresFicha" value={formData.quantidadeCoresFicha} onChange={handleChange} className="w-full max-w-[150px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm dark:text-white" />
                      </div>
                      {Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="space-y-1 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                          <label className="text-[9px] font-black text-indigo-500 uppercase">Cor {String(idx + 1).padStart(2, '0')}</label>
                          <input
                            type="text"
                            value={formData.coresFicha?.[idx] || ''}
                            onChange={(e) => handleColorChange(idx, e.target.value, true)}
                            placeholder="Pantone / Anilox"
                            className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Observações */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border-b border-indigo-100 dark:border-indigo-900/30 pb-2">Observações da Gravação</h4>
                    <textarea name="obsFicha" rows={4} value={formData.obsFicha} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white resize-none" placeholder="Informe aqui detalhes adicionais para o processo de gravação dos clichês..." />
                  </section>
                </>
              )}

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 transition-colors">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Cancelar</button>
                <button type="submit" className="px-6 py-2 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition">Salvar Especificação</button>
              </div>
            </form>
          </>
        )}
      </div>
    </ModalOverlay>
  );
};

export default ProductFormModal;
