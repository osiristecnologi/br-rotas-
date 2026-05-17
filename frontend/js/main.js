// ===== STATE MANAGEMENT =====
let currentBalance = 1250.75;
let betSlipItems = [];
let liveTimer = 67;

// ===== NAVIGATION =====
function switchNavTab(el, tab) {
    document.querySelectorAll('.main-nav .nav-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');
    showToast(`Navegando para: ${tab.charAt(0).toUpperCase() + tab.slice(1)}`, 'info');
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburger');
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('active');
    document.getElementById('hamburger').classList.remove('active');
}

// ===== DROPDOWNS =====
function toggleNotifications() {
    closeAllDropdowns();
    document.getElementById('notifDropdown').classList.toggle('active');
}

function toggleProfile() {
    closeAllDropdowns();
    document.getElementById('profileDropdown').classList.toggle('active');
}

function closeAllDropdowns() {
    document.getElementById('notifDropdown').classList.remove('active');
    document.getElementById('profileDropdown').classList.remove('active');
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.header-icon-btn') && !e.target.closest('#notifDropdown')) {
        document.getElementById('notifDropdown').classList.remove('active');
    }
    if (!e.target.closest('.user-avatar') && !e.target.closest('#profileDropdown')) {
        document.getElementById('profileDropdown').classList.remove('active');
    }
});

// ===== BET SLIP =====
function addBetSlip(el, match, selection, type, odd) {
    el.classList.toggle('selected');

    if (el.classList.contains('selected')) {
        betSlipItems.push({ match, selection, type, odd, element: el });
    } else {
        betSlipItems = betSlipItems.filter(item => !(item.match === match && item.selection === selection));
    }

    updateSlipCount();
    showToast(`${selection} adicionado ao cupom`, 'success');
}

function removeBet(id) {
    const item = document.getElementById(id);
    if (item) item.remove();
    updateSlipCount();
    showToast('Aposta removida do cupom', 'info');
}

function clearBetSlip() {
    document.getElementById('betSlipBody').innerHTML = '';
    betSlipItems = [];
    updateSlipCount();
    showToast('Cupom limpo', 'info');
}

function updateSlipCount() {
    const items = document.querySelectorAll('#betSlipBody .bet-item');
    document.getElementById('slipCount').textContent = items.length;
}

function setStake(value) {
    const input = document.querySelector('.stake-input');
    if (input) {
        input.value = value;
        updatePotentialWin();
    }
}

function updatePotentialWin() {
    const input = document.querySelector('.stake-input');
    const oddEl = document.querySelector('.bet-odd');
    if (input && oddEl) {
        const stake = parseFloat(input.value) || 0;
        const odd = parseFloat(oddEl.textContent);
        const win = stake * odd;
        document.getElementById('potentialWin1').textContent = `R$ ${win.toFixed(2).replace('.', ',')}`;
        document.getElementById('totalStake').textContent = `R$ ${stake.toFixed(2).replace('.', ',')}`;
        document.getElementById('totalReturn').textContent = `R$ ${win.toFixed(2).replace('.', ',')}`;
    }
}

function placeBet() {
    const input = document.querySelector('.stake-input');
    const stake = parseFloat(input?.value) || 0;

    if (stake <= 0) {
        showToast('Insira um valor válido', 'error');
        return;
    }
    if (stake > currentBalance) {
        showToast('Saldo insuficiente!', 'error');
        return;
    }

    currentBalance -= stake;
    document.getElementById('headerBalance').textContent = formatCurrency(currentBalance);

    showToast(`✅ Aposta de ${formatCurrency(stake)} realizada com sucesso!`, 'success');
}

// ===== MATCH STATS =====
function toggleMatchStats(matchId) {
    const matchCard = document.getElementById(matchId);
    matchCard.classList.toggle('expanded');
    const btn = matchCard.querySelector('.match-expand-btn');
    if (matchCard.classList.contains('expanded')) {
        btn.innerHTML = '<i class="fas fa-chart-bar"></i> Esconder estatísticas';
    } else {
        btn.innerHTML = '<i class="fas fa-chart-bar"></i> Ver estatísticas';
    }
}

// ===== BET HISTORY FILTERS =====
function filterBets(btn, filter) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showToast(`Filtro aplicado: ${filter}`, 'info');
}

// ===== MODAL =====
function showDepositModal() {
    document.getElementById('depositModal').classList.add('active');
}

function closeDepositModal() {
    document.getElementById('depositModal').classList.remove('active');
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };

    toast.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        toast.style.transition = 'all 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== UTILITY =====
function formatCurrency(value) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

// ===== LIVE TIMER SIMULATION =====
setInterval(() => {
    liveTimer++;
    if (liveTimer > 90) liveTimer = 90;
    const timerEl = document.getElementById('match1Timer');
    if (timerEl) timerEl.textContent = `2º Tempo - ${liveTimer}'`;
}, 30000);

// ===== LIVE ODDS SIMULATION =====
setInterval(() => {
    document.querySelectorAll('.odd-value').forEach(el => {
        if (Math.random() > 0.85) {
            const currentVal = parseFloat(el.textContent.replace(',', '.'));
            const change = (Math.random() - 0.5) * 0.2;
            const newVal = Math.max(1.01, currentVal + change);
            el.textContent = newVal.toFixed(2).replace('.', ',');
            el.parentElement.classList.add('pulse-update');
            setTimeout(() => el.parentElement.classList.remove('pulse-update'), 1500);
        }
    });
}, 5000);

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    updatePotentialWin();
    showToast('Bem-vindo ao BR ROTAS! 🎉', 'success');
});
