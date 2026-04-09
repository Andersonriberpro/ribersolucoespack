import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const VITE_SUPABASE_URL = urlMatch[1].trim();
const VITE_SUPABASE_ANON_KEY = keyMatch[1].trim();

async function check() {
  const respBudgets = await fetch(`${VITE_SUPABASE_URL}/rest/v1/budgets?select=dados_extras&limit=1`, {
    headers: { apikey: VITE_SUPABASE_ANON_KEY }
  });
  console.log('BUDGETS STATUS', respBudgets.status, await respBudgets.text());
  
  const respOrders = await fetch(`${VITE_SUPABASE_URL}/rest/v1/orders?select=dados_extras&limit=1`, {
    headers: { apikey: VITE_SUPABASE_ANON_KEY }
  });
  console.log('ORDERS STATUS', respOrders.status, await respOrders.text());
}
check();
