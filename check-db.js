import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: bData, error: bErr } = await supabase.from('budgets').select('*').limit(1);
  console.log('Budgets Columns:', Object.keys(bData?.[0] || {}));
  
  const { data: oData, error: oErr } = await supabase.from('orders').select('*').limit(1);
  console.log('Orders Columns:', Object.keys(oData?.[0] || {}));
}
check();
