const User = require('../models/User');
const Transaction = require('../models/Transaction');

// ===== SALDO =====
exports.getBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('saldo');
        res.json({ saldo: user.saldo });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar saldo' });
    }
};

// ===== DEPÓSITO =====
exports.deposit = async (req, res) => {
    try {
        const { valor, metodo } = req.body;
        if (!valor || valor <= 0) return res.status(400).json({ error: 'Valor inválido' });

        const user = await User.findById(req.user.id);
        user.saldo += valor;
        await user.save();

        await Transaction.create({
            usuarioId: req.user.id,
            tipo: 'deposito',
            valor,
            metodo,
            status: 'completado'
        });

        res.json({ message: 'Depósito realizado', saldo: user.saldo });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar depósito' });
    }
};

// ===== SAQUE =====
exports.withdraw = async (req, res) => {
    try {
        const { valor, metodo } = req.body;
        if (!valor || valor <= 0) return res.status(400).json({ error: 'Valor inválido' });

        const user = await User.findById(req.user.id);
        if (user.saldo < valor) return res.status(400).json({ error: 'Saldo insuficiente' });

        user.saldo -= valor;
        await user.save();

        await Transaction.create({
            usuarioId: req.user.id,
            tipo: 'saque',
            valor,
            metodo,
            status: 'pendente'
        });

        res.json({ message: 'Saque solicitado', saldo: user.saldo });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar saque' });
    }
};

// ===== HISTÓRICO DE TRANSAÇÕES =====
exports.getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const transactions = await Transaction.find({ usuarioId: req.user.id })
            .sort({ criadoEm: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Transaction.countDocuments({ usuarioId: req.user.id });
        res.json({ transactions, total });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar transações' });
    }
};
