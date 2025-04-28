// api/index.js

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
  console.log("sim")
});

module.exports = app;

