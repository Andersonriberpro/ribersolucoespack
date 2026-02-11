
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { dataService } from '../services/dataService';
import { Order, Provider, ProductSpecification } from '../types';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const Dashboard: React.FC = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [products, setProducts] = useState<ProductSpecification[]>([]);
  const [budgetsCount, setBudgetsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, providersData, productsData, budgetsData] = await Promise.all([
          dataService.getOrders(),
          dataService.getProviders(),
          dataService.getProducts(),
          dataService.getBudgets()
        ]);
        setAllOrders(ordersData);
        setProviders(providersData);
        setProducts(productsData);
        setBudgetsCount(budgetsData.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered Orders logic
  const filteredOrders = useMemo(() => {
    return allOrders.filter(o => {
      const orderDate = new Date(o.dataPedido).getTime();
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      return orderDate >= start && orderDate <= end;
    });
  }, [allOrders, startDate, endDate]);

  // KPI Calculations based on Filtered Data
  const stats = useMemo(() => {
    const totalFaturado = filteredOrders.reduce((acc, o) => acc + o.valorFinal, 0);
    const totalComissao = filteredOrders.reduce((acc, o) => acc + o.comissaoValor, 0);
    const ativos = filteredOrders.filter(o => o.statusOperacional !== 'Cancelado').length;
    const aguardando = filteredOrders.filter(o => o.statusOperacional?.toLowerCase().includes('aguardando')).length;
    const cancelados = filteredOrders.filter(o => o.statusOperacional?.toLowerCase().includes('cancelado')).length;

    const conversionRate = budgetsCount > 0 ? (filteredOrders.length / budgetsCount) * 100 : 0;

    return { totalFaturado, totalComissao, ativos, aguardando, cancelados, conversionRate };
  }, [filteredOrders, budgetsCount]);

  // Data for Bar Chart (Billing by Month R$)
  const barDataBilling = useMemo(() => {
    const monthsData = MONTHS.map(m => ({ name: m, vendas: 0 }));
    filteredOrders.forEach(o => {
      const date = new Date(o.dataPedido);
      const monthIdx = date.getMonth();
      monthsData[monthIdx].vendas += o.valorFinal;
    });
    // Mostra apenas meses com dados ou o intervalo selecionado
    return monthsData.filter(m => m.vendas > 0 || !startDate);
  }, [filteredOrders, startDate]);

  // Data for Bar Chart (Volume in KG)
  const barDataKg = useMemo(() => {
    const monthsData = MONTHS.map(m => ({ name: m, kg: 0 }));

    filteredOrders.forEach(o => {
      const date = new Date(o.dataPedido);
      const monthIdx = date.getMonth();
      const product = products.find(p => p.id === o.productId);
      if (product) {
        let orderKg = 0;
        const isBobina = product.tipoEmbalagem.toLowerCase().includes('bobina');

        if (isBobina) {
          orderKg = o.quantidade;
        } else {
          const largura = parseFloat(product.largura || '0') || 0;
          const passo = parseFloat(product.passo || product.medidas.split('x')[1] || '0') || 0;
          const gramatura = parseFloat(product.gramatura) || 0;
          const pesoUnit = (passo * largura * gramatura) / 1000000;
          orderKg = pesoUnit * o.quantidade;
        }
        monthsData[monthIdx].kg += orderKg;
      }
    });
    return monthsData.filter(m => m.kg > 0 || !startDate);
  }, [filteredOrders, products, startDate]);

  // Data for Pie Chart (Billing by Provider)
  const pieData = useMemo(() => {
    const providerTotals: Record<string, number> = {};

    filteredOrders.forEach(o => {
      const provider = providers.find(p => p.id === o.providerId);
      const name = provider?.nomeFantasia || 'Outros';
      providerTotals[name] = (providerTotals[name] || 0) + o.valorFinal;
    });

    return Object.entries(providerTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredOrders, providers]);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Carregando Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard Executivo</h2>
          <p className="text-slate-500 dark:text-slate-400">Analise o desempenho com filtros temporais precisos.</p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex flex-col">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">De</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Até</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={clearFilters}
            className="mt-4 px-3 py-2 rounded-xl text-xs font-black uppercase text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
            title="Limpar Filtros"
          >
            <i className="fas fa-filter-circle-xmark"></i>
          </button>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Faturado', value: `R$ ${stats.totalFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`, icon: 'fa-money-bill-trend-up', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Comissões', value: `R$ ${stats.totalComissao.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`, icon: 'fa-hand-holding-dollar', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          { label: 'Pedidos Ativos', value: stats.ativos, icon: 'fa-box-open', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
          { label: 'Pedidos Aguardando', value: stats.aguardando, icon: 'fa-clock', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Pedidos Cancelados', value: stats.cancelados, icon: 'fa-ban', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10' },
          { label: 'Conversão', value: `${stats.conversionRate.toFixed(1)}%`, icon: 'fa-arrow-up-right-dots', color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center transition-all hover:shadow-md">
            <div className={`${kpi.bg} ${kpi.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <i className={`fas ${kpi.icon} text-lg`}></i>
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{kpi.label}</p>
            <h3 className="text-xl font-black mt-1 text-slate-900 dark:text-slate-100">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Bar Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Sales (R$) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold dark:text-slate-100">Volume de Vendas Mensal (R$)</h3>
              <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full uppercase">Faturamento</span>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barDataBilling}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(val) => `R$${val / 1000}k`} />
                  <Tooltip
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                    formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas']}
                    contentStyle={{ borderRadius: '16px', border: 'none', background: '#1e293b', color: '#f8fafc', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)' }}
                  />
                  <Bar dataKey="vendas" radius={[6, 6, 0, 0]} barSize={40}>
                    {barDataBilling.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#6366f1" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Sales (KG) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold dark:text-slate-100">Volume de Vendas em Kilos (kg)</h3>
              <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full uppercase">Peso Produzido</span>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barDataKg}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(val) => `${val.toLocaleString()} kg`} />
                  <Tooltip
                    cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                    formatter={(value: any) => [`${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg`, 'Volume']}
                    contentStyle={{ borderRadius: '16px', border: 'none', background: '#1e293b', color: '#f8fafc' }}
                  />
                  <Bar dataKey="kg" radius={[6, 6, 0, 0]} barSize={40}>
                    {barDataKg.map((entry, index) => (
                      <Cell key={`cell-kg-${index}`} fill="#10b981" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column - Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors h-fit sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold dark:text-slate-100">Faturamento por Representada</h3>
            <i className="fas fa-pie-chart text-slate-300"></i>
          </div>
          <div className="h-[400px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-pie-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => `R$ ${value.toLocaleString('pt-BR')}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e293b', color: '#f8fafc' }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    formatter={(value) => <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 italic gap-3">
                <i className="fas fa-chart-pie text-4xl opacity-20"></i>
                <p>Nenhum pedido no período.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
