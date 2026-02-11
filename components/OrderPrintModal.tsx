
import React from 'react';
import { Order, Client, ProductSpecification, Provider } from '../types';
import { dataService } from '../services/dataService';
import ModalOverlay from './ModalOverlay';

interface OrderPrintModalProps {
   isOpen: boolean;
   onClose: () => void;
   order: Order | null;
}

const OrderPrintModal: React.FC<OrderPrintModalProps> = ({ isOpen, onClose, order }) => {
   if (!isOpen || !order) return null;

   const client = dataService.getClients().find(c => c.id === order.clientId);
   const product = dataService.getProducts().find(p => p.id === order.productId);
   const provider = dataService.getProviders().find(p => p.id === order.providerId);

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
               <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <i className="fas fa-shopping-cart text-xl"></i>
               </div>
               <div>
                  <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter text-sm">Visualização Completa do Pedido</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Documento Oficial para Produção/Venda</p>
               </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center text-slate-400">
               <i className="fas fa-times text-xl"></i>
            </button>
         </div>

         {/* DOCUMENTO A4 */}
         <div id="printable-order" className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] p-[12mm] shadow-2xl overflow-hidden print:shadow-none print:p-0 print:m-0 flex flex-col gap-4 relative">

            {/* CABEÇALHO INTEGRADO */}
            <header className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
               <div className="flex items-center gap-4">
                  {provider?.logo ? (
                     <img src={provider.logo} alt="Logo" className="h-14 w-auto object-contain" />
                  ) : (
                     <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                        <i className="fas fa-industry text-xl"></i>
                     </div>
                  )}
                  <div className="flex flex-col">
                     <h1 className="text-lg font-black uppercase tracking-tighter leading-tight">{provider?.nomeFantasia || 'Ribersoluções Pack'}</h1>
                     <p className="text-[8px] font-bold text-slate-500 uppercase">{provider?.razaoSocial}</p>
                     <p className="text-[8px] text-slate-400 font-mono">CNPJ: {provider?.cnpj} | {provider?.cidade}-{provider?.estado}</p>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-1">
                  <div className="bg-slate-900 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">PEDIDO Nº {order.numero}</div>
                  <div className="flex gap-2 mt-1">
                     <span className="text-[8px] font-black border border-slate-200 px-1.5 py-0.5 uppercase tracking-tighter">Processo: {order.tipoProcesso || 'Novo'}</span>
                     <span className="text-[8px] font-black border border-slate-200 px-1.5 py-0.5 uppercase tracking-tighter">Cliente Novo: {order.clienteNovo || 'Não'}</span>
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase">Emissão: {new Date(order.dataPedido).toLocaleDateString('pt-BR')}</p>
               </div>
            </header>

            {/* SEÇÃO 1: DADOS DO CLIENTE E IDENTIFICAÇÃO DO PEDIDO */}
            <section className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <h4 className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-2 border-b border-indigo-100 pb-1 flex items-center gap-2">
                     <i className="fas fa-user-tie"></i> Dados do Cliente (Comprador)
                  </h4>
                  <div className="space-y-1 text-[9px]">
                     <p><span className="font-black text-slate-400 uppercase">Razão:</span> <span className="font-bold uppercase">{client?.razaoSocial}</span></p>
                     <p><span className="font-black text-slate-400 uppercase">CNPJ:</span> <span className="font-medium">{client?.documento}</span></p>
                     <p><span className="font-black text-slate-400 uppercase">Contato:</span> <span className="font-medium uppercase">{order.contato || client?.contato}</span></p>
                     <p><span className="font-black text-slate-400 uppercase">WhatsApp:</span> <span className="font-medium">{order.telefone || client?.whatsapp}</span></p>
                     <p><span className="font-black text-slate-400 uppercase">E-mail:</span> <span className="font-medium lowercase">{client?.email}</span></p>
                  </div>
               </div>
               <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <h4 className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-2 border-b border-indigo-100 pb-1 flex items-center gap-2">
                     <i className="fas fa-file-invoice"></i> Identificação Adicional
                  </h4>
                  <div className="space-y-1 text-[9px]">
                     <p><span className="font-black text-slate-400 uppercase">P.O. Cliente:</span> <span className="font-bold">{order.pedidoCompraCliente || 'N/A'}</span></p>
                     <p><span className="font-black text-slate-400 uppercase">Pedido Anterior:</span> <span className="font-medium">{order.numeroPedidoAnterior || '-'}</span></p>
                     <p><span className="font-black text-slate-400 uppercase">Prev. Entrega:</span> <span className="font-bold">{order.dataEntrega ? new Date(order.dataEntrega).toLocaleDateString('pt-BR') : 'A combinar'}</span></p>
                     <p><span className="font-black text-slate-400 uppercase">Frete:</span> <span className="font-bold text-indigo-700">{order.frete || 'CIF'}</span></p>
                     <p><span className="font-black text-slate-400 uppercase">Condição Pagto:</span> <span className="font-medium">{order.condicaoPagamento || 'Conforme cadastro'}</span></p>
                  </div>
               </div>
            </section>

            {/* SEÇÃO 2: LOGÍSTICA (ENTREGA E FATURAMENTO) */}
            <section className="grid grid-cols-2 gap-4">
               <div className="p-3 border border-slate-100 rounded">
                  <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <i className="fas fa-truck text-indigo-500"></i> Local de Entrega
                  </h4>
                  <p className="text-[9px] font-medium leading-tight">{order.entregaEndereco || client?.endereco}</p>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-[8px] font-bold text-slate-500">
                     <p>CEP: {order.entregaCEP || '-'}</p>
                     <p>{order.entregaCidade}/{order.entregaEstado}</p>
                     <p className="col-span-2">CNPJ Entrega: {order.entregaCNPJ || client?.documento}</p>
                  </div>
               </div>
               <div className="p-3 border border-slate-100 rounded">
                  <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <i className="fas fa-receipt text-indigo-500"></i> Dados de Faturamento
                  </h4>
                  <p className="text-[9px] font-medium leading-tight">{order.faturamentoEndereco || order.entregaEndereco || client?.endereco}</p>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-[8px] font-bold text-slate-500">
                     <p>CEP: {order.faturamentoCEP || order.entregaCEP || '-'}</p>
                     <p>{order.faturamentoCidade || order.entregaCidade}/{order.faturamentoEstado || order.entregaEstado}</p>
                     <p className="col-span-2">CNPJ Faturar: {order.faturamentoCNPJ || order.entregaCNPJ || client?.documento}</p>
                  </div>
               </div>
            </section>

            {/* SEÇÃO 3: ESPECIFICAÇÃO TÉCNICA DA EMBALAGEM */}
            <section className="bg-slate-900 text-white p-3 rounded">
               <div className="flex justify-between items-center border-b border-white/20 pb-1 mb-2">
                  <h4 className="text-[9px] font-black uppercase tracking-widest">Especificação Técnica do Produto</h4>
                  <span className="text-[8px] font-mono">{order.sku || product?.sku}</span>
               </div>
               <div className="grid grid-cols-4 gap-y-3 gap-x-6 text-[9px]">
                  <div className="col-span-2">
                     <label className="text-[7px] text-white/50 uppercase block">Nome do Produto</label>
                     <p className="font-black uppercase">{product?.nome}</p>
                  </div>
                  <div className="col-span-2">
                     <label className="text-[7px] text-white/50 uppercase block">Estrutura de Material</label>
                     <p className="font-bold">{order.composicaoEstrutura || product?.material}</p>
                  </div>

                  <div>
                     <label className="text-[7px] text-white/50 uppercase block">Largura (mm)</label>
                     <p className="font-bold">{order.largura || product?.largura || '-'} mm</p>
                  </div>
                  <div>
                     <label className="text-[7px] text-white/50 uppercase block">Passo (mm)</label>
                     <p className="font-bold">{order.passo || product?.passo || '-'} mm</p>
                  </div>
                  <div>
                     <label className="text-[7px] text-white/50 uppercase block">Gramatura / Espessura</label>
                     <p className="font-bold">{order.gramatura || product?.gramatura}g | {order.espessura || product?.espessura}µ</p>
                  </div>
                  <div>
                     <label className="text-[7px] text-white/50 uppercase block">Tipo de Impressão</label>
                     <p className="font-bold">{order.tipoImpressao || product?.impressaoTipo || 'LISO'}</p>
                  </div>

                  <div>
                     <label className="text-[7px] text-white/50 uppercase block">Sentido Desbob.</label>
                     <p className="font-bold">{order.sentidoDesbobinamento || product?.sentidoDesbobinamento || '-'}</p>
                  </div>
                  <div>
                     <label className="text-[7px] text-white/50 uppercase block">Ø Máximo Bobina</label>
                     <p className="font-bold">{order.diametroMaximoBobina || product?.diametroMaximoBobina || '-'}</p>
                  </div>
                  <div className="col-span-2">
                     <label className="text-[7px] text-white/50 uppercase block">Cores Cadastradas</label>
                     <p className="font-bold truncate">{product?.cores.filter(c => c).join(', ') || 'N/A'}</p>
                  </div>
               </div>
            </section>

            {/* SEÇÃO 4: TABELA COMERCIAL E VALORES */}
            <section className="mt-2">
               <table className="w-full border-collapse">
                  <thead>
                     <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-2 py-1.5 text-[8px] font-black uppercase tracking-widest text-left">Quantidade</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-[8px] font-black uppercase tracking-widest text-right">Preço Unitário</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-[8px] font-black uppercase tracking-widest text-right">IPI (%)</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-[8px] font-black uppercase tracking-widest text-right">ICMS (%)</th>
                        <th className="border border-slate-300 px-2 py-1.5 text-[8px] font-black uppercase tracking-widest text-right">Valor Final Pedido</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td className="border border-slate-300 px-2 py-3 text-[10px] font-black">
                           {order.quantidade.toLocaleString()} {order.unidade || (product?.tipoEmbalagem.toLowerCase().includes('bobina') ? 'KG' : 'MIL')}
                        </td>
                        <td className="border border-slate-300 px-2 py-3 text-[10px] text-right font-bold">
                           R$ {(order.precoUnitarioIcms || (order.valorFinal / order.quantidade / 1.0975)).toLocaleString('pt-BR', { minimumFractionDigits: 4 })}
                        </td>
                        <td className="border border-slate-300 px-2 py-3 text-[10px] text-right">
                           {order.percentualIPI || '9,75'}%
                        </td>
                        <td className="border border-slate-300 px-2 py-3 text-[10px] text-right">
                           {order.percentualIcms || '12,0'}%
                        </td>
                        <td className="border border-slate-300 px-2 py-3 text-xs font-black text-right bg-slate-50 text-indigo-700">
                           R$ {order.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                     </tr>
                  </tbody>
               </table>
               <div className="flex justify-end mt-1">
                  <p className="text-[7px] text-slate-400 italic">Preço Unitário calculado com base no valor líquido faturado pela representada.</p>
               </div>
            </section>

            {/* SEÇÃO 5: OBSERVAÇÕES E NOTAS */}
            <section className="bg-slate-50 p-3 rounded border border-slate-200">
               <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Observações Gerais do Pedido</h4>
               <div className="text-[9px] text-slate-600 min-h-[60px] leading-relaxed">
                  {order.obsGerais ? order.obsGerais : (
                     <p>Variação de quantidade permitida de +/- 10%. O faturamento será realizado pela representada informada no cabeçalho. O cliente declara estar ciente das especificações técnicas vinculadas a este pedido.</p>
                  )}
               </div>
               <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between">
                  <span className="text-[8px] font-bold text-slate-400 uppercase">E-mail para XML: {order.emailNfe || client?.email}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Vendedor: {order.vendedorNome || 'Carlos Silva'}</span>
               </div>
            </section>

            {/* SEÇÃO 6: ASSINATURAS E CONTROLES */}
            <footer className="mt-auto pt-10 grid grid-cols-3 gap-6">
               <div className="text-center flex flex-col items-center">
                  <div className="w-full border-t border-slate-900 pt-1">
                     <p className="text-[8px] font-black uppercase tracking-widest">{order.assinaturaCliente || 'Assinatura Cliente'}</p>
                     <p className="text-[7px] text-slate-400 uppercase">Data: ____/____/_______</p>
                  </div>
               </div>
               <div className="text-center flex flex-col items-center">
                  <div className="w-full border-t border-slate-900 pt-1">
                     <p className="text-[8px] font-black uppercase tracking-widest">{order.assinaturaAdmVendas || 'Adm. de Vendas'}</p>
                     <p className="text-[7px] text-slate-400 uppercase">Conferido Interno</p>
                  </div>
               </div>
               <div className="text-center flex flex-col items-center">
                  <div className="w-full border-t border-slate-900 pt-1">
                     <p className="text-[8px] font-black uppercase tracking-widest">{order.aprovacaoFinanceira || 'Aprovação Financeira'}</p>
                     <p className="text-[7px] text-slate-400 uppercase">Representada</p>
                  </div>
               </div>
            </footer>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[6px] text-slate-300 font-bold uppercase tracking-[0.4em]">
               RiberPack v2.4 - Sistema de Gestão Comercial e Gestão de Embalagens
            </div>

         </div>

         {/* FOOTER DO MODAL COM BOTÕES AZUIS */}
         <div className="w-full max-w-[210mm] flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-6 rounded-b-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl z-50 transition-colors">
            <div className="flex flex-col">
               <span className="text-[10px] font-bold text-slate-400 uppercase italic">Visualizando A4 Completo</span>
               <span className="text-[8px] text-slate-400 uppercase tracking-widest">{order.numero} | {client?.nomeFantasia}</span>
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

         {/* CSS DE IMPRESSÃO REFINADO */}
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
          #printable-order, #printable-order * {
            visibility: visible;
          }
          #printable-order {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
            padding: 12mm;
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

export default OrderPrintModal;
