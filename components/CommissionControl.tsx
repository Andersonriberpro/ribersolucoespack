
import React, { useState, useMemo } from 'react';
import { Order, CommissionStatus, Provider, Client } from '../types';
import { dataService } from '../services/dataService';
import PageHeader from './PageHeader';

const CommissionControl: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [ordData, provData, cliData] = await Promise.all([
        dataService.getOrders(),
        dataService.getProviders(),
        dataService.getClients()
      ]);
      setOrders(ordData);
      setProviders(provData);
      setClients(cliData);
    } catch (error) {
      console.error('Error fetching commission data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Calculations
  const totalFaturado = useMemo(() => orders.reduce((acc, curr) => acc + (curr.valorFinal || 0), 0), [orders]);
  const totalComissao = useMemo(() => orders.reduce((acc, curr) => acc + (curr.comissaoValor || 0), 0), [orders]);
  const pagaComissao = useMemo(() => orders.filter(o => o.comissaoStatus === CommissionStatus.PAGA).reduce((acc, curr) => acc + (curr.comissaoValor || 0), 0), [orders]);
  const pendenteComissao = totalComissao - pagaComissao;

  // Grouped Data for Panels
  const billingByProvider = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => {
      map[o.providerId] = (map[o.providerId] || 0) + o.valorFinal;
    });
    return Object.entries(map).map(([id, total]) => ({
      name: providers.find(p => p.id === id)?.nomeFantasia || 'Desconhecido',
      total
    })).sort((a, b) => b.total - a.total);
  }, [orders, providers]);

  const getStatusColor = (status: CommissionStatus) => {
    switch (status) {
      case CommissionStatus.PREVISTA: return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      case CommissionStatus.FATURADA: return 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30';
      case CommissionStatus.PAGA: return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-500';
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Representada', 'Cliente', 'Pedido/NF', 'Data', 'Valor Pedido (R$)', 'Comissão (R$)', 'Status'];
    const rows = orders.map(o => {
      const provider = providers.find(p => p.id === o.providerId)?.nomeFantasia || 'N/A';
      const client = clients.find(c => c.id === o.clientId)?.nomeFantasia || 'N/A';
      return [
        provider,
        client,
        o.numero,
        new Date(o.dataPedido).toLocaleDateString('pt-BR'),
        o.valorFinal.toFixed(2).replace('.', ','),
        o.comissaoValor.toFixed(2).replace('.', ','),
        o.comissaoStatus
      ];
    });

    const csvContent = [
      headers.join(';'),
      ...rows.map(r => r.join(';'))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `comissoes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Controle de Comissões" subtitle="Gestão de faturamento e recebíveis de representação.">
        <button
          onClick={handlePrintReport}
          className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-2"
        >
          <i className="fas fa-file-pdf text-rose-500"></i> Relatório Mensal
        </button>
        <button
          onClick={handleExportCSV}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 shadow-md transition flex items-center gap-2"
        >
          <i className="fas fa-download"></i> Exportar Dados
        </button>
      </PageHeader>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Lendo Comissões...</p>
        </div>
      ) : (
        <>
          {/* Main KPI Panels */}
          <div id="printable-commission-summary" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Faturado Total', value: totalFaturado, icon: 'fa-file-invoice', bg: 'bg-indigo-50 dark:bg-indigo-500/10', color: 'text-indigo-600 dark:text-indigo-400', desc: 'SOMA DE TODOS OS PEDIDOS' },
              { label: 'Comissão Bruta', value: totalComissao, icon: 'fa-hourglass-half', bg: 'bg-amber-50 dark:bg-amber-500/10', color: 'text-amber-600 dark:text-amber-400', desc: 'PREVISÃO TOTAL DE GANHOS' },
              { label: 'Comissão Recebida', value: pagaComissao, icon: 'fa-check-circle', bg: 'bg-emerald-50 dark:bg-emerald-500/10', color: 'text-emerald-600 dark:text-emerald-400', desc: 'VALORES JÁ PAGOS' },
              { label: 'A Receber', value: pendenteComissao, icon: 'fa-exclamation-triangle', bg: 'bg-rose-50 dark:bg-rose-500/10', color: 'text-rose-600 dark:text-rose-400', desc: 'AGUARDANDO PAGAMENTO' }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center text-lg`}>
                    <i className={`fas ${kpi.icon}`}></i>
                  </div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                </div>
                <h3 className={`text-2xl font-black ${idx > 1 ? kpi.color : 'text-slate-900 dark:text-white'}`}>
                  R$ {kpi.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium uppercase">{kpi.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <i className="fas fa-industry text-indigo-500"></i> Faturado por Representada
              </h4>
              <div className="space-y-4 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                {billingByProvider.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-600 dark:text-slate-400">{item.name}</span>
                      <span className="font-bold text-slate-900 dark:text-white">R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="w-full bg-slate-50 dark:bg-slate-800 h-1.5 rounded-full">
                      <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${(item.total / (totalFaturado || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div id="printable-commission-extract" className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <i className="fas fa-list-ul text-indigo-600"></i> Extrato Detalhado de Comissões
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white dark:bg-slate-900 text-slate-400 text-[10px] uppercase tracking-wider font-black border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4">Representada</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Pedido / NF</th>
                    <th className="px-6 py-4 text-right">Comissão (R$)</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center no-print">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[13px]">
                  {orders.map(order => {
                    const providerName = providers.find(p => p.id === order.providerId)?.nomeFantasia || 'N/A';
                    const clientName = clients.find(c => c.id === order.clientId)?.nomeFantasia || 'N/A';
                    return (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{providerName}</td>
                        <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">{clientName}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 dark:text-white">{order.numero}</div>
                          <div className="text-[10px] text-slate-400">{new Date(order.dataPedido).toLocaleDateString('pt-BR')}</div>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-indigo-600 dark:text-indigo-400">R$ {order.comissaoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusColor(order.comissaoStatus)}`}>
                            {order.comissaoStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center no-print">
                          <button className="text-slate-400 hover:text-indigo-600 transition" title="Ver detalhes do pedido">
                            <i className="fas fa-external-link-alt text-xs"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background-color: white !important;
          }
          #root {
            display: none !important;
          }
          #printable-commission-summary, 
          #printable-commission-summary *,
          #printable-commission-extract,
          #printable-commission-extract * {
            visibility: visible;
          }
          #printable-commission-summary {
            position: absolute;
            left: 0;
            top: 40px;
            width: 100%;
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 10px !important;
          }
          #printable-commission-extract {
            position: absolute;
            left: 0;
            top: 250px;
            width: 100%;
            border: 1px solid #e2e8f0;
          }
          .no-print {
            display: none !important;
          }
          header {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default CommissionControl;
