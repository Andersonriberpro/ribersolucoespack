import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars', { supabaseUrl, supabaseKey });
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const insertData = {
    razao_social: 'Test Provider',
    nome_fantasia: 'Test',
    cnpj: '00000000000',
    contato_comercial: {nome: 'Test', email: 'test@test.com', telefone: '1199999999'},
    contato_financeiro: {nome: 'Test', email: 'test@test.com', telefone: '1199999999'},
    contato_qualidade: {nome: 'Test', email: 'test@test.com', telefone: '1199999999'},
    contato_gerencia: {nome: 'Test', email: 'test@test.com', telefone: '1199999999'},
    whatsapp: '1199999999',
    email: 'test@test.com',
    endereco: 'Rua Teste, 123',
    linha_produtos: ['Monocamada'],
    prazo_producao: '15 Dias',
    condicoes_comerciais: 'Pagamento a vista',
    comissao_padrao: 5,
    observacoes: ''
  };

  console.log('Inserting with data:', insertData);
  const { data, error } = await supabase.from('providers').insert([insertData]).select().single();
  
  if (error) {
    console.error('INSERT ERROR:', error);
  } else {
    console.log('INSERT SUCCESS:', data);
    // clean up
    await supabase.from('providers').delete().eq('id', data.id);
  }
}

testInsert();
