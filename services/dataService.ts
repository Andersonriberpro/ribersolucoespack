
import { supabase } from './supabase';
import { Client, Provider, ProductSpecification, Budget, Order, Interaction, CommissionStatus, KanbanStatus, ClientType } from '../types';

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
      inscricaoEstadual: client.inscricao_estadual,
      cidade: client.cidade,
      cep: client.cep,
      estado: client.estado,
      site: client.site,
      instagram: client.instagram,
      createdAt: client.created_at
    })) as Client[];
  }

  async addClient(client: Omit<Client, 'id' | 'historicoEtapas' | 'interacoes'>) {
    const insertData: any = {
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
      obs: client.obs,
      inscricao_estadual: client.inscricaoEstadual,
      cidade: client.cidade,
      cep: client.cep,
      estado: client.estado,
      site: client.site,
      instagram: client.instagram
    };

    if (client.createdAt) {
      insertData.created_at = client.createdAt;
    }

    const { data, error } = await supabase
      .from('clients')
      .insert([insertData])
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
    const updateData: any = { status };

    // Automatic conversion: Lead to Cliente when moving to Pedido
    if (status === KanbanStatus.PEDIDO) {
      updateData.type = ClientType.CLIENTE;
    }

    const { error } = await supabase
      .from('clients')
      .update(updateData)
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
    if (data.createdAt) { updateData.created_at = data.createdAt; delete updateData.createdAt; }
    if (data.responsavel !== undefined) { updateData.responsavel = data.responsavel; }
    if (data.inscricaoEstadual !== undefined) { updateData.inscricao_estadual = data.inscricaoEstadual; delete updateData.inscricaoEstadual; }
    if (data.cidade !== undefined) { updateData.cidade = data.cidade; }
    if (data.cep !== undefined) { updateData.cep = data.cep; }
    if (data.estado !== undefined) { updateData.estado = data.estado; }
    if (data.site !== undefined) { updateData.site = data.site; }
    if (data.instagram !== undefined) { updateData.instagram = data.instagram; }

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
      comissaoPadrao: p.comissao_padrao,
      cep: p.cep,
      cidade: p.cidade,
      estado: p.estado,
      site: p.site,
      instagram: p.instagram,
      facebook: p.facebook,
      linkedin: p.linkedin,
      youtube: p.youtube,
      logo: p.logo
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
        cep: provider.cep,
        cidade: provider.cidade,
        estado: provider.estado,
        site: provider.site,
        instagram: provider.instagram,
        facebook: provider.facebook,
        linkedin: provider.linkedin,
        youtube: provider.youtube,
        logo: provider.logo,
        linha_produtos: provider.linhaProdutos,
        prazo_producao: provider.prazoProducao,
        condicoes_comerciais: provider.condicoesComerciais,
        comissao_padrao: provider.comissaoPadrao ? parseFloat(provider.comissaoPadrao as any) || 0 : 0,
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
    if (data.razaoSocial !== undefined) { updateData.razao_social = data.razaoSocial; delete updateData.razaoSocial; }
    if (data.nomeFantasia !== undefined) { updateData.nome_fantasia = data.nomeFantasia; delete updateData.nomeFantasia; }
    if (data.cnpj !== undefined) { updateData.cnpj = data.cnpj; delete updateData.cnpj; }
    if (data.contatoComercial !== undefined) { updateData.contato_comercial = data.contatoComercial; delete updateData.contatoComercial; }
    if (data.contatoFinanceiro !== undefined) { updateData.contato_financeiro = data.contatoFinanceiro; delete updateData.contatoFinanceiro; }
    if (data.contatoQualidade !== undefined) { updateData.contato_qualidade = data.contatoQualidade; delete updateData.contatoQualidade; }
    if (data.contatoGerencia !== undefined) { updateData.contato_gerencia = data.contatoGerencia; delete updateData.contatoGerencia; }
    if (data.linhaProdutos !== undefined) { updateData.linha_produtos = data.linhaProdutos; delete updateData.linhaProdutos; }
    if (data.prazoProducao !== undefined) { updateData.prazo_producao = data.prazoProducao; delete updateData.prazoProducao; }
    if (data.condicoesComerciais !== undefined) { updateData.condicoes_comerciais = data.condicoesComerciais; delete updateData.condicoesComerciais; }
    if (data.comissaoPadrao !== undefined) { updateData.comissao_padrao = data.comissaoPadrao ? parseFloat(data.comissaoPadrao as any) || 0 : 0; delete updateData.comissaoPadrao; }
    if (data.cep !== undefined) { updateData.cep = data.cep; }
    if (data.cidade !== undefined) { updateData.cidade = data.cidade; }
    if (data.estado !== undefined) { updateData.estado = data.estado; }
    if (data.site !== undefined) { updateData.site = data.site; }
    if (data.instagram !== undefined) { updateData.instagram = data.instagram; }
    if (data.facebook !== undefined) { updateData.facebook = data.facebook; }
    if (data.linkedin !== undefined) { updateData.linkedin = data.linkedin; }
    if (data.youtube !== undefined) { updateData.youtube = data.youtube; }
    if (data.logo !== undefined) { updateData.logo = data.logo; }

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
      impressaoTipo: p.impressao_tipo,
      plantaTecnicaUrl: p.planta_tecnica_url,
      layoutUrl: p.layout_url,
      observacoesTecnicas: p.observacoes_tecnicas,
      fichaNumero: p.ficha_numero,
      fichaData: p.ficha_data,
      fichaHora: p.ficha_hora,
      modeloEmbalagem: p.modelo_embalagem,
      faturamentoCliche: p.faturamento_cliche,
      valorCliche: p.valor_cliche,
      cilindroCamisa: p.cilindro_camisa,
      duplaFace: p.dupla_face,
      espessuraCliche: p.espessura_cliche,
      filmeAberto: p.filme_aberto,
      repeticaoLongitudinal: p.repeticao_longitudinal,
      repeticaoLateral: p.repeticao_lateral,
      quantidadeCoresFicha: p.quantidade_cores_ficha,
      coresFicha: p.cores_ficha,
      obsFicha: p.obs_ficha
    })) as ProductSpecification[];
  }

  async addProduct(product: Omit<ProductSpecification, 'id'>) {
    const generatedSku = product.sku || `PROD-${Math.floor(Math.random() * 9000) + 1000}`;
    const { data, error } = await supabase
      .from('products')
      .insert([{
        sku: generatedSku,
        barcode: product.barcode,
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
        cores: product.cores,
        impressao_tipo: product.impressaoTipo,
        sentido_desbobinamento: product.sentidoDesbobinamento,
        diametro_maximo_bobina: product.diametroMaximoBobina,
        planta_tecnica_url: product.plantaTecnicaUrl,
        layout_url: product.layoutUrl,
        observacoes_tecnicas: product.observacoesTecnicas,
        ficha_numero: product.fichaNumero || generatedSku,
        ficha_data: product.fichaData,
        ficha_hora: product.fichaHora,
        modelo_embalagem: product.modeloEmbalagem,
        faturamento_cliche: product.faturamentoCliche,
        valor_cliche: product.valorCliche,
        maquina: product.maquina,
        cilindro_camisa: product.cilindroCamisa,
        distorcao: product.distorcao,
        deslocar: product.deslocar,
        dupla_face: product.duplaFace,
        espessura_cliche: product.espessuraCliche,
        lineatura: product.lineatura,
        fotocelula: product.fotocelula,
        filme_aberto: product.filmeAberto,
        repeticao_longitudinal: product.repeticaoLongitudinal,
        repeticao_lateral: product.repeticaoLateral,
        quantidade_cores_ficha: product.quantidadeCoresFicha,
        cores_ficha: product.coresFicha,
        obs_ficha: product.obsFicha
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProduct(productId: string, data: Partial<ProductSpecification>) {
    const updateData: any = { ...data };
    delete updateData.id;
    if (data.providerId !== undefined) { updateData.provider_id = data.providerId; delete updateData.providerId; }
    if (data.clientId !== undefined) { updateData.client_id = data.clientId; delete updateData.clientId; }
    if (data.tipoEmbalagem !== undefined) { updateData.tipo_embalagem = data.tipoEmbalagem; delete updateData.tipoEmbalagem; }
    if (data.sentidoDesbobinamento !== undefined) { updateData.sentido_desbobinamento = data.sentidoDesbobinamento; delete updateData.sentidoDesbobinamento; }
    if (data.diametroMaximoBobina !== undefined) { updateData.diametro_maximo_bobina = data.diametroMaximoBobina; delete updateData.diametroMaximoBobina; }
    if (data.impressaoTipo !== undefined) { updateData.impressao_tipo = data.impressaoTipo; delete updateData.impressaoTipo; }
    if (data.plantaTecnicaUrl !== undefined) { updateData.planta_tecnica_url = data.plantaTecnicaUrl; delete updateData.plantaTecnicaUrl; }
    if (data.layoutUrl !== undefined) { updateData.layout_url = data.layoutUrl; delete updateData.layoutUrl; }
    if (data.observacoesTecnicas !== undefined) { updateData.observacoes_tecnicas = data.observacoesTecnicas; delete updateData.observacoesTecnicas; }
    if (data.fichaNumero !== undefined) { updateData.ficha_numero = data.fichaNumero; delete updateData.fichaNumero; }
    if (data.fichaData !== undefined) { updateData.ficha_data = data.fichaData; delete updateData.fichaData; }
    if (data.fichaHora !== undefined) { updateData.ficha_hora = data.fichaHora; delete updateData.fichaHora; }
    if (data.modeloEmbalagem !== undefined) { updateData.modelo_embalagem = data.modeloEmbalagem; delete updateData.modeloEmbalagem; }
    if (data.faturamentoCliche !== undefined) { updateData.faturamento_cliche = data.faturamentoCliche; delete updateData.faturamentoCliche; }
    if (data.valorCliche !== undefined) { updateData.valor_cliche = data.valorCliche; delete updateData.valorCliche; }
    if (data.cilindroCamisa !== undefined) { updateData.cilindro_camisa = data.cilindroCamisa; delete updateData.cilindroCamisa; }
    if (data.duplaFace !== undefined) { updateData.dupla_face = data.duplaFace; delete updateData.duplaFace; }
    if (data.espessuraCliche !== undefined) { updateData.espessura_cliche = data.espessuraCliche; delete updateData.espessuraCliche; }
    if (data.filmeAberto !== undefined) { updateData.filme_aberto = data.filmeAberto; delete updateData.filmeAberto; }
    if (data.repeticaoLongitudinal !== undefined) { updateData.repeticao_longitudinal = data.repeticaoLongitudinal; delete updateData.repeticaoLongitudinal; }
    if (data.repeticaoLateral !== undefined) { updateData.repeticao_lateral = data.repeticaoLateral; delete updateData.repeticaoLateral; }
    if (data.quantidadeCoresFicha !== undefined) { updateData.quantidade_cores_ficha = data.quantidadeCoresFicha; delete updateData.quantidadeCoresFicha; }
    if (data.coresFicha !== undefined) { updateData.cores_ficha = data.coresFicha; delete updateData.coresFicha; }
    if (data.obsFicha !== undefined) { updateData.obs_ficha = data.obsFicha; delete updateData.obsFicha; }

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
      quantidade: o.quantidade,
      valorFinal: o.valor_final,
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
      createdAt: b.created_at,
      ...b.dados_extras
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
        validade: budgetData.validade,
        dados_extras: budgetData
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  async updateBudget(budgetId: string, data: any) {
    const updateData: any = { dados_extras: { ...data } };
    if (updateData.dados_extras.id) delete updateData.dados_extras.id;

    if (data.clientId !== undefined) updateData.client_id = data.clientId;
    if (data.productId !== undefined) updateData.product_id = data.productId;
    if (data.valorUnitario !== undefined) updateData.valor_unitario = data.valorUnitario;
    if (data.valorTotal !== undefined) updateData.valor_total = data.valorTotal;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.validade !== undefined) updateData.validade = data.validade;

    const { error } = await supabase.from('budgets').update(updateData).eq('id', budgetId);
    if (error) throw error;
  }

  async deleteBudget(budgetId: string) {
    const { error } = await supabase.from('budgets').delete().eq('id', budgetId);
    if (error) throw error;
  }

  async updateOrder(orderId: string, data: any) {
    const updateData: any = { dados_extras: { ...data } };
    if (updateData.dados_extras.id) delete updateData.dados_extras.id;

    if (data.budgetId !== undefined) updateData.budget_id = data.budgetId;
    if (data.clientId !== undefined) updateData.client_id = data.clientId;
    if (data.providerId !== undefined) updateData.provider_id = data.providerId;
    if (data.productId !== undefined) updateData.product_id = data.productId;
    if (data.valorFinal !== undefined) updateData.valor_final = data.valorFinal;
    if (data.comissaoValor !== undefined) updateData.comissao_valor = data.comissaoValor;
    if (data.comissaoStatus !== undefined) updateData.comissao_status = data.comissaoStatus;
    if (data.statusOperacional !== undefined) updateData.status_operacional = data.statusOperacional;
    if (data.dataPedido !== undefined) updateData.data_pedido = data.dataPedido;

    const { error } = await supabase.from('orders').update(updateData).eq('id', orderId);
    if (error) throw error;
  }

  async deleteOrder(orderId: string) {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (error) throw error;
  }
}

export const dataService = new DataService();
