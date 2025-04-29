const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('1,2,3... FURIA!!!');
});

module.exports = app;


