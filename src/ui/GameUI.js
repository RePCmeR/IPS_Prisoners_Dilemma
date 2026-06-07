import { Game } from '../core/Game.js';
import { DEFAULT_PAYOFF } from '../core/PayoffMatrix.js';

// HTML-шаблон игрового интерфейса
function gameUITemplate() {
    return `
    <div id="game-graph"></div>
    <div id="game-control-panel">
        <div class="game-buttons" style="display:flex; gap:10px; margin-bottom:10px;">
            <button id="btn-finish-game" class="btn btn-outline" style="width:auto;">Завершить игру</button>
            <button id="btn-restart-game" class="btn btn-secondary" style="width:auto;">Рестарт</button>
        </div>
        <div id="payoff-matrix-display"></div>
        <div id="score-panel">
            <span class="player-score">Игрок: <span id="player-score">0</span></span>
            <span class="opponent-score">Противник: <span id="opponent-score">0</span></span>
            <span>Раунд: <span id="round-counter">0/0</span></span>
        </div>
    </div>
    `;
}

// HTML-шаблон таблицы матрицы выигрышей
function payoffMatrixTemplate(matrix) {
    return `
    <h3>Матрица выигрышей</h3>
    <table>
        <tr><th></th><th>C (противник)</th><th>D (противник)</th></tr>
        <tr><td>C (вы)</td><td>${matrix['C,C'][0]}:${matrix['C,C'][1]}</td><td>${matrix['C,D'][0]}:${matrix['C,D'][1]}</td></tr>
        <tr><td>D (вы)</td><td>${matrix['D,C'][0]}:${matrix['D,C'][1]}</td><td>${matrix['D,D'][0]}:${matrix['D,D'][1]}</td></tr>
    </table>
    `;
}

// Управляет визуализацией игры и взаимодействием с пользователем
export class GameUI {
    constructor(containerId, strategy, rounds = 10, payoffMatrix = DEFAULT_PAYOFF, onFinish = null) {
        this.container = document.getElementById(containerId);
        this.strategy = strategy;
        this.totalRounds = rounds;
        this.roundsLeft = rounds;
        this.payoff = payoffMatrix;
        this.currentNodeId = strategy.startNodeId;
        this.playerScore = 0;
        this.opponentScore = 0;
        this.onFinish = onFinish; // колбэк при завершении игры

        this.container.innerHTML = gameUITemplate();
        this.container.style.display = 'block';
        this.game = new Game(strategy, strategy.startNodeId, payoffMatrix);
        this.cy = this.initCytoscape(); // инициализация графа
        this.highlightCurrent();
        this.attachEvents();
        this.updateScore();
        this.createControlPanel();
    }

