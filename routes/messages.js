// api/messages.js

const { createClient } = require('@supabase/supabase-js');

// Conecta no Supabase
const supabase = createClient(
  'https://rlvblksgyvczdtxctspj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsdmJsa3NneXZjemR0eGN0c3BqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTg4Mzc1OCwiZXhwIjoyMDYxNDU5NzU4fQ.34ORfCD6xjoNW1PnjHyIU8sZrGpoW9c6eZkvZLCU4OE'
);

module.exports = async (request, response) => {
  if (request.method === 'POST') {
    const { userId, message } = request.body;

    if (!userId || !message) {
      return response.status(400).json({ error: 'userId e message são obrigatórios' });
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([
        { user_id: userId, message: message }
      ]);

    if (error) return response.status(500).json({ error: error.message });

    response.status(201).json({ data });
  } else if (request.method === 'GET') {
    const { data, error } = await supabase
      .from('messages')
      .select('*');

    if (error) return response.status(500).json({ error: error.message });

    response.status(200).json({ data });
  } else {
    response.status(405).json({ error: 'Método não permitido' });
  }
};
