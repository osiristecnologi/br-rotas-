const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// TODAS as rotas admin requerem verificação de admin
router.use(verifyAdmin);

// GET /api/admin/stats - Estatísticas gerais
router.get('/stats', adminController.getStats);

// GET /api/admin/users - Lista de usuários
router.get('/users', adminController.getUsers);

// PUT /api/admin/users/:id - Atualizar usuário
router.put('/users/:id', adminController.updateUser);

// DELETE /api/admin/users/:id - Bloquear usuário
router.delete('/users/:id', adminController.blockUser);

// GET /api/admin/bets - Todas as apostas
router.get('/bets', adminController.getAllBets);

// PUT /api/admin/bets/:id/result - Definir resultado de aposta
router.put('/bets/:id/result', adminController.setBetResult);

// PUT /api/admin/games/:id/odds - Atualizar odds
router.put('/games/:id/odds', adminController.updateOdds);

// POST /api/admin/games - Criar novo jogo
router.post('/games', adminController.createGame);

module.exports = router;
