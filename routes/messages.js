const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://rlvblksgyvczdtxctspj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsdmJsa3NneXZjemR0eGN0c3BqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTg4Mzc1OCwiZXhwIjoyMDYxNDU5NzU4fQ.34ORfCD6xjoNW1PnjHyIU8sZrGpoW9c6eZkvZLCU4OE'
);

module.exports = async (req, res) => {
  switch (req.method) {
    case 'POST':
      return await handlePost(req, res);
    case 'GET':
      return await handleGet(res);
    default:
      return res.status(405).json({ error: 'Método não permitido' });
  }
};

async function handlePost(req, res) {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'userId e message são obrigatórios' });
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({ user_id: userId, message });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ data });
}

async function handleGet(res) {
  const { data, error } = await supabase
    .from('messages')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ data });
}
