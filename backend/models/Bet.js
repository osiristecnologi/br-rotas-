const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jogoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    tipoAposta: {
        type: String,
        enum: ['resultado_final', 'dupla_chance', 'ambas_marcam', 'over_under', 'handicap'],
        required: true
    },
    selecao: { type: String, required: true }, // 'Flamengo', 'Empate', 'Over 2.5', etc.
    odd: { type: Number, required: true, min: 1.01 },
    valor: { type: Number, required: true, min: 1 },
    retorno: { type: Number, required: true }, // calculado no backend
    status: {
        type: String,
        enum: ['pendente', 'ganha', 'perdida', 'cancelada'],
        default: 'pendente'
    },
    jogoNome: { type: String }, // snapshot do nome do jogo
    jogoCompeticao: { type: String }, // snapshot da competição
    criadoEm: { type: Date, default: Date.now }
});

// Índice para buscas rápidas
betSchema.index({ usuarioId: 1, criadoEm: -1 });
betSchema.index({ status: 1 });

module.exports = mongoose.model('Bet', betSchema);
