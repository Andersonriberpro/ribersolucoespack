
import React, { useState } from 'react';
import { Order, Client, ProductSpecification, Provider, KanbanStatus } from '../types';
import { dataService } from '../services/dataService';
import SalesDocumentModal from './SalesDocumentModal';
import OrderPrintModal from './OrderPrintModal';
import PageHeader from './PageHeader';
import EmptyState from './EmptyState';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<ProductSpecification[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [ordData, cliData, prodData, provData] = await Promise.all([
        dataService.getOrders(),
        dataService.getClients(),
        dataService.getProducts(),
        dataService.getProviders()
      ]);
      setOrders(ordData);
      setClients(cliData);
      setProducts(prodData);
      setProviders(provData);
    } catch (error) {
      console.error('Error fetching order list data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (data: any) => {
    if (data.id) {
      await dataService.updateOrder(data.id, data);
    } else {
      await dataService.addOrder(data);
    }
    fetchData();
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleEdit = (order: Order) => {
    const product = products.find(p => p.id === order.productId);
    const orderForForm = {
      ...order,
      id: order.id,
      dataEmissao: order.dataPedido,
      unidade: product?.tipoEmbalagem.includes('Bobina') ? 'KG' : 'MIL',
      quantidadeMlh: order.quantidade,
      pesoTotalInput: order.quantidade,
    };
    setSelectedOrder(orderForForm);
    setIsModalOpen(true);
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido? Esta operação é irreversível.')) {
      await dataService.deleteOrder(orderId);
      fetchData();
    }
  };

  const handlePrint = (order: Order) => {
    setSelectedOrder(order);
    setIsPrintModalOpen(true);
  };

  const getStatusStyle = (status: KanbanStatus | undefined) => {
    switch (status) {
      case KanbanStatus.PROSPECCAO: return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700';
      case KanbanStatus.ORCAMENTO: return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case KanbanStatus.PEDIDO: return 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800';
      case KanbanStatus.DESENVOLVIMENTO: return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case KanbanStatus.FATURADO: return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Pedidos de Venda" subtitle="Gerenciamento operacional e faturamento de pedidos.">
        <button
          onClick={() => { setSelectedOrder(null); setIsModalOpen(true); }}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-none"
        >
          <i className="fas fa-cart-plus"></i> Novo Pedido
        </button>
      </PageHeader>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Lendo Pedidos...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-5">Identificação</th>
                  <th className="px-6 py-5">Cliente / Indústria</th>
                  <th className="px-6 py-5">Especificação</th>
                  <th className="px-6 py-5 text-center">Status Funil</th>
                  <th className="px-6 py-5 text-right">Valor Final</th>
                  <th className="px-6 py-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {orders.map(order => {
                  const client = clients.find(c => c.id === order.clientId);
                  const provider = providers.find(p => p.id === order.providerId);
                  const product = products.find(p => p.id === order.productId);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{order.numero}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{new Date(order.dataPedido).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{client?.nomeFantasia || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">{provider?.nomeFantasia || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-400">{product?.nome || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400 italic">{product?.tipoEmbalagem}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border transition-colors ${getStatusStyle(client?.status)}`}>
                          {client?.status || 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-black text-slate-900 dark:text-white">
                          R$ {order.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(order)}
                            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-900 transition shadow-sm flex items-center justify-center"
                            title="Editar Pedido"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-100 dark:hover:border-rose-900 transition shadow-sm flex items-center justify-center"
                            title="Excluir Pedido"
                          >
                            <i className="fas fa-trash-alt text-xs"></i>
                          </button>
                          <button
                            onClick={() => handlePrint(order)}
                            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-100 dark:hover:border-emerald-900 transition shadow-sm flex items-center justify-center"
                            title="Imprimir Pedido"
                          >
                            <i className="fas fa-print text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && orders.length === 0 && (
          <EmptyState icon="fa-box-open" message="Nenhum pedido de venda registrado." />
        )}
      </div>

      <SalesDocumentModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedOrder(null); }}
        mode="PEDIDO"
        onSave={handleSave}
        initialData={selectedOrder}
      />

      <OrderPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderList;
