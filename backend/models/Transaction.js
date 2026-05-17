const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tipo: {
        type: String,
        enum: ['deposito', 'saque', 'aposta', 'ganho', 'reembolso'],
        required: true
    },
    valor: { type: Number, required: true, min: 0 },
    metodo: { type: String }, // 'PIX', 'Cartão', 'Transferência'
    status: {
        type: String,
        enum: ['pendente', 'completado', 'falhou', 'cancelado'],
        default: 'pendente'
    },
    referencia: { type: String }, // código PIX ou ID externo
    criadoEm: { type: Date, default: Date.now }
});

transactionSchema.index({ usuarioId: 1, criadoEm: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
