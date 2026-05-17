const rateLimit = require('express-rate-limit');

// Rate limiter geral
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: { error: 'Muitas requisições. Tente novamente mais tarde.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Rate limiter para auth (mais restritivo)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Muitas tentativas de autenticação. Aguarde 15 minutos.' }
});

// Rate limiter para apostas
const betLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 5,
    message: { error: 'Limite de apostas atingido. Aguarde 1 minuto.' }
});

module.exports = { generalLimiter, authLimiter, betLimiter };
