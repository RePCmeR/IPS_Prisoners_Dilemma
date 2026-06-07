import { Game } from './Game.js';
import { DEFAULT_PAYOFF } from './PayoffMatrix.js';

export function runMatch(strategyA, strategyB, rounds = 10, payoffMatrix = DEFAULT_PAYOFF) {
    try {
        const game = new Game(strategyB, strategyB.startNodeId, payoffMatrix);
        let currentStateA = strategyA.startNodeId;
        for (let i = 0; i < rounds; i++) {
            const actionA = strategyA.getAction(currentStateA);
            const result = game.playRound(actionA);
            currentStateA = strategyA.getNextState(currentStateA, result.opponentAction);
        }
        return game.getScores();
    } catch (err) {
        console.error(`Ошибка в матче ${strategyA.name} vs ${strategyB.name}:`, err);
        return { player: 0, opponent: 0 };
    }
}

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