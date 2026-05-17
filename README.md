# ️ BR ROTAS - Site de Apostas Esportivas

Sua casa de apostas brasileira com foco em futebol brasileiro.

## 📁 Estrutura
br-rotas/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
├── admin/
│   ├── index.html
│   ├── css/
│   │   └── admin.css
│   └── js/
│       └── admin.js
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   │   ├── database.js
│   │   └── security.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Bet.js
│   │   ├── Game.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bets.js
│   │   ├── games.js
│   │   ├── wallet.js
│   │   └── admin.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── betController.js
│   │   ├── gameController.js
│   │   ├── walletController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   ── utils/
│       ├── betCalculator.js
│       └── validators.js
└── README.md
