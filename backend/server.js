require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const securityConfig = require('./config/security');
const { generalLimiter, authLimiter, betLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

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
