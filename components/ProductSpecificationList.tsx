
import React, { useState } from 'react';
import { ProductSpecification, Provider, Client } from '../types';
import { dataService } from '../services/dataService';
import ProductFormModal from './ProductFormModal';
import ProductPrintModal from './ProductPrintModal';
import PageHeader from './PageHeader';
import SearchInput from './SearchInput';
import EmptyState from './EmptyState';

const ProductSpecificationList: React.FC = () => {
  const [products, setProducts] = useState<ProductSpecification[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductSpecification | null>(null);
  const [filter, setFilter] = useState('');

  const fetchData = async () => {
    try {
      const [prodData, provData, cliData] = await Promise.all([
        dataService.getProducts(),
        dataService.getProviders(),
        dataService.getClients()
      ]);
      setProducts(prodData);
      setProviders(provData);
      setClients(cliData);
    } catch (error) {
      console.error('Error fetching product list data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = products.filter(p =>
    (p.nome?.toLowerCase() || '').includes(filter.toLowerCase()) ||
    (p.sku?.toLowerCase() || '').includes(filter.toLowerCase()) ||
    providers.find(prov => prov.id === p.providerId)?.nomeFantasia.toLowerCase().includes(filter.toLowerCase()) ||
    clients.find(cli => cli.id === p.clientId)?.nomeFantasia.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSave = async (data: any) => {
    if (data.id) {
      await dataService.updateProduct(data.id, data);
    } else {
      await dataService.addProduct(data);
    }
    fetchData();
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEdit = (product: ProductSpecification) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handlePrint = (product: ProductSpecification) => {
    setSelectedProduct(product);
    setIsPrintModalOpen(true);
  };

  const handleNew = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Especificação Técnica" subtitle="Gestão centralizada de fichas técnicas e produtos.">
        <SearchInput value={filter} onChange={setFilter} placeholder="Buscar por produto, SKU, fornecedor..." />
        <button
          onClick={handleNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
        >
          <i className="fas fa-plus"></i> Nova Especificação
        </button>
      </PageHeader>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Lendo Fichas Técnicas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100 dark:border-slate-800 transition-colors">
                  <th className="px-6 py-4">SKU / Produto</th>
                  <th className="px-6 py-4">Cliente / Representada</th>
                  <th className="px-6 py-4">Tipo de Embalagem</th>
                  <th className="px-6 py-4">Medidas Técnicas</th>
                  <th className="px-6 py-4">Cores</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredProducts.map(product => {
                  const provider = providers.find(p => p.id === product.providerId);
                  const client = clients.find(c => c.id === product.clientId);
                  const isBobina = product.tipoEmbalagem?.toLowerCase().includes('bobina');
                  const coresAtivas = product.cores?.filter(c => c !== '') || [];

                  return (
                    <tr key={product.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition group cursor-default">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-indigo-500 font-bold mb-0.5">{product.sku}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{product.nome}</span>
                          <span className={`text-[9px] font-black uppercase mt-1 w-fit px-1.5 py-0.5 rounded ${product.personalizado ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                            {product.personalizado ? 'Impresso' : 'Liso'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <i className="fas fa-user-circle text-slate-300 text-xs"></i>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{client?.nomeFantasia || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <i className="fas fa-industry text-slate-300 text-[10px]"></i>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{provider?.nomeFantasia || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs font-semibold">
                          {product.tipoEmbalagem}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-700 dark:text-slate-200 font-bold">
                            {isBobina
                              ? `${product.passo || '0'} (P) x ${product.largura || '0'} (L)`
                              : (product.medidas || 'N/A')}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{product.material} | {product.espessura}µ</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {coresAtivas.length > 0 ? (
                            <>
                              <div className="flex -space-x-1">
                                {coresAtivas.slice(0, 3).map((_, i) => (
                                  <div key={i} className="w-4 h-4 rounded-full border border-white dark:border-slate-700 bg-slate-200 dark:bg-slate-700 flex items-center justify-center" title="Cor configurada">
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                  </div>
                                ))}
                              </div>
                              {coresAtivas.length > 3 && (
                                <span className="text-[10px] font-bold text-slate-400">+{coresAtivas.length - 3}</span>
                              )}
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-300 italic">Sem cores</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition shadow-sm flex items-center justify-center"
                            title="Editar"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          <button
                            onClick={() => handlePrint(product)}
                            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition shadow-sm flex items-center justify-center"
                            title="Imprimir Ficha"
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
        {!isLoading && filteredProducts.length === 0 && (
          <EmptyState icon="fa-flask" message="Nenhuma especificação técnica encontrada." />
        )}
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedProduct}
      />

      <ProductPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductSpecificationList;
