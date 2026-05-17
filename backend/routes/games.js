const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/games - Todos os jogos
router.get('/', gameController.getAll);

// GET /api/games/live - Jogos ao vivo
router.get('/live', gameController.getLive);

// GET /api/games/upcoming - Próximos jogos
router.get('/upcoming', gameController.getUpcoming);

// GET /api/games/:id - Detalhes de um jogo
router.get('/:id', gameController.getById);

// GET /api/games/:id/odds - Odds de um jogo
router.get('/:id/odds', gameController.getOdds);

// GET /api/games/competition/:comp - Jogos por competição
router.get('/competition/:comp', gameController.getByCompetition);

module.exports = router;
