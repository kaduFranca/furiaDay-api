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

// Middleware CORS
app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log('=== CORS Debug ===');
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Origin:', origin);
    console.log('Headers:', req.headers);
    
    // Se não houver origem (requisição do mesmo domínio) ou se a origem for permitida
    const isAllowed = !origin || allowedOrigins.some(allowedOrigin => {
        if (allowedOrigin.includes('*')) {
            const regex = new RegExp('^' + allowedOrigin.replace('*', '.*') + '$');
            return regex.test(origin);
        }
        return allowedOrigin === origin;
    });

    console.log('Is Origin Allowed:', isAllowed);
    
    if (isAllowed) {
        // Se não houver origem, não definimos o header Access-Control-Allow-Origin
        if (origin) {
            res.header('Access-Control-Allow-Origin', origin);
        }
    } else {
        console.log('Origin not allowed:', origin);
        console.log('Allowed origins:', allowedOrigins);
    }

    // Headers CORS
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Referer, User-Agent, Sec-Ch-Ua, Sec-Ch-Ua-Mobile, Sec-Ch-Ua-Platform, Cache-Control, Pragma');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24 horas
    res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    
    // Responde imediatamente para requisições OPTIONS
    if (req.method === 'OPTIONS') {
        console.log('OPTIONS request received');
        console.log('Response Headers:', res.getHeaders());
        return res.status(200).end();
    }
    
    next();
});

// Middleware para parsear JSON
app.use(express.json());
app.use(express.text()); // Adiciona suporte para text/plain

// Middleware para log de todas as requisições
app.use((req, res, next) => {
    console.log('=== Request Debug ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Registra as rotas
app.use('/users', userRouter);
app.use('/messages', messagesRouter);
app.use('/liquipedia', liquipediaRouter);

app.get('/', (req, res) => {
  res.send('1,2,3... FURIA!!!');
});

module.exports = app;


