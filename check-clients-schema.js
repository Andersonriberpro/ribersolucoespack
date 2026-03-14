import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.rpc('get_schema_info', {}); 
  // Wait, RPC might not exist. Let's just try to SELECT the columns or just read one row to see what fields come back in PostgREST.
  const { data: clients, error: err } = await supabase.from('clients').select('*').limit(1);
  if (err) {
    console.error('Error fetching:', err);
  } else {
    if (clients && clients.length > 0) {
      console.log('Columns found:', Object.keys(clients[0]));
    } else {
      console.log('No rows found, cannot infer columns from simple select.');
    }
  }
}

checkSchema();
