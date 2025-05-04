const express = require('express');
const app = express();
const messagesRouter = require('../routes/messages');
const liquipediaRouter = require('../routes/liquipediaRoutes');
const userRouter = require('../routes/userRoutes');

// Configuração CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());

// Registra as rotas
app.use('/users', userRouter);
app.use('/messages', messagesRouter);
app.use('/liquipedia', liquipediaRouter);

app.get('/', (req, res) => {
  res.send('1,2,3... FURIA!!!');
});

module.exports = app;


