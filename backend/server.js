require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const securityConfig = require('./config/security');
const { generalLimiter, authLimiter, betLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const path = require('path');

// Servir frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rota raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'))
});

// Tuas rotas da API continuam normal
app.use('/api/auth', require('./routes/auth'))
// ... resto das rotas
// ===== SEGURANÇA =====
securityConfig(app);

// ===== RATE LIMITING =====
app.use(generalLimiter);

// ===== ROTAS =====
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/bets', betLimiter, require('./routes/bets'));
app.use('/api/games', require('./routes/games'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/admin', require('./routes/admin'));

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'BR ROTAS API'
    });
});

// ===== ERROR HANDLER =====
app.use(errorHandler);

// ===== INICIAR SERVIDOR =====
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('🚀 BR ROTAS Server rodando na porta ' + PORT);
        console.log('📡 API: http://localhost:' + PORT);
        console.log(' Frontend: http://localhost:3000');
    });
});
