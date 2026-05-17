require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
const securityConfig = require('./config/security');
const { generalLimiter, authLimiter, betLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 1. Body parser
app.use(express.json());

// 2. Segurança - antes de tudo
securityConfig(app);

// 3. Rate limit geral
app.use(generalLimiter);

// 4. SERVIR FRONTEND - TEM QUE VIR ANTES DAS ROTAS
app.use(express.static(path.join(__dirname, '../frontend')));

// 5. ROTAS DA API
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/bets', betLimiter, require('./routes/bets'));
app.use('/api/games', require('./routes/games'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/admin', require('./routes/admin'));

// 6. Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'BR ROTAS API'
    });
});

// 7. Catch-all pro SPA - tem que ser o ÚLTIMO app.get
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 8. Error handler - SEMPRE por último
app.use(errorHandler);

// 9. Iniciar servidor
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 BR ROTAS Server rodando na porta ${PORT}`);
        console.log(`📡 API: http://localhost:${PORT}`);
    });
});
