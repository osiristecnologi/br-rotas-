const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const securityConfig = (app) => {
    // Headers de segurança
    app.use(helmet());

    // CORS
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    }));

    // Parser JSON
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
};

module.exports = securityConfig;
