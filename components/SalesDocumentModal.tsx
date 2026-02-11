
import React, { useState, useEffect, useMemo } from 'react';
import { ProductSpecification, Provider, Client, BudgetStatus, CommissionStatus } from '../types';
import { dataService } from '../services/dataService';
import ModalOverlay from './ModalOverlay';

interface SalesDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'ORÇAMENTO' | 'PEDIDO';
  onSave: (data: any) => void;
  initialData?: any;
}

const SalesDocumentModal: React.FC<SalesDocumentModalProps> = ({ isOpen, onClose, mode, onSave, initialData }) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<ProductSpecification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [provData, cliData, prodData] = await Promise.all([
        dataService.getProviders(),
        dataService.getClients(),
        dataService.getProducts()
      ]);
      setProviders(provData);
      setClients(cliData);
      setProducts(prodData);
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

  const [formData, setFormData] = useState({
    id: '',
    numero: '',
    tipoProcesso: 'Novo',
    clienteNovo: 'Não',
    clientId: '',
    contato: '',
    telefone: '',
    productId: '',
    sku: '',
    barcode: '',
    providerId: '',
    pedidoCompraCliente: '',
    numeroPedidoAnterior: '',
    condicaoPagamento: '',
    entradaPercent: 0,
    parcelamento: '',
    frete: 'CIF',
    dataEntrega: '',
    validadeOrcamento: '',
    entregaEndereco: '',
    entregaCEP: '',
    entregaCidade: '',
    entregaEstado: '',
    entregaCNPJ: '',
    entregaIE: '',
    faturamentoMesmoEntrega: true,
    faturamentoEndereco: '',
    faturamentoCEP: '',
    faturamentoCidade: '',
    faturamentoEstado: '',
    faturamentoCNPJ: '',
    faturamentoIE: '',
    composicaoEstrutura: '',
    composicaoEstrutura2: '',
    largura: 0,
    passo: 0,
    gramatura: 0,
    espessura: 0,
    largura2: 0,
    passo2: 0,
    gramatura2: 0,
    espessura2: 0,
    largura3: 0,
    passo3: 0,
    gramatura3: 0,
    espessura3: 0,
    sentidoDesbobinamento: '',
    tipoImpressao: 'Externa',
    diametroMaximoBobina: '',
    unidade: 'MIL',
    quantidadeMlh: 0,
    pesoTotalInput: 0,
    precoUnitarioIcms: 0,
    precoPorMlhIcms: 0,
    percentualIPI: 9.75,
    percentualIcms: 12.0,
    emailNfe: '',
    obsGerais: '',
    dataEmissao: new Date().toISOString().split('T')[0],
    vendedorNome: 'Carlos Silva',
    vendedorTel: '(11) 99999-8888',
    assinaturaCliente: '',
    assinaturaAdmVendas: '',
    aprovacaoFinanceira: '',
    dataFinalDoc: ''
  });

  const currentProvider = useMemo(() => {
    return providers.find(p => p.id === formData.providerId) || null;
  }, [formData.providerId, providers]);

  const filteredProducts = useMemo(() => {
    if (!formData.providerId) return products;
    return products.filter(p => p.providerId === formData.providerId);
  }, [formData.providerId, products]);

  // Sincronização ao abrir com dados iniciais
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        id: initialData.id || ''
      }));
    } else if (isOpen) {
      // Reset form on new document
      setFormData({
        id: '',
        numero: '',
        tipoProcesso: 'Novo',
        clienteNovo: 'Não',
        clientId: '',
        contato: '',
        telefone: '',
        productId: '',
        sku: '',
        barcode: '',
        providerId: '',
        pedidoCompraCliente: '',
        numeroPedidoAnterior: '',
        condicaoPagamento: '',
        entradaPercent: 0,
        parcelamento: '',
        frete: 'CIF',
        dataEntrega: '',
        validadeOrcamento: '',
        entregaEndereco: '',
        entregaCEP: '',
        entregaCidade: '',
        entregaEstado: '',
        entregaCNPJ: '',
        entregaIE: '',
        faturamentoMesmoEntrega: true,
        faturamentoEndereco: '',
        faturamentoCEP: '',
        faturamentoCidade: '',
        faturamentoEstado: '',
        faturamentoCNPJ: '',
        faturamentoIE: '',
        composicaoEstrutura: '',
        composicaoEstrutura2: '',
        largura: 0,
        passo: 0,
        gramatura: 0,
        espessura: 0,
        largura2: 0,
        passo2: 0,
        gramatura2: 0,
        espessura2: 0,
        largura3: 0,
        passo3: 0,
        gramatura3: 0,
        espessura3: 0,
        sentidoDesbobinamento: '',
        tipoImpressao: 'Externa',
        diametroMaximoBobina: '',
        unidade: 'MIL',
        quantidadeMlh: 0,
        pesoTotalInput: 0,
        precoUnitarioIcms: 0,
        precoPorMlhIcms: 0,
        percentualIPI: 9.75,
        percentualIcms: 12.0,
        emailNfe: '',
        obsGerais: '',
        dataEmissao: new Date().toISOString().split('T')[0],
        vendedorNome: 'Carlos Silva',
        vendedorTel: '(11) 99999-8888',
        assinaturaCliente: '',
        assinaturaAdmVendas: '',
        aprovacaoFinanceira: '',
        dataFinalDoc: ''
      });
    }
  }, [initialData, isOpen]);

  // Sincronização de Faturamento com Entrega
  useEffect(() => {
    if (formData.faturamentoMesmoEntrega) {
      setFormData(prev => ({
        ...prev,
        faturamentoEndereco: prev.entregaEndereco,
        faturamentoCEP: prev.entregaCEP,
        faturamentoCidade: prev.entregaCidade,
        faturamentoEstado: prev.entregaEstado,
        faturamentoCNPJ: prev.entregaCNPJ,
        faturamentoIE: prev.entregaIE
      }));
    }
  }, [
    formData.faturamentoMesmoEntrega,
    formData.entregaEndereco,
    formData.entregaCEP,
    formData.entregaCidade,
    formData.entregaEstado,
    formData.entregaCNPJ,
    formData.entregaIE
  ]);

  useEffect(() => {
    if (formData.productId && !initialData) {
      const prod = products.find(p => p.id === formData.productId);
      if (prod) {
        setFormData(prev => ({
          ...prev,
          providerId: prev.providerId || prod.providerId,
          sku: prod.sku || '',
          barcode: prod.barcode || '',
          largura: parseFloat(prod.largura || '0') || 0,
          passo: parseFloat(prod.passo || prod.medidas.split('x')[1] || '0') || 0,
          gramatura: parseFloat(prod.gramatura) || 0,
          espessura: parseFloat(prod.espessura) || 0,
          sentidoDesbobinamento: prod.sentidoDesbobinamento || '',
          diametroMaximoBobina: prod.diametroMaximoBobina || '',
          tipoImpressao: prod.impressaoTipo || 'Externa',
          composicaoEstrutura: prod.material || ''
        }));
      }
    }
  }, [formData.productId, products, initialData]);

  useEffect(() => {
    if (formData.clientId && !initialData) {
      const cli = clients.find(c => c.id === formData.clientId);
      if (cli) {
        setFormData(prev => ({
          ...prev,
          contato: cli.contato,
          telefone: cli.whatsapp,
          entregaEndereco: cli.endereco,
          entregaCNPJ: cli.documento,
          emailNfe: cli.email
        }));
      }
    }
  }, [formData.clientId, clients, initialData]);

  const pesoUnitario = useMemo(() => {
    const calc = (formData.passo * formData.largura * formData.gramatura) / 1000000;
    return isNaN(calc) ? 0 : calc;
  }, [formData.passo, formData.largura, formData.gramatura]);

  const rendimento = useMemo(() => {
    return pesoUnitario > 0 ? (1000 / pesoUnitario) : 0;
  }, [pesoUnitario]);

  const pesoUnitario2 = useMemo(() => {
    const calc = (formData.passo2 * formData.largura2 * formData.gramatura2) / 1000000;
    return isNaN(calc) ? 0 : calc;
  }, [formData.passo2, formData.largura2, formData.gramatura2]);

  const rendimento2 = useMemo(() => {
    return pesoUnitario2 > 0 ? (1000 / pesoUnitario2) : 0;
  }, [pesoUnitario2]);

  const pesoUnitario3 = useMemo(() => {
    const calc = (formData.passo3 * formData.largura3 * formData.gramatura3) / 1000000;
    return isNaN(calc) ? 0 : calc;
  }, [formData.passo3, formData.largura3, formData.gramatura3]);

  const rendimento3 = useMemo(() => {
    return pesoUnitario3 > 0 ? (1000 / pesoUnitario3) : 0;
  }, [pesoUnitario3]);

  const displayPesoTotal = useMemo(() => {
    if (formData.unidade === 'MIL') {
      return formData.quantidadeMlh * pesoUnitario;
    }
    return formData.pesoTotalInput;
  }, [formData.unidade, formData.quantidadeMlh, formData.pesoTotalInput, pesoUnitario]);

  const displayQuantidade = useMemo(() => {
    if (formData.unidade === 'KG') {
      return pesoUnitario > 0 ? formData.pesoTotalInput / pesoUnitario : 0;
    }
    return formData.quantidadeMlh;
  }, [formData.unidade, formData.quantidadeMlh, formData.pesoTotalInput, pesoUnitario]);

  const valorTotalSemIpi = useMemo(() => displayQuantidade * formData.precoUnitarioIcms, [displayQuantidade, formData.precoUnitarioIcms]);
  const valorIpi = useMemo(() => valorTotalSemIpi * (formData.percentualIPI / 100), [valorTotalSemIpi, formData.percentualIPI]);
  const valorTotalComIpi = valorTotalSemIpi + valorIpi;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name === 'providerId') {
      setFormData(prev => ({ ...prev, providerId: value, productId: '', sku: '', barcode: '' }));
      return;
    }

    const val = type === 'number' ? parseFloat(value) || 0 : (type === 'checkbox' ? (e.target as HTMLInputElement).checked : value);
    setFormData(prev => ({ ...prev, [name]: val } as any));
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col transition-colors border border-slate-200 dark:border-slate-800">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-40 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Carregando Dados...</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm p-3 transition-all shrink-0">
                    {currentProvider?.logo ? (
                      <img src={currentProvider.logo} alt="Logo Representada" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <i className="fas fa-industry text-3xl text-slate-300"></i>
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="mb-2">
                      <label className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1 block">Selecionar Representada</label>
                      <select
                        name="providerId"
                        value={formData.providerId}
                        onChange={handleChange}
                        className="w-full max-w-md px-3 py-2 rounded-xl border border-indigo-100 dark:border-slate-700 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 dark:text-white shadow-sm"
                      >
                        <option value="">Selecione a Indústria...</option>
                        {providers.map(p => <option key={p.id} value={p.id}>{p.nomeFantasia} ({p.razaoSocial})</option>)}
                      </select>
                    </div>

                    {currentProvider ? (
                      <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-relaxed">
                          <i className="fas fa-location-dot text-indigo-400 mr-1"></i>
                          {currentProvider.endereco}, {currentProvider.cidade} - {currentProvider.estado}<br />
                          <i className="fas fa-id-card text-indigo-400 mr-1"></i> CNPJ: {currentProvider.cnpj}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs italic text-slate-400">Escolha uma representada para carregar os dados comerciais.</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-3 tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none">
                    {mode} DE VENDA
                  </div>
                  <div className="flex flex-col items-end">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Documento Nº</label>
                    {mode === 'ORÇAMENTO' && !initialData ? (
                      <span className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400">AUTO-GERADO</span>
                    ) : (
                      <input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        placeholder="0000"
                        className="text-right text-2xl font-mono font-bold text-slate-700 dark:text-slate-300 border-b-2 border-indigo-200 focus:border-indigo-600 outline-none bg-transparent w-32"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form className="space-y-10">
                {/* TIPO E NOVO CLIENTE */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-exchange-alt text-indigo-500"></i> Tipo de Processo
                    </label>
                    <select
                      name="tipoProcesso"
                      value={formData.tipoProcesso}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-800 dark:text-white transition-all"
                    >
                      <option value="Novo">Novo</option>
                      <option value="Com Modificação">Com Modificação</option>
                      <option value="Repetição">Repetição</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-user-plus text-emerald-500"></i> Cliente Novo?
                    </label>
                    <select
                      name="clienteNovo"
                      value={formData.clienteNovo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-800 dark:text-white transition-all"
                    >
                      <option value="Não">Não</option>
                      <option value="Sim">Sim</option>
                    </select>
                  </div>
                </section>

                {/* IDENTIFICAÇÃO */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="col-span-full border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-user-tie"></i> Dados de Identificação
                    </h4>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Razão Social do Cliente</label>
                    <select name="clientId" value={formData.clientId} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-800 dark:text-white transition-all">
                      <option value="">Selecione...</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.razaoSocial}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contato</label>
                    <input type="text" name="contato" value={formData.contato} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-800 dark:text-white transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Telefone</label>
                    <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white transition-all" />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                      <i className="fas fa-search"></i> Vincular Produto (Ficha Técnica)
                    </label>
                    <select
                      name="productId"
                      value={formData.productId}
                      onChange={handleChange}
                      disabled={!formData.providerId}
                      className="w-full px-3 py-2.5 rounded-lg border-2 border-indigo-100 dark:border-indigo-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-black dark:bg-slate-800 dark:text-white transition-all disabled:opacity-50 disabled:bg-slate-100"
                    >
                      <option value="">{formData.providerId ? 'Selecione o produto...' : 'Selecione a representada primeiro'}</option>
                      {filteredProducts.map(p => <option key={p.id} value={p.id}>{p.sku} - {p.nome}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Código do Produto</label>
                    <input type="text" value={formData.sku} readOnly className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Código de Barras</label>
                    <input type="text" value={formData.barcode} readOnly className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed" />
                  </div>

                  <div className={`space-y-1 ${mode === 'PEDIDO' ? 'md:col-span-2' : 'md:col-span-4'}`}>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pedido Compra Cliente</label>
                    <input type="text" name="pedidoCompraCliente" value={formData.pedidoCompraCliente} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white transition-all" />
                  </div>

                  {mode === 'PEDIDO' && (
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nº Pedido Anterior</label>
                      <input type="text" name="numeroPedidoAnterior" value={formData.numeroPedidoAnterior} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white transition-all" />
                    </div>
                  )}
                </section>

                {/* CONDIÇÕES COMERCIAIS */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-indigo-50/30 dark:bg-indigo-500/5 p-6 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/10">
                  <div className="col-span-full border-b border-indigo-100 dark:border-indigo-500/20 pb-2">
                    <h4 className="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-handshake"></i> Condições Comerciais
                    </h4>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {mode === 'ORÇAMENTO' ? 'Validade do Orçamento' : 'Data Prevista de Entrega'}
                    </label>
                    <input
                      type="date"
                      name={mode === 'ORÇAMENTO' ? 'validadeOrcamento' : 'dataEntrega'}
                      value={mode === 'ORÇAMENTO' ? (formData.validadeOrcamento ? formData.validadeOrcamento.split('T')[0] : '') : (formData.dataEntrega ? formData.dataEntrega.split('T')[0] : '')}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-indigo-200 dark:border-indigo-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-white transition-all"
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Condição de Pagamento</label>
                    <input type="text" name="condicaoPagamento" value={formData.condicaoPagamento} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white transition-all" placeholder="Ex: 28/35/42 dias" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Entrada (%)</label>
                    <input type="number" name="entradaPercent" value={formData.entradaPercent} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Frete</label>
                    <select name="frete" value={formData.frete} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-indigo-200 dark:border-indigo-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all">
                      <option value="CIF">CIF (Emitente)</option>
                      <option value="FOB">FOB (Destinatário)</option>
                    </select>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Envio NF-e (Email)</label>
                    <input type="email" name="emailNfe" value={formData.emailNfe} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-indigo-200 dark:border-indigo-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all" placeholder="xml@empresa.com" />
                  </div>
                </section>

                {/* ENDEREÇO DE ENTREGA */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="col-span-full border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                    <h4 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-truck text-indigo-500"></i> Endereço do Cliente (Entrega)
                    </h4>
                  </div>
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Endereço</label>
                    <input type="text" name="entregaEndereco" value={formData.entregaEndereco} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">CEP</label>
                    <input type="text" name="entregaCEP" value={formData.entregaCEP} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Cidade</label>
                    <input type="text" name="entregaCidade" value={formData.entregaCidade} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Estado</label>
                    <input type="text" name="entregaEstado" value={formData.entregaEstado} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">CNPJ Entrega</label>
                    <input type="text" name="entregaCNPJ" value={formData.entregaCNPJ} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Inscrição Estadual</label>
                    <input type="text" name="entregaIE" value={formData.entregaIE} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white" />
                  </div>
                </section>

                {/* ENDEREÇO DE FATURAMENTO - VISÍVEL APENAS EM PEDIDO */}
                {mode === 'PEDIDO' && (
                  <section className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="col-span-full border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
                        <i className="fas fa-file-invoice-dollar text-indigo-500"></i> Endereço de Faturamento
                      </h4>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          name="faturamentoMesmoEntrega"
                          checked={formData.faturamentoMesmoEntrega}
                          onChange={handleChange}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">Mesmo endereço de entrega</span>
                      </label>
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Endereço de Faturamento</label>
                      <input
                        type="text"
                        name="faturamentoEndereco"
                        value={formData.faturamentoEndereco}
                        onChange={handleChange}
                        disabled={formData.faturamentoMesmoEntrega}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-900/50 disabled:text-slate-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">CEP Faturamento</label>
                      <input
                        type="text"
                        name="faturamentoCEP"
                        value={formData.faturamentoCEP}
                        onChange={handleChange}
                        disabled={formData.faturamentoMesmoEntrega}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-900/50 disabled:text-slate-400"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Cidade Faturamento</label>
                      <input
                        type="text"
                        name="faturamentoCidade"
                        value={formData.faturamentoCidade}
                        onChange={handleChange}
                        disabled={formData.faturamentoMesmoEntrega}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-900/50 disabled:text-slate-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Estado Faturamento</label>
                      <input
                        type="text"
                        name="faturamentoEstado"
                        value={formData.faturamentoEstado}
                        onChange={handleChange}
                        disabled={formData.faturamentoMesmoEntrega}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-900/50 disabled:text-slate-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">CNPJ Faturamento</label>
                      <input
                        type="text"
                        name="faturamentoCNPJ"
                        value={formData.faturamentoCNPJ}
                        onChange={handleChange}
                        disabled={formData.faturamentoMesmoEntrega}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-900/50 disabled:text-slate-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">I.E. Faturamento</label>
                      <input
                        type="text"
                        name="faturamentoIE"
                        value={formData.faturamentoIE}
                        onChange={handleChange}
                        disabled={formData.faturamentoMesmoEntrega}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-900/50 disabled:text-slate-400"
                      />
                    </div>
                  </section>
                )}

                {/* ESPECIFICAÇÃO TÉCNICA */}
                <section className="space-y-6">
                  <div className="col-span-full border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-vial"></i> Especificação Técnica da Embalagem
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className={`space-y-1 ${mode === 'ORÇAMENTO' ? 'md:col-span-4' : 'md:col-span-2'}`}>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Composição da Estrutura</label>
                      <input type="text" name="composicaoEstrutura" value={formData.composicaoEstrutura} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all" />
                      {mode === 'ORÇAMENTO' && (
                        <input type="text" name="composicaoEstrutura2" value={formData.composicaoEstrutura2} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all mt-2" placeholder="Composição Auxiliar / Opção 2" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipo de Impressão</label>
                      <select name="tipoImpressao" value={formData.tipoImpressao} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all">
                        <option value="Interna">Interna</option>
                        <option value="Externa">Externa</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sentido Desbobinamento</label>
                      <input type="text" name="sentidoDesbobinamento" value={formData.sentidoDesbobinamento} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Diâmetro Máximo Bobina</label>
                      <input type="text" name="diametroMaximoBobina" value={formData.diametroMaximoBobina} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all" placeholder="Ex: 400mm" />
                    </div>
                  </div>

                  {/* OPÇÃO DE MEDIDA 1 */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="col-span-full mb-1">
                      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Opção de Medida 1</span>
                    </div>
                    {[
                      { label: 'Largura (mm)', name: 'largura' },
                      { label: 'Passo (mm)', name: 'passo' },
                      { label: 'Gramatura (g/m²)', name: 'gramatura' },
                      { label: 'Espessura (µ)', name: 'espessura' },
                    ].map(field => (
                      <div key={field.name} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{field.label}</label>
                        <input type="number" name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:text-white" />
                      </div>
                    ))}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Peso Unitário (g)</label>
                      <div className="w-full px-2 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                        {pesoUnitario.toFixed(4)}g
                      </div>
                      {mode === 'ORÇAMENTO' && (
                        <div className="mt-2 space-y-1">
                          <label className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">Unidades / Kg</label>
                          <div className="w-full px-2 py-1.5 rounded-md bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                            {Math.floor(rendimento).toLocaleString()} un
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* OPÇÃO DE MEDIDA 2 - APENAS ORÇAMENTO */}
                  {mode === 'ORÇAMENTO' && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="col-span-full mb-1">
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Opção de Medida 2</span>
                      </div>
                      {[
                        { label: 'Largura (mm)', name: 'largura2' },
                        { label: 'Passo (mm)', name: 'passo2' },
                        { label: 'Gramatura (g/m²)', name: 'gramatura2' },
                        { label: 'Espessura (µ)', name: 'espessura2' },
                      ].map(field => (
                        <div key={field.name} className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{field.label}</label>
                          <input type="number" name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:text-white" />
                        </div>
                      ))}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Peso Unitário (g)</label>
                        <div className="w-full px-2 py-1.5 rounded-md bg-indigo-400 text-white text-xs font-black flex items-center justify-center">
                          {pesoUnitario2.toFixed(4)}g
                        </div>
                        <div className="mt-2 space-y-1">
                          <label className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">Unidades / Kg</label>
                          <div className="w-full px-2 py-1.5 rounded-md bg-blue-500 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                            {Math.floor(rendimento2).toLocaleString()} un
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OPÇÃO DE MEDIDA 3 - APENAS ORÇAMENTO */}
                  {mode === 'ORÇAMENTO' && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="col-span-full mb-1">
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Opção de Medida 3</span>
                      </div>
                      {[
                        { label: 'Largura (mm)', name: 'largura3' },
                        { label: 'Passo (mm)', name: 'passo3' },
                        { label: 'Gramatura (g/m²)', name: 'gramatura3' },
                        { label: 'Espessura (µ)', name: 'espessura3' },
                      ].map(field => (
                        <div key={field.name} className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{field.label}</label>
                          <input type="number" name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:text-white" />
                        </div>
                      ))}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Peso Unitário (g)</label>
                        <div className="w-full px-2 py-1.5 rounded-md bg-indigo-300 text-white text-xs font-black flex items-center justify-center">
                          {pesoUnitario3.toFixed(4)}g
                        </div>
                        <div className="mt-2 space-y-1">
                          <label className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">Unidades / Kg</label>
                          <div className="w-full px-2 py-1.5 rounded-md bg-blue-400 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                            {Math.floor(rendimento3).toLocaleString()} un
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* ITENS COMERCIAIS */}
                <section className="space-y-6">
                  <div className="col-span-full border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-tags"></i> Itens e Valores
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unidade</label>
                      <select name="unidade" value={formData.unidade} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all font-black text-indigo-600">
                        <option value="MIL">MIL (Milheiro)</option>
                        <option value="KG">KG (Quilo)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantidade</label>
                      <input
                        type="number"
                        name="quantidadeMlh"
                        value={displayQuantidade.toFixed(2)}
                        onChange={handleChange}
                        disabled={formData.unidade === 'KG'}
                        className={`w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all ${formData.unidade === 'KG' ? 'bg-slate-100 cursor-not-allowed text-slate-400' : 'bg-white'}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Peso Total (Kg)</label>
                      <input
                        type="number"
                        name="pesoTotalInput"
                        value={displayPesoTotal.toFixed(2)}
                        onChange={handleChange}
                        disabled={formData.unidade === 'MIL'}
                        className={`w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all ${formData.unidade === 'MIL' ? 'bg-slate-100 cursor-not-allowed text-slate-400' : 'bg-white'}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Preço Unit c/ ICMS</label>
                      <input type="number" name="precoUnitarioIcms" value={formData.precoUnitarioIcms} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all" step="0.0001" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Preço por MLH c/ ICMS</label>
                      <input type="number" name="precoPorMlhIcms" value={formData.precoPorMlhIcms} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all" step="0.0001" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">IPI (%)</label>
                      <input type="number" name="percentualIPI" value={formData.percentualIPI} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ICMS (%)</label>
                      <input type="number" name="percentualIcms" value={formData.percentualIcms} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white transition-all" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-end min-w-[200px]">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Bruto (s/ IPI)</span>
                      <span className="text-xl font-bold text-slate-700 dark:text-slate-200">R$ {valorTotalSemIpi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="bg-indigo-600 p-4 rounded-2xl flex flex-col items-end min-w-[200px] shadow-lg shadow-indigo-200 dark:shadow-none">
                      <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Total Final (c/ IPI)</span>
                      <span className="text-xl font-black text-white">R$ {valorTotalComIpi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </section>

                {/* OBSERVAÇÕES GERAIS */}
                <section className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-sticky-note"></i> Observações Gerais
                    </label>
                    <textarea name="obsGerais" value={formData.obsGerais} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm resize-none outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white transition-all" placeholder="Detalhes de produção, prazos especiais ou notas de faturamento..." />
                  </div>
                </section>

                {/* ASSINATURAS E CONTROLE INTERNO */}
                <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="col-span-full pb-2">
                    <h4 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-file-signature text-indigo-500"></i> BLOCO — ASSINATURAS E CONTROLE INTERNO
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Data de Emissão</label>
                        <input type="date" name="dataEmissao" value={formData.dataEmissao} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white" />
                      </div>
                      <div className="space-y-1 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Assinatura Nome do Vendedor</label>
                        <input type="text" name="vendedorNome" value={formData.vendedorNome} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Telefone do Vendedor</label>
                        <input type="text" name="vendedorTel" value={formData.vendedorTel} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col justify-end space-y-6">
                      <div className="h-24 border-b border-slate-300 dark:border-slate-700 flex flex-col items-center justify-end pb-2">
                        <input type="text" name="assinaturaCliente" value={formData.assinaturaCliente} onChange={handleChange} placeholder="Clique para assinar / informar nome" className="w-full text-center text-sm italic bg-transparent outline-none text-slate-600 dark:text-slate-400" />
                      </div>
                      <label className="text-[10px] font-black text-center text-slate-400 dark:text-slate-500 uppercase tracking-widest">Assinatura Cliente</label>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Assinatura Adm. Vendas</label>
                        <input type="text" name="assinaturaAdmVendas" value={formData.assinaturaAdmVendas} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Aprovação Financeira</label>
                        <input type="text" name="aprovacaoFinanceira" value={formData.aprovacaoFinanceira} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none dark:bg-slate-800 dark:text-white" />
                      </div>
                    </div>
                  </div>
                </section>
              </form>
            </div>

            <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex justify-end items-center rounded-b-3xl gap-4">
              <button onClick={onClose} className="px-8 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all uppercase tracking-widest text-xs">Cancelar</button>
              <button onClick={() => onSave(formData)} className="px-10 py-3 rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all uppercase tracking-widest text-xs">Finalizar {mode}</button>
            </div>
          </>
        )}
      </div>
    </ModalOverlay>
  );
};

export default SalesDocumentModal;
