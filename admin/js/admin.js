// ===== ADMIN TAB SWITCHING =====
function switchAdminTab(el, tab) {
    document.querySelectorAll('.admin-nav-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');

    document.querySelectorAll('.admin-tab-content').forEach(content => content.style.display = 'none');

    const contentMap = {
        'dashboard': 'adminDashboard',
        'users': 'adminUsers',
        'bets': 'adminBets',
        'games': 'adminGames',
        'transactions': 'adminTransactions',
        'reports': 'adminReports',
        'settings': 'adminSettings'
    };

    if (contentMap[tab]) {
        document.getElementById(contentMap[tab]).style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🛡️ BR ROTAS - Painel Admin carregado');
});
