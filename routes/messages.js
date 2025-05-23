const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const messageProcessor = require('../services/messageProcessor');

// Eu sei que é errado, mas não funcionou com variáveis de ambiente.
const supabase = createClient(
  'https://rlvblksgyvczdtxctspj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsdmJsa3NneXZjemR0eGN0c3BqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTg4Mzc1OCwiZXhwIjoyMDYxNDU5NzU4fQ.34ORfCD6xjoNW1PnjHyIU8sZrGpoW9c6eZkvZLCU4OE'
);

// Rota para criar uma nova mensagem
router.post('/', async (req, res) => {
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);

  let messageData;
  try {
    // Se o conteúdo for uma string, tenta parsear como JSON
    if (typeof req.body === 'string') {
      messageData = JSON.parse(req.body);
    } else {
      messageData = req.body;
    }
  } catch (error) {
    console.error('Erro ao parsear body:', error);
    return res.status(400).json({ error: 'Formato de mensagem inválido' });
  }

  const { content, timestamp, options, userId } = messageData;

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
        isBot: false,
        options: JSON.stringify(options || []),
        userId: userId
      })
      .select()
      .single();

    if (userError) {
      return res.status(500).json({ error: userError.message });
    }

    // Só depois que a mensagem do usuário for persistida, geramos e salvamos a resposta do bot
    const botResponse = await messageProcessor.processMessage(content, userId);
    const { data: botMessage, error: botError } = await supabase
      .from('messages')
      .insert({ 
        content: botResponse.content,
        timestamp: new Date().toISOString(),
        isBot: true,
        options: JSON.stringify(botResponse.options),
        userId: userId
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
});

// Rota para buscar todas as mensagens
router.get('/', async (req, res) => {
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

        // Converter as opções de string JSON para array
        userMsg.options = JSON.parse(userMsg.options || '[]');
        botMsg.options = JSON.parse(botMsg.options || '[]');

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
});

module.exports = router;
