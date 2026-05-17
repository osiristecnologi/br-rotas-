const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ===== VERIFICAR TOKEN =====
exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verificar se usuário ainda existe e está ativo
        const user = await User.findById(decoded.id);
        if (!user || !user.ativo) {
            return res.status(403).json({ error: 'Usuário não encontrado ou inativo' });
        }

        req.user = { id: user._id, role: user.role };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        res.status(403).json({ error: 'Token inválido' });
    }
};

// ===== VERIFICAR ADMIN =====
exports.verifyAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
        }

        req.user = { id: user._id, role: user.role };
        next();
    } catch (error) {
        res.status(403).json({ error: 'Acesso negado' });
    }
};
