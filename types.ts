
export enum ClientType {
  LEAD = 'Lead',
  CLIENTE = 'Cliente'
}

export enum KanbanStatus {
  PROSPECCAO = 'Prospecção',
  ORCAMENTO = 'Orçamento',
  PEDIDO = 'Pedido',
  DESENVOLVIMENTO = 'Desenvolvimento',
  FATURADO = 'Faturado'
}

export enum BudgetStatus {
  ENVIADO = 'Enviado',
  NEGOCIACAO = 'Negociação',
  APROVADO = 'Aprovado',
  RECUSADO = 'Recusado'
}

export enum CommissionStatus {
  PREVISTA = 'Prevista',
  FATURADA = 'Faturada',
  PAGA = 'Paga'
}

export interface StageHistory {
  status: KanbanStatus;
  data: string;
}

export interface Interaction {
  id: string;
  tipo: 'Ligação' | 'WhatsApp' | 'E-mail' | 'Visita' | 'Reunião';
  descricao: string;
  data: string;
  responsavel: string;
}

export interface Client {
  id: string;
  type: ClientType;
  razaoSocial: string;
  nomeFantasia: string;
  documento: string;
  contato: string;
  whatsapp: string;
  email: string;
  endereco: string;
  segmento: string;
  origem: string;
  responsavel: string;
  status: KanbanStatus;
  ativo: boolean;
  arquivado?: boolean;
  obs: string;
  createdAt: string;
  historicoEtapas: StageHistory[];
  interacoes: Interaction[];
  proximaAcaoData?: string;
  proximaAcaoDesc?: string;
}

export interface ContactInfo {
  nome: string;
  email: string;
  telefone: string;
}

export interface Provider {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  logo?: string;
  contatoComercial: ContactInfo;
  contatoFinanceiro: ContactInfo;
  contatoQualidade: ContactInfo;
  contatoGerencia: ContactInfo;
  whatsapp: string;
  email: string;
  site?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  endereco: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  linhaProdutos: string[]; 
  prazoProducao: string;
  condicoesComerciais: string;
  comissaoPadrao: number;
  observacoes?: string;
}

export interface ProductSpecification {
  id: string;
  sku: string;
  barcode?: string;
  nome: string;
  tipoEmbalagem: string;
  material: string;
  medidas: string;
  passo?: string;
  largura?: string;
  gramatura: string;
  espessura: string;
  personalizado: boolean;
  impressaoTipo?: string;
  sentidoDesbobinamento?: string;
  diametroMaximoBobina?: string;
  cores: string[];
  providerId: string;
  clientId: string;
  plantaTecnicaUrl?: string;
  layoutUrl?: string;
  observacoesTecnicas?: string;
  
  fichaNumero?: string;
  fichaData?: string;
  fichaHora?: string;
  modeloEmbalagem?: string;
  faturamentoCliche?: string;
  valorCliche?: number;
  maquina?: string;
  cilindroCamisa?: string;
  distorcao?: string;
  deslocar?: string;
  duplaFace?: string;
  espessuraCliche?: string;
  lineatura?: string;
  fotocelula?: string;
  filmeAberto?: string;
  repeticaoLongitudinal?: string;
  repeticaoLateral?: string;
  quantidadeCoresFicha?: number;
  coresFicha?: string[];
  obsFicha?: string;
}

export interface Budget {
  id: string;
  numero: string;
  clientId: string;
  productId: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  status: BudgetStatus;
  validade: string;
  createdAt: string;
}

export interface Order {
  id: string;
  numero: string;
  budgetId: string;
  clientId: string;
  providerId: string;
  productId: string;
  quantidade: number;
  valorFinal: number;
  comissaoValor: number;
  comissaoStatus: CommissionStatus;
  statusOperacional: string;
  dataPedido: string;
  
  // Novos campos para persistência total
  tipoProcesso?: string;
  clienteNovo?: string;
  contato?: string;
  telefone?: string;
  sku?: string;
  barcode?: string;
  pedidoCompraCliente?: string;
  numeroPedidoAnterior?: string;
  condicaoPagamento?: string;
  entradaPercent?: number;
  frete?: string;
  dataEntrega?: string;
  entregaEndereco?: string;
  entregaCEP?: string;
  entregaCidade?: string;
  entregaEstado?: string;
  entregaCNPJ?: string;
  entregaIE?: string;
  faturamentoEndereco?: string;
  faturamentoCEP?: string;
  faturamentoCidade?: string;
  faturamentoEstado?: string;
  faturamentoCNPJ?: string;
  faturamentoIE?: string;
  composicaoEstrutura?: string;
  tipoImpressao?: string;
  sentidoDesbobinamento?: string;
  diametroMaximoBobina?: string;
  largura?: number;
  passo?: number;
  gramatura?: number;
  espessura?: number;
  unidade?: string;
  precoUnitarioIcms?: number;
  percentualIPI?: number;
  percentualIcms?: number;
  emailNfe?: string;
  obsGerais?: string;
  vendedorNome?: string;
  vendedorTel?: string;
  assinaturaCliente?: string;
  assinaturaAdmVendas?: string;
  aprovacaoFinanceira?: string;
}
