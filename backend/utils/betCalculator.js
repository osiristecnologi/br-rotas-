/**
 * ===== CÁLCULO DE APOSTAS (BACKEND) =====
 * O frontend NUNCA calcula ganhos/perdas.
 * Tudo é processado no servidor para segurança.
 */

class BetCalculator {
    // Calcular retorno de uma aposta simples
    static calculateSimpleReturn(stake, odd) {
        if (!stake || !odd || stake <= 0 || odd < 1.01) {
            throw new Error('Parâmetros inválidos para cálculo');
        }
        return parseFloat((stake * odd).toFixed(2));
    }

    // Calcular retorno de uma aposta múltipla
    static calculateMultipleReturn(stake, oddsArray) {
        if (!stake || !oddsArray || oddsArray.length === 0) {
            throw new Error('Parâmetros inválidos para cálculo múltiplo');
        }
        const combinedOdd = oddsArray.reduce((acc, odd) => acc * odd, 1);
        return parseFloat((stake * combinedOdd).toFixed(2));
    }

    // Calcular cashout value (70% do retorno)
    static calculateCashout(stake, odd) {
        const retorno = this.calculateSimpleReturn(stake, odd);
        return parseFloat((retorno * 0.7).toFixed(2));
    }

    // Verificar se odd mudou significativamente
    static hasOddChanged(oldOdd, newOdd, threshold = 0.05) {
        return Math.abs(newOdd - oldOdd) >= threshold;
    }

    // Aplicar margem da casa nas odds
    static applyMargin(odds, margin = 0.05) {
        return odds.map(odd => parseFloat((odd * (1 - margin)).toFixed(2)));
    }
}

module.exports = BetCalculator;
