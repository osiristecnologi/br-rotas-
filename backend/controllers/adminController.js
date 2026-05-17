const User = require('../models/User');
const Bet = require('../models/Bet');
const Game = require('../models/Game');
const Transaction = require('../models/Transaction');

// ===== ESTATÍSTICAS GERAIS =====
exports.getStats = async (req, res) => {
    try {
        const activeUsers = await User.countDocuments({ ativo: true });
        const totalBets = await Bet.countDocuments();
        const totalVolume = await Bet.aggregate([
            { $group: { _id: null, total: { $sum: '$valor' } } }
        ]);

        const todayBets = await Bet.countDocuments({
            criadoEm: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        const todayDeposits = await Transaction.aggregate([
            { $match: { tipo: 'deposito', criadoEm: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } },
            { $group: { _id: null, total: { $sum: '$valor' } } }
        ]);

        res.json({
            activeUsers,
            totalBets,
            totalVolume: totalVolume[0]?.total || 0,
            todayBets,
            todayDeposits: todayDeposits[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
};

// ===== LISTA DE USUÁRIOS =====
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-senha').sort({ criadoEm: -1 });
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};

// ===== ATUALIZAR USUÁRIO =====
exports.updateUser = async (req, res) => {
    try {
        const { nome, email, role, ativo } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { nome, email, role, ativo },
            { new: true }
        ).select('-senha');
        res.json({ message: 'Usuário atualizado', user });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
};

// ===== BLOQUEAR USUÁRIO =====
exports.blockUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { ativo: false },
            { new: true }
        ).select('-senha');
        res.json({ message: 'Usuário bloqueado', user });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao bloquear usuário' });
    }
};

// ===== TODAS AS APOSTAS =====
exports.getAllBets = async (req, res) => {
    try {
        const bets = await Bet.find().sort({ criadoEm: -1 }).limit(100).populate('usuarioId', 'nome email');
        res.json({ bets });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar apostas' });
    }
};

// ===== DEFINIR RESULTADO DE APOSTA =====
exports.setBetResult = async (req, res) => {
    try {
        const { status } = req.body; // 'ganha' ou 'perdida'
        const bet = await Bet.findById(req.params.id);
        if (!bet) return res.status(404).json({ error: 'Aposta não encontrada' });

        bet.status = status;
        await bet.save();

        if (status === 'ganha') {
            const user = await User.findById(bet.usuarioId);
            user.saldo += bet.retorno;
            await user.save();

            await Transaction.create({
                usuarioId: bet.usuarioId,
                tipo: 'ganho',
                valor: bet.retorno,
                status: 'completado',
                referencia: bet._id.toString()
            });
        }

        res.json({ message: `Resultado definido: ${status}`, bet });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao definir resultado' });
    }
};

// ===== ATUALIZAR ODDS =====
exports.updateOdds = async (req, res) => {
    try {
        const { casa, empate, fora } = req.body;
        const game = await Game.findByIdAndUpdate(
            req.params.id,
            { 'odds.casa': casa, 'odds.empate': empate, 'odds.fora': fora },
            { new: true }
        );
        res.json({ message: 'Odds atualizadas', game });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar odds' });
    }
};

// ===== CRIAR JOGO =====
exports.createGame = async (req, res) => {
    try {
        const game = await Game.create(req.body);
        res.status(201).json({ message: 'Jogo criado', game });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar jogo' });
    }
};
