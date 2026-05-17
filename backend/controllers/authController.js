const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ===== REGISTRO =====
exports.register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // Verificar se email já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        // Criar usuário
        const user = await User.create({ nome, email, senha });

        // Gerar token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            user: user.toPublicJSON()
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// ===== LOGIN =====
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Buscar usuário
        const user = await User.findOne({ email });
        if (!user || !(await user.verificarSenha(senha))) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        if (!user.ativo) {
            return res.status(403).json({ error: 'Conta bloqueada' });
        }

        // Gerar tokens
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );

        res.json({
            message: 'Login realizado com sucesso',
            token,
            refreshToken,
            user: user.toPublicJSON()
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// ===== REFRESH TOKEN =====
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ error: 'Token não fornecido' });

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || !user.ativo) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        const newToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token: newToken });
    } catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

// ===== GET ME =====
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-senha');
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json(user.toPublicJSON());
    } catch (error) {
        res.status(500).json({ error: 'Erro interno' });
    }
};

// ===== UPDATE PROFILE =====
exports.updateProfile = async (req, res) => {
    try {
        const { nome, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { nome, email, atualizadoEm: Date.now() },
            { new: true }
        );
        res.json({ message: 'Perfil atualizado', user: user.toPublicJSON() });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
};

// ===== UPDATE PASSWORD =====
exports.updatePassword = async (req, res) => {
    try {
        const { senhaAtual, novaSenha } = req.body;
        const user = await User.findById(req.user.id);

        if (!(await user.verificarSenha(senhaAtual))) {
            return res.status(401).json({ error: 'Senha atual incorreta' });
        }

        user.senha = novaSenha;
        await user.save();

        res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar senha' });
    }
};
