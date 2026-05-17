const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../utils/validators');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', validateRegister, authController.register);

// POST /api/auth/login
router.post('/login', validateLogin, authController.login);

// POST /api/auth/refresh
router.post('/refresh', authController.refreshToken);

// GET /api/auth/me
router.get('/me', verifyToken, authController.getMe);

// PUT /api/auth/profile
router.put('/profile', verifyToken, authController.updateProfile);

// PUT /api/auth/password
router.put('/password', verifyToken, authController.updatePassword);

module.exports = router;
