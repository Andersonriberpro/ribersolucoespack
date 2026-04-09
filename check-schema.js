import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const VITE_SUPABASE_URL = urlMatch[1].trim();
const VITE_SUPABASE_ANON_KEY = keyMatch[1].trim();

async function check() {
  const respBudgets = await fetch(`${VITE_SUPABASE_URL}/rest/v1/budgets?limit=1`, {
    headers: { apikey: VITE_SUPABASE_ANON_KEY }
  });
  const budgets = await respBudgets.json();
  console.log('BUDGETS DATA', budgets[0] ? Object.keys(budgets[0]) : 'empty');
  
  const respOrders = await fetch(`${VITE_SUPABASE_URL}/rest/v1/orders?limit=1`, {
    headers: { apikey: VITE_SUPABASE_ANON_KEY }
  });
  const orders = await respOrders.json();
  console.log('ORDERS DATA', orders[0] ? Object.keys(orders[0]) : 'empty');
}
check();
