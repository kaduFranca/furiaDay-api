const express = require('express');
const app = express();
const messagesRouter = require('../routes/messages');
const liquipediaRouter = require('../routes/liquipediaRoutes');

app.use(express.json());
app.use('/messages', messagesRouter);
app.use('/liquipedia', liquipediaRouter);

app.get('/', (req, res) => {
  res.send('1,2,3... FURIA!!!');
});

module.exports = app;


