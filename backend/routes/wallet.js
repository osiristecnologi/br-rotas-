const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/wallet/balance - Saldo do usuário
router.get('/balance', verifyToken, walletController.getBalance);

// POST /api/wallet/deposit - Depositar
router.post('/deposit', verifyToken, walletController.deposit);

// POST /api/wallet/withdraw - Sacar
router.post('/withdraw', verifyToken, walletController.withdraw);

// GET /api/wallet/transactions - Histórico de transações
router.get('/transactions', verifyToken, walletController.getTransactions);

module.exports = router;
