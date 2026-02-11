
import React from 'react';
import { Budget, Client, ProductSpecification, Provider } from '../types';
import { dataService } from '../services/dataService';
import ModalOverlay from './ModalOverlay';

interface BudgetPrintModalProps {
   isOpen: boolean;
   onClose: () => void;
   budget: Budget | null;
}

const BudgetPrintModal: React.FC<BudgetPrintModalProps> = ({ isOpen, onClose, budget }) => {
   if (!isOpen || !budget) return null;

   const client = dataService.getClients().find(c => c.id === budget.clientId);
   const product = dataService.getProducts().find(p => p.id === budget.productId);
   const provider = product ? dataService.getProviders().find(p => p.id === product.providerId) : null;

   const handlePrint = () => {
      window.print();
   };

   const handleSavePDF = () => {
      window.print();
   };

   return (
      <ModalOverlay variant="print">

         {/* HEADER DO MODAL */}
         <div className="w-full max-w-[210mm] flex justify-between items-center bg-white dark:bg-slate-900 px-6 py-4 rounded-t-3xl border-b border-slate-200 dark:border-slate-800 shadow-xl mb-0 sticky top-0 z-50">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <i className="fas fa-file-invoice-dollar text-xl"></i>
               </div>
               <div>
                  <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter text-sm">Visualização de Orçamento</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Documento Proposta A4</p>
               </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center text-slate-400">
               <i className="fas fa-times text-xl"></i>
            </button>
         </div>

         {/* DOCUMENTO A4 */}
         <div id="printable-budget" className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl overflow-hidden print:shadow-none print:p-0 print:m-0 flex flex-col gap-6 relative">

            {/* CABEÇALHO */}
            <header className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
               <div className="flex items-center gap-4">
                  {provider?.logo ? (
                     <img src={provider.logo} alt="Logo" className="h-16 w-auto object-contain" />
                  ) : (
                     <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                        <i className="fas fa-industry text-2xl"></i>
                     </div>
                  )}
                  <div className="flex flex-col">
                     <h1 className="text-xl font-black uppercase tracking-tighter">{provider?.nomeFantasia || 'Ribersoluções Pack'}</h1>
                     <p className="text-[9px] font-bold text-slate-500 uppercase">{provider?.razaoSocial}</p>
                     <p className="text-[9px] text-slate-400">CNPJ: {provider?.cnpj}</p>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-1">
                  <div className="bg-slate-900 text-white px-4 py-1 text-[11px] font-black uppercase tracking-widest">Orçamento Nº {budget.numero}</div>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Emissão: {new Date(budget.createdAt).toLocaleDateString('pt-BR')}</p>
               </div>
            </header>

            {/* DADOS DO CLIENTE */}
            <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <i className="fas fa-user-tie"></i> Identificação do Cliente
               </h4>
               <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <div>
                     <label className="text-[8px] font-black text-slate-400 uppercase block">Cliente</label>
                     <p className="text-xs font-bold uppercase">{client?.nomeFantasia || client?.razaoSocial}</p>
                  </div>
                  <div>
                     <label className="text-[8px] font-black text-slate-400 uppercase block">Contato</label>
                     <p className="text-xs font-medium uppercase">{client?.contato || 'N/A'}</p>
                  </div>
                  <div>
                     <label className="text-[8px] font-black text-slate-400 uppercase block">CNPJ / CPF</label>
                     <p className="text-xs font-medium">{client?.documento}</p>
                  </div>
                  <div>
                     <label className="text-[8px] font-black text-slate-400 uppercase block">Telefone</label>
                     <p className="text-xs font-medium">{client?.whatsapp}</p>
                  </div>
               </div>
            </section>

            {/* DADOS TÉCNICOS */}
            <section className="space-y-4">
               <h4 className="bg-slate-900 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">Especificação da Embalagem</h4>
               <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="border-b border-slate-100 pb-1">
                     <label className="text-[8px] font-black text-slate-400 uppercase block">Produto</label>
                     <p className="font-bold uppercase">{product?.nome}</p>
                  </div>
                  <div className="border-b border-slate-100 pb-1">
                     <label className="text-[8px] font-black text-slate-400 uppercase block">Estrutura</label>
                     <p className="font-bold">{product?.material}</p>
                  </div>
                  <div className="border-b border-slate-100 pb-1">
                     <label className="text-[8px] font-black text-slate-400 uppercase block">Tipo</label>
                     <p className="font-bold">{product?.tipoEmbalagem}</p>
                  </div>
                  <div className="border-b border-slate-100 pb-1">
                     <label className="text-[8px] font-black text-slate-400 uppercase block">Medidas</label>
                     <p className="font-bold">{product?.tipoEmbalagem.toLowerCase().includes('bobina') ? `${product.passo} x ${product.largura} mm` : product?.medidas}</p>
                  </div>
               </div>
            </section>

            {/* TABELA DE ITENS */}
            <section className="mt-4">
               <table className="w-full border-collapse">
                  <thead>
                     <tr className="bg-slate-100">
                        <th className="border border-slate-200 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-left">Quantidade</th>
                        <th className="border border-slate-200 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-right">Preço Unitário</th>
                        <th className="border border-slate-200 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-right">IPI (%)</th>
                        <th className="border border-slate-200 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-right">Subtotal</th>
                        <th className="border border-slate-200 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-right">Total Final</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td className="border border-slate-200 px-3 py-4 text-xs font-bold">
                           {budget.quantidade.toLocaleString()} {product?.tipoEmbalagem.toLowerCase().includes('bobina') ? 'Kg' : 'MIL'}
                        </td>
                        <td className="border border-slate-200 px-3 py-4 text-xs text-right">
                           R$ {budget.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 4 })}
                        </td>
                        <td className="border border-slate-200 px-3 py-4 text-xs text-right">
                           9,75%
                        </td>
                        <td className="border border-slate-200 px-3 py-4 text-xs text-right">
                           R$ {budget.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="border border-slate-200 px-3 py-4 text-sm font-black text-right bg-slate-50">
                           R$ {(budget.valorTotal * 1.0975).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                     </tr>
                  </tbody>
               </table>
            </section>

            {/* CONDIÇÕES COMERCIAIS */}
            <section className="grid grid-cols-2 gap-6 mt-4">
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Condições Gerais</h4>
                  <div className="space-y-2 text-[10px]">
                     <p><span className="font-black">FRETE:</span> CIF (Incluso no preço)</p>
                     <p><span className="font-black">PAGAMENTO:</span> {provider?.condicoesComerciais || 'A combinar'}</p>
                     <p><span className="font-black">PRAZO PRODUÇÃO:</span> {provider?.prazoProducao || '15-20 dias úteis'}</p>
                     <p><span className="font-black">VALIDADE PROPOSTA:</span> {new Date(budget.validade).toLocaleDateString('pt-BR')}</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Observações</h4>
                  <p className="text-[10px] text-slate-500 italic leading-relaxed">
                     O valor de clichê/gravação será faturado separadamente após aprovação do layout final.
                     A variação de quantidade permitida é de +/- 10% do total pedido.
                  </p>
               </div>
            </section>

            {/* ASSINATURAS */}
            <footer className="mt-auto pt-16 grid grid-cols-2 gap-20">
               <div className="text-center">
                  <div className="border-t border-slate-900 pt-1">
                     <p className="text-[9px] font-black uppercase tracking-widest">Responsável Comercial</p>
                     <p className="text-[8px] text-slate-400">Ribersoluções Pack</p>
                  </div>
               </div>
               <div className="text-center">
                  <div className="border-t border-slate-900 pt-1">
                     <p className="text-[9px] font-black uppercase tracking-widest">De acordo do Cliente</p>
                     <p className="text-[8px] text-slate-400">Data: ____/____/_______</p>
                  </div>
               </div>
            </footer>

            {/* MARCA D'ÁGUA OU RODAPÉ TÉCNICO */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[7px] text-slate-300 font-bold uppercase tracking-[0.3em]">
               Gerado via RiberPack v2.4 - Sistema de Gestão de Embalagens
            </div>

         </div>

         {/* FOOTER DO MODAL COM BOTÕES AZUIS */}
         <div className="w-full max-w-[210mm] flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-6 rounded-b-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl z-50 transition-colors">
            <div className="text-[10px] font-bold text-slate-400 uppercase italic">
               Visualizando Orçamento A4
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

         {/* CSS DE IMPRESSÃO */}
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
          #printable-budget, #printable-budget * {
            visibility: visible;
          }
          #printable-budget {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
            padding: 15mm;
            margin: 0;
            box-shadow: none;
            background-color: white !important;
            z-index: 9999;
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

export default BudgetPrintModal;
