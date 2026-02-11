
import React, { useState } from 'react';
import { Provider } from '../types';
import { dataService } from '../services/dataService';
import ProviderFormModal from './ProviderFormModal';
import PageHeader from './PageHeader';
import SearchInput from './SearchInput';
import EmptyState from './EmptyState';

const ProviderList: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [filter, setFilter] = useState('');

  const fetchProviders = async () => {
    try {
      const data = await dataService.getProviders();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProviders();
  }, []);

  const filteredProviders = providers.filter(p =>
    (p.nomeFantasia?.toLowerCase() || '').includes(filter.toLowerCase()) ||
    (p.razaoSocial?.toLowerCase() || '').includes(filter.toLowerCase())
  );

  const handleSave = async (data: any) => {
    if (data.id) {
      await dataService.updateProvider(data.id, data);
    } else {
      await dataService.addProvider(data);
    }
    fetchProviders();
    setIsModalOpen(false);
    setSelectedProvider(null);
  };

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedProvider(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Fornecedores & Representadas" subtitle="Gerencie as indústrias que você representa.">
        <SearchInput value={filter} onChange={setFilter} placeholder="Buscar fornecedor..." />
        <button
          onClick={handleNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
        >
          <i className="fas fa-plus"></i> Novo Fornecedor
        </button>
      </PageHeader>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Lendo Fornecedores...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map(provider => (
              <div key={provider.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all flex flex-col group">
                <div className="p-5 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center">
                  <div className="w-full flex justify-between items-start mb-4">
                    <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {provider.comissaoPadrao}% Comissão
                    </span>
                    <div className="flex gap-2 text-slate-400 dark:text-slate-600">
                      {provider.instagram && <i className="fab fa-instagram"></i>}
                      {provider.site && <i className="fas fa-globe"></i>}
                    </div>
                  </div>

                  <div className="mb-4 h-16 flex items-center justify-center">
                    {provider.logo ? (
                      <img src={provider.logo} alt={provider.nomeFantasia} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600">
                        <i className="fas fa-industry text-xl"></i>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg text-center leading-tight">{provider.nomeFantasia || provider.razaoSocial}</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1 uppercase font-bold tracking-wider">{provider.razaoSocial}</p>
                </div>

                <div className="p-5 space-y-3 flex-1">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <i className="fas fa-user-tie w-4 text-indigo-500"></i>
                    <span className="truncate">{provider.contatoComercial?.nome || 'Comercial'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <i className="fab fa-whatsapp w-4 text-emerald-500 font-bold"></i>
                    <span>{provider.whatsapp}</span>
                  </div>

                  <div className="pt-3">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Linha de Produção</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.linhaProdutos?.map(item => (
                        <span key={item} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-[10px] font-medium">
                          {item}
                        </span>
                      )) || <span className="text-xs italic text-slate-400">Nenhuma linha definida</span>}
                    </div>
                  </div>

                  <div className="pt-4 mt-auto flex gap-2">
                    <button
                      onClick={() => handleEdit(provider)}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded-lg text-xs font-bold transition-all border border-transparent dark:border-slate-700"
                    >
                      <i className="fas fa-edit mr-1"></i> Detalhes
                    </button>
                    <a
                      href={`https://wa.me/${(provider.whatsapp || '').replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center rounded-lg hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100/50 dark:border-emerald-500/20"
                    >
                      <i className="fab fa-whatsapp"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProviders.length === 0 && (
            <EmptyState icon="fa-industry" message="Nenhum fornecedor encontrado." />
          )}
        </>
      )}

      <ProviderFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedProvider(null); }}
        onSave={handleSave}
        initialData={selectedProvider}
      />
    </div>
  );
};

export default ProviderList;
