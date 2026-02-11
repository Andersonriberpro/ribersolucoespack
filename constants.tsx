
import { Client, ClientType, KanbanStatus, Provider, ProductSpecification, Budget, BudgetStatus, Order, CommissionStatus } from './types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    type: ClientType.CLIENTE,
    razaoSocial: 'Indústria Alimentos S.A.',
    nomeFantasia: 'FoodPack Pro',
    documento: '12.345.678/0001-90',
    contato: 'João Silva',
    whatsapp: '11999998888',
    email: 'joao@foodpack.com',
    endereco: 'Av. das Indústrias, 500',
    segmento: 'Alimentício',
    origem: 'Indicação',
    responsavel: 'Carlos Representante',
    status: KanbanStatus.FATURADO,
    ativo: true,
    obs: 'Cliente recorrente de sacos industriais.',
    createdAt: '2024-01-15',
    // Added missing required properties to match Client type
    historicoEtapas: [{ status: KanbanStatus.FATURADO, data: '2024-01-15' }],
    interacoes: []
  },
  {
    id: '2',
    type: ClientType.LEAD,
    razaoSocial: 'Cosméticos Beleza Ltda',
    nomeFantasia: 'Beleza Real',
    documento: '98.765.432/0001-11',
    contato: 'Ana Maria',
    whatsapp: '11977776666',
    email: 'ana@belezareal.com.br',
    endereco: 'Rua das Flores, 12',
    segmento: 'Cosméticos',
    origem: 'Site',
    responsavel: 'Carlos Representante',
    status: KanbanStatus.PROSPECCAO,
    ativo: true,
    obs: 'Interessada em frascos personalizados.',
    createdAt: '2024-03-20',
    // Added missing required properties to match Client type
    historicoEtapas: [{ status: KanbanStatus.PROSPECCAO, data: '2024-03-20' }],
    interacoes: []
  }
];

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'p1',
    razaoSocial: 'Plásticos Brasil Ltda',
    nomeFantasia: 'PlasBrasil',
    cnpj: '11.111.111/0001-11',
    contatoComercial: { nome: 'Marcos', email: 'vendas@plasbrasil.com', telefone: '11988887777' },
    contatoFinanceiro: { nome: 'Sandra', email: 'financeiro@plasbrasil.com', telefone: '11988887776' },
    contatoGerencia: { nome: 'Ricardo', email: 'gerencia@plasbrasil.com', telefone: '11988887775' },
    contatoQualidade: { nome: 'Beatriz', email: 'qualidade@plasbrasil.com', telefone: '11988887774' },
    whatsapp: '11988887777',
    email: 'comercial@plasbrasil.com',
    site: 'https://plasbrasil.com.br',
    instagram: '@plasbrasil',
    endereco: 'Rua da Plástica, 100',
    cep: '04571-010',
    cidade: 'São Paulo',
    estado: 'SP',
    linhaProdutos: ['Monocamada', 'Laminado'],
    comissaoPadrao: 5,
    prazoProducao: '15 dias',
    condicoesComerciais: '28/35/42 dias. Pedido mínimo R$ 2.000,00'
  }
];

export const INITIAL_PRODUCTS: ProductSpecification[] = [
  {
    id: 'prod1',
    sku: 'SKU-0001',
    barcode: '7891234567890',
    clientId: '1',
    providerId: 'p1',
    nome: 'Saco Industrial Reforçado',
    tipoEmbalagem: 'Saquinho monocamada',
    material: 'Polietileno',
    medidas: '60x90',
    gramatura: '80g',
    espessura: '0.15',
    personalizado: true,
    cores: ['Transparente'],
    sentidoDesbobinamento: '1'
  }
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'b1',
    numero: '2024-001',
    clientId: '1',
    productId: 'prod1',
    quantidade: 5000,
    valorUnitario: 1.25,
    valorTotal: 6250,
    status: BudgetStatus.APROVADO,
    validade: '2024-05-10',
    createdAt: '2024-04-01'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'o1',
    numero: 'PED-1001',
    budgetId: 'b1',
    clientId: '1',
    providerId: 'p1',
    productId: 'prod1',
    quantidade: 5000,
    valorFinal: 6250,
    comissaoValor: 312.50,
    comissaoStatus: CommissionStatus.FATURADA,
    statusOperacional: 'Em produção',
    dataPedido: '2024-04-05'
  }
];