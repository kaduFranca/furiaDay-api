const express = require('express');
const app = express();
const messagesRouter = require('../routes/messages');
const liquipediaRouter = require('../routes/liquipediaRoutes');
const userRouter = require('../routes/userRoutes');

// Configuração CORS
const allowedOrigins = [
    'https://furia-day.vercel.app',
    'https://furia-*.vercel.app'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log('Origin:', origin);
    
    // Verifica se a origem está na lista de domínios permitidos
    if (allowedOrigins.some(allowedOrigin => {
        if (allowedOrigin.includes('*')) {
            const regex = new RegExp('^' + allowedOrigin.replace('*', '.*') + '$');
            return regex.test(origin);
        }
        return allowedOrigin === origin;
    })) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24 horas
    
    // Responde imediatamente para requisições OPTIONS
    if (req.method === 'OPTIONS') {
        console.log('OPTIONS request received');
        return res.status(200).end();
    }
    
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


