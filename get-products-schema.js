const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectId = 'nrkzjokujjtpmwfzygag';

const query = `
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products';
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
    console.log(text);
  } catch(e) {
    console.error(e);
  }
}

runSQL();
