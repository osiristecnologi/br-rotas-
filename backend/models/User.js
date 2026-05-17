const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    senha: { type: String, required: true },
    saldo: { type: Number, default: 0, min: 0 },
    role: {
        type: String,
        enum: ['user', 'admin', 'vip'],
        default: 'user'
    },
    ativo: { type: Boolean, default: true },
    doisFA: { type: Boolean, default: false },
    criadoEm: { type: Date, default: Date.now },
    atualizadoEm: { type: Date, default: Date.now }
});

// Hash senha antes de salvar
userSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) return next();
    this.senha = await bcrypt.hash(this.senha, 12);
    this.atualizadoEm = Date.now();
    next();
});

// Método para verificar senha
userSchema.methods.verificarSenha = async function(senhaDigitada) {
    return await bcrypt.compare(senhaDigitada, this.senha);
};

// Método para retornar dados públicos (sem senha)
userSchema.methods.toPublicJSON = function() {
    return {
        id: this._id,
        nome: this.nome,
        email: this.email,
        saldo: this.saldo,
        role: this.role,
        ativo: this.ativo,
        criadoEm: this.criadoEm
    };
};

module.exports = mongoose.model('User', userSchema);
