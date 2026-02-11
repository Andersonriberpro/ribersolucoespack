
import React, { useState } from 'react';
import { ProductSpecification, Provider, Client } from '../types';
import { dataService } from '../services/dataService';
import ModalOverlay from './ModalOverlay';

interface ProductPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductSpecification | null;
}

const UnwindingPreview: React.FC<{ num: number }> = ({ num }) => {
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
    if (!isVertical) {
      const isFlipped = [2, 5, 6, 8, 10].includes(num);
      return <div className={`font-black text-blue-800 text-[6px] ${isFlipped ? 'rotate-180' : ''}`}>MAXCONVERT</div>;
    }
    if (num >= 11 && num <= 16) {
      if (location === 'film') return null;
      return (
        <div className="flex gap-1 -rotate-90">
          <div className="font-black text-blue-800 text-[4px]">MAXCONVERT</div>
          <div className="font-black text-blue-800 text-[4px]">MAXCONVERT</div>
        </div>
      );
    }
    if (num === 18) return <div className="font-black text-blue-800 text-[6px] rotate-180">MAXCONVERT</div>;
    return <div className="font-black text-blue-800 text-[6px] -rotate-90">MAXCONVERT</div>;
  };

  return (
    <div className="relative w-32 h-32 border border-slate-200 rounded flex flex-col items-center justify-center bg-white shadow-sm overflow-hidden p-2">
      {hasLabel && <span className="absolute top-1 text-[6px] font-black text-blue-700 uppercase">{label}</span>}
      <div className={`relative flex items-center justify-center ${isVertical ? 'h-20 w-12' : 'w-20 h-12'}`}>
        <div className={`absolute border border-slate-900 rounded bg-white z-10 flex items-center justify-center ${isVertical ? 'w-8 h-12 top-0' : 'h-8 w-12 left-0'} ${[5, 6, 7, 8].includes(num) && !isVertical ? 'bottom-0 top-auto' : ''} ${num === 18 ? 'left-0' : ''}`}>
          <div className={`absolute w-3 h-3 rounded-full border border-slate-900 bg-white flex items-center justify-center text-[6px] font-black ${([1, 2, 3, 4, 5, 6, 11, 12, 13, 14, 15, 16, 18].includes(num)) ? 'top-0.5 left-0.5' : 'top-0.5 right-0.5'}`}>O</div>
          {renderText('roll')}
        </div>
        <div className={`absolute border border-slate-900 bg-white flex items-center justify-center ${isVertical ? 'w-8 h-14 bottom-0' : 'h-8 w-14 right-0'} ${[5, 6, 7, 8].includes(num) && !isVertical ? 'top-0' : ''} ${num >= 17 ? 'h-16' : ''}`}>
          {renderText('film')}
          {renderSquare()}
        </div>
        <div className="absolute bottom-0 right-1 text-[10px] font-black text-slate-900">{num}</div>
      </div>
    </div>
  );
};

