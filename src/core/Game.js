import { getPayoff } from './PayoffMatrix.js';

export class Game {
    constructor(strategy, startNodeId = null, payoffMatrix = null) {
        this.strategy = strategy;
        this.currentNodeId = startNodeId || strategy.startNodeId;
        this.payoffMatrix = payoffMatrix;
        this.playerScore = 0;
        this.opponentScore = 0;
        this.round = 0;
        this.history = [];
    }

    playRound(playerAction) {
        const opponentAction = this.strategy.getAction(this.currentNodeId);
        const [pScore, oScore] = getPayoff(playerAction, opponentAction, this.payoffMatrix);
        this.playerScore += pScore;
        this.opponentScore += oScore;

        const nextNodeId = this.strategy.getNextState(this.currentNodeId, playerAction);
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