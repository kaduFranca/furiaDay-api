const express = require('express');
const router = express.Router();

// Simulação de banco de dados em memória
const messages = [];

// Enviar uma nova mensagem
router.post('/', (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'userId e message são obrigatórios' });
  }

  const newMessage = {
    id: messages.length + 1,
    userId,
    message,
    timestamp: new Date()
  };

  messages.push(newMessage);

  // Simulando resposta do bot
  const botResponse = {
    id: messages.length + 1,
    userId: 'bot',
    message: `Recebi sua mensagem: "${message}"`,
    timestamp: new Date()
  };

  messages.push(botResponse);

  res.status(201).json({
    userMessage: newMessage,
    botMessage: botResponse
  });
});

// Obter todas as mensagens (opcional, útil para testes)
router.get('/', (req, res) => {
  res.json(messages);
});

module.exports = router;
