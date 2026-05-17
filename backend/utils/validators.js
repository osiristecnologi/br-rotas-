const { body, validationResult } = require('express-validator');

// Middleware para validar resultados
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Erro de validação',
            details: errors.array().map(e => e.msg)
        });
    }
    next();
};

// Validação de registro
exports.validateRegister = [
    body('nome').notEmpty().withMessage('Nome é obrigatório').trim(),
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    handleValidation
];

// Validação de login
exports.validateLogin = [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('senha').notEmpty().withMessage('Senha é obrigatória'),
    handleValidation
];

// Validação de aposta
exports.validateBet = [
    body('gameId').isMongoId().withMessage('ID do jogo inválido'),
    body('tipoAposta').notEmpty().withMessage('Tipo de aposta é obrigatório'),
    body('selecao').notEmpty().withMessage('Seleção é obrigatória'),
    body('valor').isFloat({ min: 1 }).withMessage('Valor mínimo é R$ 1,00'),
    handleValidation
];
