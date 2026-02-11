
import React, { useState } from 'react';
import { Budget, Client, ProductSpecification } from '../types';
import { dataService } from '../services/dataService';
import SalesDocumentModal from './SalesDocumentModal';
import BudgetPrintModal from './BudgetPrintModal';
import PageHeader from './PageHeader';
import EmptyState from './EmptyState';

const BudgetList: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<ProductSpecification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [budData, cliData, prodData] = await Promise.all([
        dataService.getBudgets(),
        dataService.getClients(),
        dataService.getProducts()
      ]);
      setBudgets(budData);
      setClients(cliData);
      setProducts(prodData);
    } catch (error) {
      console.error('Error fetching budget list data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (data: any) => {
    if (data.id) {
      const budgetData: Partial<Budget> = {
        numero: data.numero,
        clientId: data.clientId,
        productId: data.productId,
        quantidade: data.unidade === 'MIL' ? data.quantidadeMlh : data.pesoTotalInput,
        valorUnitario: data.precoUnitarioIcms,
        valorTotal: (data.unidade === 'MIL' ? data.quantidadeMlh : data.pesoTotalInput) * data.precoUnitarioIcms,
        validade: data.validadeOrcamento
      };
      await dataService.updateBudget(data.id, budgetData);
    } else {
      await dataService.addBudget(data);
    }
    fetchData();
    setIsModalOpen(false);
    setSelectedBudget(null);
  };

  const handleEdit = (budget: Budget) => {
    const product = products.find(p => p.id === budget.productId);
    const budgetForForm = {
      ...budget,
      precoUnitarioIcms: budget.valorUnitario,
      validadeOrcamento: budget.validade,
      unidade: product?.tipoEmbalagem.toLowerCase().includes('bobina') ? 'KG' : 'MIL',
      quantidadeMlh: budget.quantidade,
      pesoTotalInput: budget.quantidade
    };
    setSelectedBudget(budgetForForm);
    setIsModalOpen(true);
  };

  const handleDelete = async (budgetId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento? Esta ação não poderá ser desfeita.')) {
      await dataService.deleteBudget(budgetId);
      fetchData();
    }
  };

  const handlePrint = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Orçamentos Comercial" subtitle="Geração de propostas técnicas e comerciais.">
        <button
          onClick={() => { setSelectedBudget(null); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
        >
          <i className="fas fa-plus"></i> Novo Orçamento
        </button>
      </PageHeader>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Lendo Orçamentos...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">Nº / Data</th>
                  <th className="px-6 py-4">Cliente / Produto</th>
                  <th className="px-6 py-4">Quantidade</th>
                  <th className="px-6 py-4">Valor Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {budgets.map(budget => {
                  const client = clients.find(c => c.id === budget.clientId);
                  const product = products.find(p => p.id === budget.productId);
                  return (
                    <tr key={budget.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{budget.numero}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{new Date(budget.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700 dark:text-slate-300">{client?.nomeFantasia || 'N/A'}</div>
                        <div className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">{product?.nome || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                        {budget.quantidade.toLocaleString()} {product?.tipoEmbalagem?.toLowerCase().includes('bobina') ? 'Kg' : 'MIL'}
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                        R$ {budget.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border border-blue-100 dark:border-blue-900/30">
                          {budget.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(budget)}
                            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-sm flex items-center justify-center"
                            title="Editar Orçamento"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(budget.id)}
                            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 transition shadow-sm flex items-center justify-center"
                            title="Excluir Orçamento"
                          >
                            <i className="fas fa-trash-alt text-xs"></i>
                          </button>
                          <button
                            onClick={() => handlePrint(budget)}
                            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-sm flex items-center justify-center"
                            title="Imprimir Orçamento"
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
        {!isLoading && budgets.length === 0 && (
          <EmptyState icon="fa-file-invoice-dollar" message="Nenhum orçamento cadastrado ainda." />
        )}
      </div>

      <SalesDocumentModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedBudget(null); }}
        mode="ORÇAMENTO"
        onSave={handleSave}
        initialData={selectedBudget}
      />

      <BudgetPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        budget={selectedBudget}
      />
    </div>
  );
};

export default BudgetList;
