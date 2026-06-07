// Стандартная матрица выигрышей (игрок, противник)
export const DEFAULT_PAYOFF = {
    'C,C': [3, 3],
    'C,D': [0, 5],
    'D,C': [5, 0],
    'D,D': [1, 1]
};

// Возвращает очки для пары действий; если матрица не задана, используется DEFAULT_PAYOFF
export function getPayoff(playerAction, opponentAction, matrix = DEFAULT_PAYOFF) {
    const key = `${playerAction},${opponentAction}`;
    return matrix[key] || [0, 0];
}