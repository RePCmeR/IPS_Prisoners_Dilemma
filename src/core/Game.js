import { getPayoff } from './PayoffMatrix.js';

// Управляет одной партией (матчем) против заданной стратегии
export class Game {
    constructor(strategy, startNodeId = null, payoffMatrix = null) {
        this.strategy = strategy;
        this.currentNodeId = startNodeId || strategy.startNodeId; // текущее состояние противника
        this.payoffMatrix = payoffMatrix;
        this.playerScore = 0;
        this.opponentScore = 0;
        this.round = 0;               // счётчик прошедших раундов
        this.history = [];
    }

    // Один раунд: игрок делает ход, противник отвечает согласно своей стратегии
    playRound(playerAction) {
        const opponentAction = this.strategy.getAction(this.currentNodeId);
        const [pScore, oScore] = getPayoff(playerAction, opponentAction, this.payoffMatrix);
        this.playerScore += pScore;
        this.opponentScore += oScore;

        // Определяем следующее состояние противника
        const nextNodeId = this.strategy.getNextState(this.currentNodeId, playerAction);

        // Сохраняем историю
        this.history.push({
            round: ++this.round,
            playerAction,
            opponentAction,
            pScore,
            oScore,
            currentNodeId: this.currentNodeId,
            nextNodeId
        });
        this.currentNodeId = nextNodeId;
        return { playerAction, opponentAction, pScore, oScore, nextNodeId };
    }

    getScores() {
        return { player: this.playerScore, opponent: this.opponentScore };
    }
}