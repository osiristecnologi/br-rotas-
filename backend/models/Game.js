const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    competicao: { type: String, required: true }, // 'Brasileirão Série A'
    timeCasa: { type: String, required: true },
    timeFora: { type: String, required: true },
    dataHora: { type: Date, required: true },
    status: {
        type: String,
        enum: ['agendado', 'ao_vivo', 'encerrado', 'cancelado'],
        default: 'agendado'
    },
    placar: {
        casa: { type: Number, default: 0 },
        fora: { type: Number, default: 0 }
    },
    tempo: { type: String }, // '2º Tempo - 67''
    odds: {
        casa: { type: Number, required: true },
        empate: { type: Number, required: true },
        fora: { type: Number, required: true }
    },
    estatisticas: {
        posseCasa: { type: Number },
        posseFora: { type: Number },
        finalizacoesCasa: { type: Number },
        finalizacoesFora: { type: Number },
        escanteiosCasa: { type: Number },
        escanteiosFora: { type: Number },
        cartoesCasa: { type: Number },
        cartoesFora: { type: Number }
    },
    criadoEm: { type: Date, default: Date.now }
});

gameSchema.index({ competicao: 1, status: 1 });
gameSchema.index({ dataHora: 1 });

module.exports = mongoose.model('Game', gameSchema);
