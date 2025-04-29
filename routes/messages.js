// routes/messages.js

const express = require('express');
const router = express.Router();
const supabase = require('../supabase/client');

// Enviar uma nova mensagem
router.post('/', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'userId e message são obrigatórios' });
  }

  try {
    // Inserir a mensagem do usuário
    const { data: userMessage, error: userError } = await supabase
      .from('messages')
      .insert([{ user_id: userId, message }])
      .select()
      .single();

    if (userError) throw userError;

    // Simular resposta do bot
    const botReply = `Recebi sua mensagem: "${message}"`;

    // Inserir a resposta do bot
    const { data: botMessage, error: botError } = await supabase
      .from('messages')
      .insert([{ user_id: 'bot', message: botReply }])
      .select()
      .single();

    if (botError) throw botError;

    res.status(201).json({
      userMessage,
      botMessage,
    });
  } catch (error) {
    console.error('Erro ao processar a mensagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter todas as mensagens
router.get('/', async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.status(200).json(messages);
  } catch (error) {
    console.error('Erro ao obter mensagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
