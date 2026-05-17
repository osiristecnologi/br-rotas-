const express = require('express');
const router = express.Router();
const betController = require('../controllers/betController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/bets/place - Fazer aposta (BACKEND calcula tudo)
router.post('/place', verifyToken, betController.placeBet);

// GET /api/bets/history - Histórico do usuário
router.get('/history', verifyToken, betController.getHistory);

// GET /api/bets/:id - Detalhes de uma aposta
router.get('/:id', verifyToken, betController.getBetById);

// POST /api/bets/:id/cashout - Cashout (fechar aposta ao vivo)
router.post('/:id/cashout', verifyToken, betController.cashout);

// GET /api/bets/stats - Estatísticas de apostas do usuário
router.get('/stats', verifyToken, betController.getBetStats);

module.exports = router;
