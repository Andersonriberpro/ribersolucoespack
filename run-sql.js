const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectId = 'nrkzjokujjtpmwfzygag';

const query = `
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS inscricao_estadual text,
ADD COLUMN IF NOT EXISTS cidade text,
ADD COLUMN IF NOT EXISTS cep text,
ADD COLUMN IF NOT EXISTS estado text,
ADD COLUMN IF NOT EXISTS site text,
ADD COLUMN IF NOT EXISTS instagram text;
`;

async function runSQL() {
  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${projectId}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });
    const text = await res.text();
    console.log('Status:', res.status, text);
  } catch(e) {
    console.error(e);
  }
}

runSQL();
