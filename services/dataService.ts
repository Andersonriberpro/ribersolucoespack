
import { supabase } from './supabase';
import { Client, Provider, ProductSpecification, Budget, Order, Interaction, CommissionStatus, KanbanStatus } from '../types';

class DataService {
  // --- CLIENTS ---
  async getClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*, client_stage_history(*), client_interactions(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(client => ({
      ...client,
      razaoSocial: client.razao_social,
      nomeFantasia: client.nome_fantasia,
      historicoEtapas: client.client_stage_history.map((h: any) => ({ status: h.status, data: h.data })),
      interacoes: client.client_interactions.map((i: any) => ({ ...i })),
      proximaAcaoData: client.proxima_acao_data,
      proximaAcaoDesc: client.proxima_acao_desc,
      createdAt: client.created_at
    })) as Client[];
  }

  async addClient(client: Omit<Client, 'id' | 'createdAt' | 'historicoEtapas' | 'interacoes'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        type: client.type,
        razao_social: client.razaoSocial,
        nome_fantasia: client.nomeFantasia,
        documento: client.documento,
        contato: client.contato,
        whatsapp: client.whatsapp,
        email: client.email,
        endereco: client.endereco,
        segmento: client.segmento,
        origem: client.origem,
        responsavel: client.responsavel,
        status: client.status,
        ativo: client.ativo,
        obs: client.obs
      }])
      .select()
      .single();

    if (error) throw error;

    // Create initial stage history
    await supabase.from('client_stage_history').insert([{
      client_id: data.id,
      status: client.status
    }]);

    return data;
  }

  async deleteClient(clientId: string) {
    const { error } = await supabase.from('clients').delete().eq('id', clientId);
    if (error) throw error;
  }

  async updateClientStatus(clientId: string, status: KanbanStatus) {
    const { error } = await supabase
      .from('clients')
      .update({ status })
      .eq('id', clientId);

    if (error) throw error;

    await supabase.from('client_stage_history').insert([{
      client_id: clientId,
      status
    }]);
  }

  async addInteraction(clientId: string, interaction: Omit<Interaction, 'id' | 'data'>) {
    const { data, error } = await supabase
      .from('client_interactions')
      .insert([{
        client_id: clientId,
        tipo: interaction.tipo,
        descricao: interaction.descricao,
        responsavel: interaction.responsavel
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async scheduleNextAction(clientId: string, dataStr: string, descricao: string) {
    const { error } = await supabase
      .from('clients')
      .update({
        proxima_acao_data: dataStr,
        proxima_acao_desc: descricao
      })
      .eq('id', clientId);

    if (error) throw error;
  }

  async archiveClient(clientId: string) {
    const { error } = await supabase
      .from('clients')
      .update({ arquivado: true })
      .eq('id', clientId);
    if (error) throw error;
  }

  async updateClient(clientId: string, data: Partial<Client>) {
    const updateData: any = { ...data };
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.interacoes;
    delete updateData.historicoEtapas;

    if (data.razaoSocial) { updateData.razao_social = data.razaoSocial; delete updateData.razaoSocial; }
    if (data.nomeFantasia) { updateData.nome_fantasia = data.nomeFantasia; delete updateData.nomeFantasia; }
    if (data.proximaAcaoData) { updateData.proxima_acao_data = data.proximaAcaoData; delete updateData.proximaAcaoData; }
    if (data.proximaAcaoDesc) { updateData.proxima_acao_desc = data.proximaAcaoDesc; delete updateData.proximaAcaoDesc; }

    const { error } = await supabase.from('clients').update(updateData).eq('id', clientId);
    if (error) throw error;
  }

  // --- PROVIDERS ---
  async getProviders() {
    const { data, error } = await supabase.from('providers').select('*');
    if (error) throw error;
    return data.map(p => ({
      ...p,
      razaoSocial: p.razao_social,
      nomeFantasia: p.nome_fantasia,
      contatoComercial: p.contato_comercial,
      contatoFinanceiro: p.contato_financeiro,
      contatoQualidade: p.contato_qualidade,
      contatoGerencia: p.contato_gerencia,
      linhaProdutos: p.linha_produtos,
      prazoProducao: p.prazo_producao,
      condicoesComerciais: p.condicoes_comerciais,
      comissaoPadrao: p.comissao_padrao
    })) as Provider[];
  }

  async addProvider(provider: Omit<Provider, 'id'>) {
    const { data, error } = await supabase
      .from('providers')
      .insert([{
        razao_social: provider.razaoSocial,
        nome_fantasia: provider.nomeFantasia,
        cnpj: provider.cnpj,
        contato_comercial: provider.contatoComercial,
        contato_financeiro: provider.contatoFinanceiro,
        contato_qualidade: provider.contatoQualidade,
        contato_gerencia: provider.contatoGerencia,
        whatsapp: provider.whatsapp,
        email: provider.email,
        endereco: provider.endereco,
        linha_produtos: provider.linhaProdutos,
        prazo_producao: provider.prazoProducao,
        condicoes_comerciais: provider.condicoesComerciais,
        comissao_padrao: provider.comissaoPadrao,
        observacoes: provider.observacoes
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProvider(providerId: string, data: Partial<Provider>) {
    const updateData: any = { ...data };
    delete updateData.id;
    if (data.razaoSocial) { updateData.razao_social = data.razaoSocial; delete updateData.razaoSocial; }
    if (data.nomeFantasia) { updateData.nome_fantasia = data.nomeFantasia; delete updateData.nomeFantasia; }
    if (data.contatoComercial) { updateData.contato_comercial = data.contatoComercial; delete updateData.contatoComercial; }
    if (data.contatoFinanceiro) { updateData.contato_financeiro = data.contatoFinanceiro; delete updateData.contatoFinanceiro; }
    if (data.contatoQualidade) { updateData.contato_qualidade = data.contatoQualidade; delete updateData.contatoQualidade; }
    if (data.contatoGerencia) { updateData.contato_gerencia = data.contatoGerencia; delete updateData.contatoGerencia; }
    if (data.linhaProdutos) { updateData.linha_produtos = data.linhaProdutos; delete updateData.linhaProdutos; }
    if (data.prazoProducao) { updateData.prazo_producao = data.prazoProducao; delete updateData.prazoProducao; }
    if (data.condicoesComerciais) { updateData.condicoes_comerciais = data.condicoesComerciais; delete updateData.condicoesComerciais; }
    if (data.comissaoPadrao) { updateData.comissao_padrao = data.comissaoPadrao; delete updateData.comissaoPadrao; }

    const { error } = await supabase.from('providers').update(updateData).eq('id', providerId);
    if (error) throw error;
  }

  async deleteProvider(providerId: string) {
    const { error } = await supabase.from('providers').delete().eq('id', providerId);
    if (error) throw error;
  }

  // --- PRODUCTS ---
  async getProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data.map(p => ({
      ...p,
      providerId: p.provider_id,
      clientId: p.client_id,
      tipoEmbalagem: p.tipo_embalagem,
      sentidoDesbobinamento: p.sentido_desbobinamento,
      diametroMaximoBobina: p.diametro_maximo_bobina,
      plantaTecnicaUrl: p.planta_tecnica_url,
      layoutUrl: p.layout_url,
      observacoesTecnicas: p.observacoes_tecnicas
    })) as ProductSpecification[];
  }

  async addProduct(product: Omit<ProductSpecification, 'id'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        sku: product.sku || `PROD-${Math.floor(Math.random() * 9000) + 1000}`,
        nome: product.nome,
        provider_id: product.providerId,
        client_id: product.clientId,
        tipo_embalagem: product.tipoEmbalagem,
        material: product.material,
        medidas: product.medidas,
        passo: product.passo,
        largura: product.largura,
        gramatura: product.gramatura,
        espessura: product.espessura,
        personalizado: product.personalizado,
        cores: product.cores
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProduct(productId: string, data: Partial<ProductSpecification>) {
    const updateData: any = { ...data };
    delete updateData.id;
    if (data.providerId) { updateData.provider_id = data.providerId; delete updateData.providerId; }
    if (data.clientId) { updateData.client_id = data.clientId; delete updateData.clientId; }
    if (data.tipoEmbalagem) { updateData.tipo_embalagem = data.tipoEmbalagem; delete updateData.tipo_embalagem; } // error in mapping property name in input? No, it's tipoEmbalagem
    if (data.tipoEmbalagem) { updateData.tipo_embalagem = data.tipoEmbalagem; delete updateData.tipoEmbalagem; }

    // ... more mappings if needed
    const { error } = await supabase.from('products').update(updateData).eq('id', productId);
    if (error) throw error;
  }

  async deleteProduct(productId: string) {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
  }

  // --- ORDERS ---
  async getOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('data_pedido', { ascending: false });

    if (error) throw error;
    return data.map(o => ({
      ...o,
      budgetId: o.budget_id,
      clientId: o.client_id,
      providerId: o.provider_id,
      productId: o.product_id,
      comissaoValor: o.comissao_valor,
      comissaoStatus: o.comissao_status,
      statusOperacional: o.status_operacional,
      dataPedido: o.data_pedido,
      ...o.dados_extras
    })) as Order[];
  }

  async addOrder(orderData: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        numero: orderData.numero || `PED-${Math.floor(Math.random() * 10000)}`,
        client_id: orderData.clientId,
        provider_id: orderData.providerId,
        product_id: orderData.productId,
        quantidade: orderData.quantidade,
        valor_final: orderData.valorFinal,
        comissao_valor: orderData.comissaoValor,
        comissao_status: orderData.comissaoStatus || 'Prevista',
        status_operacional: 'Aguardando Produção',
        dados_extras: orderData
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // --- BUDGETS ---
  async getBudgets() {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(b => ({
      ...b,
      clientId: b.client_id,
      productId: b.product_id,
      valorUnitario: b.valor_unitario,
      valorTotal: b.valor_total,
      createdAt: b.created_at
    })) as Budget[];
  }

  async addBudget(budgetData: any) {
    const { data, error } = await supabase
      .from('budgets')
      .insert([{
        numero: budgetData.numero || `ORC-${Math.floor(Math.random() * 9000) + 1000}`,
        client_id: budgetData.clientId,
        product_id: budgetData.productId,
        quantidade: budgetData.quantidade,
        valor_unitario: budgetData.valorUnitario,
        valor_total: budgetData.valorTotal,
        status: budgetData.status || 'Enviado',
        validade: budgetData.validade
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  async updateBudget(budgetId: string, data: Partial<Budget>) {
    const updateData: any = { ...data };
    delete updateData.id;
    if (data.clientId) { updateData.client_id = data.clientId; delete updateData.clientId; }
    if (data.productId) { updateData.product_id = data.productId; delete updateData.productId; }
    if (data.valorUnitario) { updateData.valor_unitario = data.valorUnitario; delete updateData.valorUnitario; }
    if (data.valorTotal) { updateData.valor_total = data.valorTotal; delete updateData.valorTotal; }

    const { error } = await supabase.from('budgets').update(updateData).eq('id', budgetId);
    if (error) throw error;
  }

  async deleteBudget(budgetId: string) {
    const { error } = await supabase.from('budgets').delete().eq('id', budgetId);
    if (error) throw error;
  }

  async updateOrder(orderId: string, data: Partial<Order>) {
    const updateData: any = { ...data };
    delete updateData.id;
    if (data.budgetId) { updateData.budget_id = data.budgetId; delete updateData.budgetId; }
    if (data.clientId) { updateData.client_id = data.clientId; delete updateData.clientId; }
    if (data.providerId) { updateData.provider_id = data.providerId; delete updateData.providerId; }
    if (data.productId) { updateData.product_id = data.productId; delete updateData.productId; }
    if (data.valorFinal) { updateData.valor_final = data.valorFinal; delete updateData.valorFinal; }
    if (data.comissaoValor) { updateData.comissao_valor = data.comissaoValor; delete updateData.comissaoValor; }
    if (data.comissaoStatus) { updateData.comissao_status = data.comissaoStatus; delete updateData.comissaoStatus; }
    if (data.statusOperacional) { updateData.status_operacional = data.statusOperacional; delete updateData.statusOperacional; }
    if (data.dataPedido) { updateData.data_pedido = data.dataPedido; delete updateData.dataPedido; }

    const { error } = await supabase.from('orders').update(updateData).eq('id', orderId);
    if (error) throw error;
  }

  async deleteOrder(orderId: string) {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (error) throw error;
  }
}

export const dataService = new DataService();
