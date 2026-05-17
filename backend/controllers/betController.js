const Bet = require('../models/Bet');
const User = require('../models/User');
const Game = require('../models/Game');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// ===== FAZER APOSTA - BACKEND CALCULA TUDO =====
exports.placeBet = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { gameId, tipoAposta, selecao, valor } = req.body;
        const userId = req.user.id;

        // 1. Validar valor
        if (!valor || valor <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Valor inválido' });
        }

        // 2. Obter jogo e odds atuais do banco (NÃO do frontend)
        const game = await Game.findById(gameId).session(session);
        if (!game) {
            await session.abortTransaction();
            return res.status(404).json({ error: 'Jogo não encontrado' });
        }

        if (game.status === 'encerrado' || game.status === 'cancelado') {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Jogo não disponível para apostas' });
        }

        // 3. Obter odd correta do backend
        let odd;
        switch (selecao.toLowerCase()) {
            case '1':
            case 'casa':
            case game.timeCasa.toLowerCase():
                odd = game.odds.casa;
                break;
            case 'x':
            case 'empate':
                odd = game.odds.empate;
                break;
            case '2':
            case 'fora':
            case game.timeFora.toLowerCase():
                odd = game.odds.fora;
                break;
            default:
                await session.abortTransaction();
                return res.status(400).json({ error: 'Seleção inválida' });
        }

        // 4. Calcular retorno no BACKEND
        const retorno = parseFloat((valor * odd).toFixed(2));

        // 5. Verificar saldo do usuário
        const user = await User.findById(userId).session(session);
        if (user.saldo < valor) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Saldo insuficiente' });
        }

        // 6. Debitar saldo
        user.saldo -= valor;
        await user.save({ session });

        // 7. Criar aposta
        const bet = await Bet.create([{
            usuarioId: userId,
            jogoId: gameId,
            tipoAposta,
            selecao,
            odd,
            valor,
            retorno,
            status: 'pendente',
            jogoNome: `${game.timeCasa} vs ${game.timeFora}`,
            jogoCompeticao: game.competicao
        }], { session });

        // 8. Registrar transação
        await Transaction.create([{
            usuarioId: userId,
            tipo: 'aposta',
            valor,
            status: 'completado',
            referencia: bet[0]._id.toString()
        }], { session });

        await session.commitTransaction();

        res.status(201).json({
            message: 'Aposta realizada com sucesso',
            aposta: bet[0],
            saldoAtual: user.saldo
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Erro ao fazer aposta:', error);
        res.status(500).json({ error: 'Erro ao processar aposta' });
    } finally {
        session.endSession();
    }
};

// ===== HISTÓRICO DE APOSTAS =====
exports.getHistory = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const query = { usuarioId: req.user.id };
        if (status) query.status = status;

        const bets = await Bet.find(query)
            .sort({ criadoEm: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Bet.countDocuments(query);

        res.json({
            bets,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
};

// ===== GET BET BY ID =====
exports.getBetById = async (req, res) => {
    try {
        const bet = await Bet.findOne({ _id: req.params.id, usuarioId: req.user.id });
        if (!bet) return res.status(404).json({ error: 'Aposta não encontrada' });
        res.json(bet);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno' });
    }
};

// ===== CASHOUT =====
exports.cashout = async (req, res) => {
    try {
        const bet = await Bet.findOne({ _id: req.params.id, usuarioId: req.user.id });
        if (!bet) return res.status(404).json({ error: 'Aposta não encontrada' });
        if (bet.status !== 'pendente') return res.status(400).json({ error: 'Aposta não elegível para cashout' });

        // Cashout = 70% do retorno possível
        const cashoutValue = parseFloat((bet.retorno * 0.7).toFixed(2));

        bet.status = 'cancelada';
        await bet.save();

        const user = await User.findById(req.user.id);
        user.saldo += cashoutValue;
        await user.save();

        await Transaction.create({
            usuarioId: req.user.id,
            tipo: 'reembolso',
            valor: cashoutValue,
            status: 'completado',
            referencia: bet._id.toString()
        });

        res.json({
            message: 'Cashout realizado com sucesso',
            valorCashout: cashoutValue,
            saldoAtual: user.saldo
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar cashout' });
    }
};

// ===== ESTATÍSTICAS DE APOSTAS =====
exports.getBetStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const totalBets = await Bet.countDocuments({ usuarioId: userId });
        const wonBets = await Bet.countDocuments({ usuarioId: userId, status: 'ganha' });
        const lostBets = await Bet.countDocuments({ usuarioId: userId, status: 'perdida' });
        const pendingBets = await Bet.countDocuments({ usuarioId: userId, status: 'pendente' });

        const totalStaked = await Bet.aggregate([
            { $match: { usuarioId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: '$valor' } } }
        ]);

        const totalWon = await Bet.aggregate([
            { $match: { usuarioId: new mongoose.Types.ObjectId(userId), status: 'ganha' } },
            { $group: { _id: null, total: { $sum: '$retorno' } } }
        ]);

        res.json({
            totalBets,
            wonBets,
            lostBets,
            pendingBets,
            winRate: totalBets > 0 ? ((wonBets / totalBets) * 100).toFixed(1) : 0,
            totalStaked: totalStaked[0]?.total || 0,
            totalWon: totalWon[0]?.total || 0,
            profit: (totalWon[0]?.total || 0) - (totalStaked[0]?.total || 0)
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
};
