const { createClient } = require('@supabase/supabase-js');
const messageProcessor = require('../services/messageProcessor');

const supabase = createClient(
  'https://rlvblksgyvczdtxctspj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsdmJsa3NneXZjemR0eGN0c3BqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTg4Mzc1OCwiZXhwIjoyMDYxNDU5NzU4fQ.34ORfCD6xjoNW1PnjHyIU8sZrGpoW9c6eZkvZLCU4OE'
);

// Função para gerar resposta mock do bot
function generateBotResponse(userMessage) {
  const responses = [
    "FURIA é a melhor equipe do mundo!",
    "Vamos FURIA!",
    "FURIA sempre no topo!",
    "FURIA é sinônimo de vitória!",
    "FURIA é pura emoção!"
  ];
  
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

module.exports = async (req, res) => {
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);

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
  const { content, timestamp } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'O conteúdo da mensagem é obrigatório e deve ser uma string' });
  }

  try {
    // Salvar mensagem do usuário primeiro
    const { data: userMessage, error: userError } = await supabase
      .from('messages')
      .insert({ 
        content,
        timestamp: timestamp || new Date().toISOString(),
        isBot: false
      })
      .select()
      .single();

    if (userError) {
      return res.status(500).json({ error: userError.message });
    }

    // Só depois que a mensagem do usuário for persistida, geramos e salvamos a resposta do bot
    const botResponse = messageProcessor.processMessage(content);
    const { data: botMessage, error: botError } = await supabase
      .from('messages')
      .insert({ 
        content: botResponse,
        timestamp: new Date().toISOString(),
        isBot: true
      })
      .select()
      .single();

    if (botError) {
      return res.status(500).json({ error: botError.message });
    }

    return res.status(201).json({
      userMessage,
      botMessage
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function handleGet(res) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Erro ao buscar mensagens:', error);
      return res.status(500).json({ error: error.message });
    }

    // Agrupar mensagens do usuário com suas respectivas respostas do bot
    const groupedMessages = [];
    for (let i = 0; i < data.length; i += 2) {
      if (i + 1 < data.length) {
        // Identificar qual mensagem é do usuário e qual é do bot
        const userMsg = data[i].isBot ? data[i + 1] : data[i];
        const botMsg = data[i].isBot ? data[i] : data[i + 1];

        groupedMessages.push({
          userMessage: userMsg,
          botMessage: botMsg
        });
      }
    }

    return res.status(200).json(groupedMessages);
  } catch (error) {
    console.error('Erro geral:', error);
    return res.status(500).json({ error: error.message });
  }
}