const ProductPrintModal: React.FC<ProductPrintModalProps> = ({ isOpen, onClose, product }) => {
  const [activeTab, setActiveTab] = useState<'tecnica' | 'ficha'>('tecnica');

  if (!isOpen || !product) return null;

  const client = dataService.getClients().find(c => c.id === product.clientId);
  const provider = dataService.getProviders().find(p => p.id === product.providerId);

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = () => {
    window.print();
  };

  return (
    <ModalOverlay variant="print">

      {/* HEADER DO MODAL COM SELEÇÃO DE ABAS */}
      <div className="w-full max-w-[210mm] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col transition-colors sticky top-0 z-50">
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-file-invoice text-xl"></i>
            </div>
            <div>
              <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter text-sm md:text-base">Visualização para Impressão</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Selecione o documento técnico abaixo</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center text-slate-400">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('tecnica')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === 'tecnica' ? 'border-blue-600 text-blue-600 bg-blue-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fas fa-flask mr-2"></i> Especificação Técnica
          </button>
          <button
            onClick={() => setActiveTab('ficha')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === 'ficha' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fas fa-print mr-2"></i> Ficha de Gravação
          </button>
        </div>
      </div>

      {/* DOCUMENTO A4 */}
      <div id="printable-area" className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl overflow-hidden print:shadow-none print:p-0 print:m-0 flex flex-col gap-6 relative">

        {/* CABEÇALHO PADRÃO */}
        <header className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              {activeTab === 'tecnica' ? 'Especificação Técnica' : 'Ficha de Gravação de Clichês'}
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ribersoluções Pack - Gestão de Embalagens</p>
            <p className="text-[10px] text-slate-400">Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="bg-slate-900 text-white px-3 py-1 text-[11px] font-black uppercase tracking-widest">{product.sku}</div>
            <div className="text-[10px] font-bold uppercase">{provider?.nomeFantasia}</div>
          </div>
        </header>

        {activeTab === 'tecnica' ? (
          /* CONTEÚDO: ESPECIFICAÇÃO TÉCNICA */
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <section className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="border-b border-slate-100 pb-1">
                <label className="text-[9px] font-black text-slate-400 uppercase block">Cliente</label>
                <p className="text-sm font-bold uppercase">{client?.nomeFantasia || client?.razaoSocial || 'N/A'}</p>
              </div>
              <div className="border-b border-slate-100 pb-1">
                <label className="text-[9px] font-black text-slate-400 uppercase block">Produto</label>
                <p className="text-sm font-bold uppercase">{product.nome}</p>
              </div>
            </section>

            <section className="space-y-4">
              <h4 className="bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-widest border-l-4 border-slate-900">Dados Técnicos da Embalagem</h4>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-b border-slate-100 pb-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase block">Estrutura Material</label>
                      <p className="text-xs font-bold">{product.material}</p>
                    </div>
                    <div className="border-b border-slate-100 pb-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase block">Tipo de Embalagem</label>
                      <p className="text-xs font-bold">{product.tipoEmbalagem}</p>
                    </div>
                    <div className="border-b border-slate-100 pb-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase block">Passo x Largura (mm)</label>
                      <p className="text-xs font-bold">{product.tipoEmbalagem.toLowerCase().includes('bobina') ? `${product.passo} x ${product.largura} mm` : product.medidas}</p>
                    </div>
                    <div className="border-b border-slate-100 pb-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase block">Gramatura / Espessura</label>
                      <p className="text-xs font-bold">{product.gramatura}g | {product.espessura}µ</p>
                    </div>
                    <div className="border-b border-slate-100 pb-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase block">Impressão</label>
                      <p className="text-xs font-bold uppercase">{product.personalizado ? `SIM - ${product.impressaoTipo}` : 'LISO'}</p>
                    </div>
                    <div className="border-b border-slate-100 pb-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase block">Cores</label>
                      <p className="text-xs font-bold">{product.cores.filter(c => c).join(', ') || 'Sem cores registradas'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-slate-100 pl-6">
                  <label className="text-[9px] font-black text-slate-400 uppercase mb-2">Sentido de Embobinamento</label>
                  {product.sentidoDesbobinamento ? (
                    <UnwindingPreview num={parseInt(product.sentidoDesbobinamento)} />
                  ) : (
                    <div className="text-[10px] italic text-slate-300">Não informado</div>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observações Técnicas</h4>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded text-xs min-h-[100px]">
                {product.observacoesTecnicas || "Nenhuma observação técnica adicional registrada."}
              </div>
            </section>
          </div>
        ) : (
          /* CONTEÚDO: FICHA DE GRAVAÇÃO */
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Identificação */}
            <section className="space-y-4">
              <h4 className="bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-900 uppercase tracking-widest border-l-4 border-indigo-600">Identificação da Ficha</h4>
              <div className="grid grid-cols-4 gap-4 text-xs">
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Nº Ficha</label>
                  <p className="font-bold">{product.fichaNumero || 'Pendente'}</p>
                </div>
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Data / Hora</label>
                  <p className="font-bold">{product.fichaData ? new Date(product.fichaData).toLocaleDateString('pt-BR') : '-'} {product.fichaHora}</p>
                </div>
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Modelo</label>
                  <p className="font-bold uppercase">{product.modeloEmbalagem || 'N/A'}</p>
                </div>
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Valor Clichê</label>
                  <p className="font-bold">R$ {product.valorCliche?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</p>
                </div>
                <div className="col-span-2 p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Cliente</label>
                  <p className="font-bold truncate">{client?.nomeFantasia || client?.razaoSocial}</p>
                </div>
                <div className="col-span-2 p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Faturamento Clichê</label>
                  <p className="font-bold uppercase">{product.faturamentoCliche || 'Fábrica'}</p>
                </div>
              </div>
            </section>

            {/* Parâmetros Técnicos */}
            <section className="space-y-4">
              <h4 className="bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-widest border-l-4 border-slate-600">Parâmetros Técnicos</h4>
              <div className="grid grid-cols-4 gap-4 text-xs">
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Tipo Impressão</label>
                  <p className="font-bold">{product.impressaoTipo}</p>
                </div>
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Máquina</label>
                  <p className="font-bold">{product.maquina || '-'}</p>
                </div>
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Cilindro/Camisa</label>
                  <p className="font-bold">{product.cilindroCamisa || '-'}</p>
                </div>
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Distorção (mm)</label>
                  <p className="font-bold">{product.distorcao || '-'}</p>
                </div>
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Deslocar / D.Face</label>
                  <p className="font-bold">{product.deslocar} / {product.duplaFace || '-'}</p>
                </div>
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Espessura Clichê</label>
                  <p className="font-bold">{product.espessuraCliche} mm</p>
                </div>
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Lineatura</label>
                  <p className="font-bold">{product.lineatura || '-'}</p>
                </div>
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Fotocélula</label>
                  <p className="font-bold">{product.fotocelula || '-'}</p>
                </div>
                <div className="col-span-2 p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Material / Filme Aberto</label>
                  <p className="font-bold truncate">{product.material} | {product.filmeAberto} mm</p>
                </div>
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Passo (mm)</label>
                  <p className="font-bold">{product.passo}</p>
                </div>
                <div className="p-2 border border-slate-100 rounded">
                  <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Largura (mm)</label>
                  <p className="font-bold">{product.largura}</p>
                </div>
              </div>
            </section>

            {/* Montagem e Cores */}
            <div className="grid grid-cols-2 gap-6">
              <section className="space-y-4">
                <h4 className="bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-widest border-l-4 border-slate-600">Montagem</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 border border-slate-100 rounded">
                    <label className="text-[8px] font-black text-slate-400 uppercase block">Longitudinal</label>
                    <p className="font-bold">{product.repeticaoLongitudinal || '-'}</p>
                  </div>
                  <div className="p-2 border border-slate-100 rounded">
                    <label className="text-[8px] font-black text-slate-400 uppercase block">Lateral</label>
                    <p className="font-bold">{product.repeticaoLateral || '-'}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-widest border-l-4 border-slate-600">Cores / Anilox</h4>
                <div className="p-2 border border-slate-100 rounded min-h-[50px] flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
                  {product.coresFicha?.filter(c => c).map((c, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="font-black text-indigo-500">{i + 1}:</span>
                      <span className="font-bold">{c}</span>
                    </div>
                  )) || <p className="italic text-slate-300">Nenhuma cor informada</p>}
                </div>
              </section>
            </div>

            <section className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observações da Gravação</h4>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded text-xs min-h-[80px]">
                {product.obsFicha || "Nenhuma observação técnica de gravação."}
              </div>
            </section>
          </div>
        )}

        {/* ASSINATURAS */}
        <footer className="mt-auto pt-10 grid grid-cols-2 gap-20">
          <div className="text-center">
            <div className="border-t border-slate-900 mt-4 pt-1">
              <p className="text-[10px] font-black uppercase tracking-widest">Responsável Comercial</p>
              <p className="text-[9px] text-slate-400">Ribersoluções Pack</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-900 mt-4 pt-1">
              <p className="text-[10px] font-black uppercase tracking-widest">Aprovação Cliente</p>
              <p className="text-[9px] text-slate-400">Data: ____/____/_______</p>
            </div>
          </div>
        </footer>

      </div>

      {/* FOOTER DO MODAL COM BOTÕES DE AÇÃO */}
      <div className="w-full max-w-[210mm] flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-6 rounded-b-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl z-50 transition-colors">
        <div className="text-[10px] font-bold text-slate-400 uppercase italic">
          Visualizando: {activeTab === 'tecnica' ? 'Especificação Técnica' : 'Ficha de Gravação'}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSavePDF}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <i className="fas fa-file-pdf"></i>
            Salvar em PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <i className="fas fa-print"></i>
            Imprimir
          </button>
        </div>
      </div>

      {/* CSS DE IMPRESSÃO INLINE */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background-color: white !important;
            color: black !important;
          }
          #root {
            display: none !important;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
            padding: 15mm;
            margin: 0;
            box-shadow: none;
            background-color: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
        @page {
          size: A4;
          margin: 0;
        }
      `}</style>
    </ModalOverlay>
  );
};

export default ProductPrintModal;