    // Создаёт экземпляр Cytoscape для отрисовки графа стратегии
    initCytoscape() {
        const cy = cytoscape({
            container: document.getElementById('game-graph'),
            elements: this.getCyElements(),
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#aaa',
                        'label': 'data(action)',
                        'text-valign': 'center',
                        'color': '#fff',
                        'width': 55,
                        'height': 55,
                        'border-width': 3,
                        'border-style': 'solid'
                    }
                },
                {
                    selector: 'node.cooperate',
                    style: {
                        'background-color': '#4caf50',
                        'border-color': '#2e7d32'
                    }
                },
                {
                    selector: 'node.defect',
                    style: {
                        'background-color': '#f44336',
                        'border-color': '#c62828'
                    }
                },
                {
                    selector: 'node.current',
                    style: {
                        'border-width': 5,
                        'border-color': '#ff9800'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'line-color': '#888',
                        'target-arrow-color': '#888',
                        'label': 'data(label)',
                        'font-size': 10,
                        'color': '#fff',
                        'font-weight': 'bold',
                        'text-background-color': 'rgba(0,0,0,0.8)',
                        'text-background-opacity': 0.9,
                        'text-background-shape': 'round-rectangle',
                        'text-background-padding': '3px',
                        'text-rotation': 'autorotate'
                    }
                },
                {
                    selector: 'edge.playerC',
                    style: { 'line-color': '#4caf50', 'target-arrow-color': '#4caf50' }
                },
                {
                    selector: 'edge.playerD',
                    style: { 'line-color': '#f44336', 'target-arrow-color': '#f44336' }
                }
            ],
            layout: { name: 'preset' },
            userZooming: false,
            userPanning: false
        });
        return cy;
    }

    // Преобразует стратегию в элементы Cytoscape
    getCyElements() {
        const nodes = this.strategy.nodes.map(n => ({
            group: 'nodes',
            data: { id: n.id, action: n.action },
            classes: n.action === 'C' ? 'cooperate' : 'defect',
            position: { x: n.x || 200, y: n.y || 200 }
        }));
        const edges = this.strategy.edges.map(e => ({
            group: 'edges',
            data: {
                source: e.source,
                target: e.target,
                playerAction: e.playerAction,
                probability: e.probability,
                label: e.probability ? `${(e.probability * 100).toFixed(0)}%` : ''
            },
            classes: e.playerAction === 'C' ? 'playerC' : 'playerD'
        }));
        return nodes.concat(edges);
    }

    // Подсвечивает текущую вершину
    highlightCurrent() {
        this.cy.nodes().removeClass('current');
        this.cy.getElementById(this.currentNodeId).addClass('current');
    }

    // Назначает обработчики кликов для игры (левая кнопка – C, правая – D)
    attachEvents() {
        this.cy.on('tap', 'node', () => this.playRound('C'));
        this.cy.on('cxttap', 'node', () => this.playRound('D'));
        document.getElementById('game-graph').oncontextmenu = () => false;
    }

    // Выполняет один раунд игры
    playRound(playerAction) {
        if (this.roundsLeft <= 0) {
            this.endGame();
            return;
        }
        // Временно включаем случайный выбор переходов в стратегии
        const originalGetNextState = this.game.strategy.getNextState;
        this.game.strategy.getNextState = (currentNodeId, action) => {
            return originalGetNextState.call(this.game.strategy, currentNodeId, action, true);
        };
        const result = this.game.playRound(playerAction);
        this.game.strategy.getNextState = originalGetNextState;

        this.currentNodeId = result.nextNodeId;
        this.playerScore = this.game.playerScore;
        this.opponentScore = this.game.opponentScore;
        this.roundsLeft--;
        this.highlightCurrent();
        this.updateScore();
        if (this.roundsLeft === 0) {
            this.endGame();
        }
    }

    // Обновляет счёт и номер раунда на экране
    updateScore() {
        document.getElementById('player-score').innerText = this.playerScore;
        document.getElementById('opponent-score').innerText = this.opponentScore;
        document.getElementById('round-counter').innerText = `${this.game.round}/${this.totalRounds}`;
    }

    // Создаёт панель управления (кнопки "Завершить", "Рестарт", отображение матрицы)
    createControlPanel() {
        document.getElementById('btn-finish-game').onclick = () => {
            this.destroy();
            if (this.onFinish) {
                this.onFinish();
            } else {
                document.getElementById('game-submenu').style.display = 'block';
                document.getElementById('game-area').style.display = 'none';
            }
        };
        document.getElementById('btn-restart-game').onclick = () => {
            this.destroy();
            window.__currentGameUI = new GameUI(this.container.id, this.strategy, this.totalRounds, this.payoff, this.onFinish);
        };
        const matrixDiv = document.getElementById('payoff-matrix-display');
        if (matrixDiv) matrixDiv.innerHTML = payoffMatrixTemplate(this.payoff);
    }

    // Уничтожает Cytoscape и очищает контейнер
    destroy() {
        if (this.cy) {
            this.cy.destroy();
            this.cy = null;
        }
        const graphDiv = document.getElementById('game-graph');
        if (graphDiv) graphDiv.oncontextmenu = null;
        this.container.style.display = 'none';
        this.container.innerHTML = '';
        if (window.__currentGameUI === this) {
            window.__currentGameUI = null;
        }
    }

    // Завершает игру и показывает результат
    endGame() {
        let message = 'Игра окончена!\n';
        if (this.playerScore > this.opponentScore) message += 'Вы выиграли!';
        else if (this.playerScore < this.opponentScore) message += 'Вы проиграли.';
        else message += 'Ничья.';
        alert(message);
        this.cy.off('tap');
        this.cy.off('cxttap');
        const graphDiv = document.getElementById('game-graph');
        if (graphDiv) graphDiv.oncontextmenu = null;
    }
}