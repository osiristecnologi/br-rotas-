const errorHandler = (err, req, res, next) => {
    console.error('❌ Erro:', err);

    // Erros de validação do MongoDB
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Erro de validação',
            details: Object.values(err.errors).map(e => e.message)
        });
    }

    // Erros de duplicação
    if (err.code === 11000) {
        return res.status(409).json({
            error: 'Conflito',
            message: 'Registro duplicado'
        });
    }

    // Erro de cast (ID inválido)
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'ID inválido' });
    }

    // Erro genérico
    res.status(err.statusCode || 500).json({
        error: err.message || 'Erro interno do servidor'
    });
};

module.exports = errorHandler;
