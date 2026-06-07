import { Game } from './Game.js';
import { DEFAULT_PAYOFF } from './PayoffMatrix.js';

// Проводит один матч между двумя стратегиями (A – игрок, B – противник)
export function runMatch(strategyA, strategyB, rounds = 10, payoffMatrix = DEFAULT_PAYOFF) {
    try {
        const game = new Game(strategyB, strategyB.startNodeId, payoffMatrix);
        let currentStateA = strategyA.startNodeId;
        for (let i = 0; i < rounds; i++) {
            const actionA = strategyA.getAction(currentStateA);
            const result = game.playRound(actionA);
            // Стратегия A реагирует на ход противника
            currentStateA = strategyA.getNextState(currentStateA, result.opponentAction);
        }
        return game.getScores();
    } catch (err) {
        console.error(`Ошибка в матче ${strategyA.name} vs ${strategyB.name}:`, err);
        return { player: 0, opponent: 0 };
    }
}

// Круговой турнир: каждая стратегия играет против каждой (по одному матчу)
export function runTournament(strategies, rounds = 10, payoffMatrix = DEFAULT_PAYOFF) {
    const scores = {};
    strategies.forEach(s => { scores[s.name] = 0; });
    for (const s1 of strategies) {
        for (const s2 of strategies) {
            if (s1 === s2) continue;
            const { player } = runMatch(s1, s2, rounds, payoffMatrix);
            scores[s1.name] += player;
        }
    }
    return scores;
}