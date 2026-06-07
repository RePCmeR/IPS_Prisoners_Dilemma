import { GraphEditor } from './GraphEditor.js';
import { GameUI } from './GameUI.js';
import { DEFAULT_PAYOFF } from '../core/PayoffMatrix.js';
import { Game } from '../core/Game.js';

function oneVsOneTemplate() {
    return `
    <h2>Режим 1 на 1</h2>
    <p class="description">Создайте или загрузите стратегии для симуляции</p>
    <button id="btn-open-editor" class="btn btn-primary" style="width:auto;">Открыть редактор</button>
    <button id="btn-config-payoff" class="btn btn-secondary" style="width:auto; margin-left:10px;">Матрица выигрышей</button>

    <div id="sim-play-area" style="margin-top:1.5rem;">
        <label class="description" style="display:block;">Количество раундов: <input id="sim-rounds" type="number" value="10" min="1" style="width:auto; padding:0.5rem;" /></label>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <div style="display:flex; flex-direction:column; align-items:center;">
                <button id="btn-manual-mode" class="btn btn-primary" style="width:auto;">Играть вручную</button>
                <span id="manual-hint" style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;"></span>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center;">
                <button id="btn-sim-mode" class="btn btn-primary" style="width:auto;">Симуляция</button>
                <span id="sim-hint" style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;"></span>
            </div>
        </div>
    </div>

    <div id="sim-auto-container" style="display:none; margin-top:1.5rem;">
        <div id="sim-graph" style="width:100%; height:350px; background:rgba(0,0,0,0.2); border-radius:12px;"></div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
            <span class="player-score">Своя: <span id="sim-my-score">0</span></span>
            <span class="opponent-score">Противник: <span id="sim-opp-score">0</span></span>
            <span>Раунд: <span id="sim-round-counter">0/0</span></span>
        </div>
        <div style="display:flex; gap:10px; margin-top:10px;">
            <button id="btn-next-round" class="btn btn-primary" style="width:auto;">Следующий раунд</button>
            <button id="btn-finish-sim" class="btn btn-outline" style="width:auto;">Завершить</button>
        </div>
    </div>

    <div id="sim-result" style="margin-top:1rem;"></div>

    <div id="payoff-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); align-items:center; justify-content:center; z-index:100;">
        <div class="card" style="max-width:500px; margin:auto; background:var(--card-bg);">
            <h3>Матрица выигрышей</h3>
            <table style="margin: 0 auto; border-collapse: collapse;">
                <tr><th></th><th style="padding: 8px;">C противника</th><th style="padding: 8px;">D противника</th></tr>
                <tr><td style="padding: 8px;">C игрока</td><td style="padding: 8px;"><input id="pay-cc-p" type="number" style="width:60px;"> : <input id="pay-cc-o" type="number" style="width:60px;"></td><td style="padding: 8px;"><input id="pay-cd-p" type="number" style="width:60px;"> : <input id="pay-cd-o" type="number" style="width:60px;"></td></tr>
                <tr><td style="padding: 8px;">D игрока</td><td style="padding: 8px;"><input id="pay-dc-p" type="number" style="width:60px;"> : <input id="pay-dc-o" type="number" style="width:60px;"></td><td style="padding: 8px;"><input id="pay-dd-p" type="number" style="width:60px;"> : <input id="pay-dd-o" type="number" style="width:60px;"></td></tr>
            </table>
            <div style="text-align:center; margin-top:1rem;">
                <button id="btn-save-payoff" class="btn btn-primary">Сохранить</button>
                <button id="btn-cancel-payoff" class="btn btn-secondary" style="margin-left:10px;">Отмена</button>
            </div>
        </div>
    </div>
    `;
}

export class SimulatorUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    showOneVsOne() {
        this.container.innerHTML = oneVsOneTemplate();
        this.container.style.display = 'block';

        const openEditorBtn = document.getElementById('btn-open-editor');
        const roundsInput = document.getElementById('sim-rounds');

        this.updateHints = () => {
            const opp = window.graphEditor?.getOpponentStrategy();
            const my = window.graphEditor?.getMyStrategy();

            const manualHint = document.getElementById('manual-hint');
            const simHint = document.getElementById('sim-hint');
            const manualBtn = document.getElementById('btn-manual-mode');
            const simBtn = document.getElementById('btn-sim-mode');

            if (!opp && !my) {
                manualHint.innerText = '⚠️ Нужна хотя бы одна стратегия';
                manualBtn.disabled = false;
            } else {
                manualHint.innerText = '✅ Можно играть';
            }

            if (!opp || !my) {
                simHint.innerText = '⚠️ Нужны обе стратегии';
                simBtn.disabled = false;
            } else {
                simHint.innerText = '✅ Можно запустить';
            }
        };

        openEditorBtn.onclick = () => {
            document.getElementById('simulator-screen').classList.remove('active');
            document.getElementById('editor-screen').classList.add('active');
            if (!window.graphEditor) {
                window.graphEditor = new GraphEditor('cy-container', 'palette');
            }
        };

        const originalBackEditor = document.getElementById('btn-back-editor')?.onclick;
        if (originalBackEditor) {
            document.getElementById('btn-back-editor').onclick = () => {
                originalBackEditor();
                this.updateHints();
            };
        }

        document.getElementById('btn-config-payoff').onclick = () => {
            const m = window.currentPayoff || DEFAULT_PAYOFF;
            document.getElementById('pay-cc-p').value = m['C,C'][0];
            document.getElementById('pay-cc-o').value = m['C,C'][1];
            document.getElementById('pay-cd-p').value = m['C,D'][0];
            document.getElementById('pay-cd-o').value = m['C,D'][1];
            document.getElementById('pay-dc-p').value = m['D,C'][0];
            document.getElementById('pay-dc-o').value = m['D,C'][1];
            document.getElementById('pay-dd-p').value = m['D,D'][0];
            document.getElementById('pay-dd-o').value = m['D,D'][1];
            document.getElementById('payoff-modal').style.display = 'flex';
        };
        document.getElementById('btn-save-payoff').onclick = () => {
            window.currentPayoff = {
                'C,C': [parseInt(document.getElementById('pay-cc-p').value) || 0, parseInt(document.getElementById('pay-cc-o').value) || 0],
                'C,D': [parseInt(document.getElementById('pay-cd-p').value) || 0, parseInt(document.getElementById('pay-cd-o').value) || 0],
                'D,C': [parseInt(document.getElementById('pay-dc-p').value) || 0, parseInt(document.getElementById('pay-dc-o').value) || 0],
                'D,D': [parseInt(document.getElementById('pay-dd-p').value) || 0, parseInt(document.getElementById('pay-dd-o').value) || 0]
            };
            document.getElementById('payoff-modal').style.display = 'none';
        };
        document.getElementById('btn-cancel-payoff').onclick = () => {
            document.getElementById('payoff-modal').style.display = 'none';
        };

        document.getElementById('btn-manual-mode').onclick = () => {
            let oppStrategy = window.graphEditor?.getOpponentStrategy();
            const myStrategy = window.graphEditor?.getMyStrategy();
            if (!oppStrategy && myStrategy) oppStrategy = myStrategy;
            if (!oppStrategy) {
                alert('Для ручной игры создайте хотя бы одну стратегию (противника или свою).');
                return;
            }
            const rounds = parseInt(roundsInput.value) || 10;

            const prevGameParent = window.parentScreen.game;
            window.parentScreen.game = 'simulator';

            document.getElementById('simulator-screen').classList.remove('active');
            document.getElementById('game-screen').classList.add('active');
            document.getElementById('game-submenu').style.display = 'none';
            document.getElementById('game-area').style.display = 'block';
            new GameUI('game-area', oppStrategy, rounds, window.currentPayoff, () => {
                document.getElementById('game-screen').classList.remove('active');
                document.getElementById('simulator-screen').classList.add('active');
                window.parentScreen.game = prevGameParent;
                this.showOneVsOne();
            });
        };

        document.getElementById('btn-sim-mode').onclick = () => {
            const oppStrategy = window.graphEditor?.getOpponentStrategy();
            const myStrategy = window.graphEditor?.getMyStrategy();
            if (!oppStrategy || !myStrategy) {
                alert('Для симуляции нужны обе стратегии (своя и противника).');
                return;
            }
            const rounds = parseInt(roundsInput.value) || 10;
            this.startAutoSimulation(oppStrategy, myStrategy, rounds, window.currentPayoff);
        };

        this.updateHints();
    }

    startAutoSimulation(oppStrategy, myStrategy, rounds, payoff) {
        const playArea = document.getElementById('sim-play-area');
        playArea.style.display = 'none';
        const autoContainer = document.getElementById('sim-auto-container');
        autoContainer.style.display = 'block';

        const game = new Game(oppStrategy, oppStrategy.startNodeId, payoff);
        let currentMyState = myStrategy.startNodeId;
        let currentRound = 0;

        const cy = cytoscape({
            container: document.getElementById('sim-graph'),
            elements: this.getCyElements(oppStrategy),
            style: [
                {
                    selector: 'node',
                    style: { 'background-color': '#aaa', 'label': 'data(action)', 'text-valign': 'center', 'color': '#fff', 'width': 55, 'height': 55, 'border-width': 3, 'border-style': 'solid' }
                },
                {
                    selector: 'node.cooperate',
                    style: { 'background-color': '#4caf50', 'border-color': '#2e7d32' }
                },
                {
                    selector: 'node.defect',
                    style: { 'background-color': '#f44336', 'border-color': '#c62828' }
                },
                {
                    selector: 'node.current',
                    style: { 'border-width': 5, 'border-color': '#ff9800', 'border-style': 'solid' }
                },
                {
                    selector: 'edge',
                    style: { 'width': 2, 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'line-color': '#888', 'target-arrow-color': '#888' }
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

        const highlightNode = (nodeId) => {
            cy.nodes().removeClass('current');
            if (nodeId) cy.getElementById(nodeId).addClass('current');
        };
        highlightNode(game.currentNodeId);

        const updateUI = () => {
            document.getElementById('sim-my-score').innerText = game.playerScore;
            document.getElementById('sim-opp-score').innerText = game.opponentScore;
            document.getElementById('sim-round-counter').innerText = `${currentRound}/${rounds}`;
        };
        updateUI();

        document.getElementById('btn-next-round').onclick = () => {
            if (currentRound >= rounds) {
                alert('Симуляция завершена. Нажмите «Завершить».');
                return;
            }
            const myAction = myStrategy.getAction(currentMyState);
            const result = game.playRound(myAction);
            currentMyState = myStrategy.getNextState(currentMyState, result.opponentAction);
            currentRound++;
            highlightNode(game.currentNodeId);
            updateUI();
            if (currentRound >= rounds) {
                document.getElementById('btn-next-round').disabled = true;
                document.getElementById('sim-result').innerHTML = `
                    <p>Симуляция завершена!</p>
                    <p>Своя стратегия: ${game.playerScore} очков</p>
                    <p>Противник: ${game.opponentScore} очков</p>
                `;
            }
        };

        document.getElementById('btn-finish-sim').onclick = () => {
            cy.destroy();
            autoContainer.style.display = 'none';
            document.getElementById('sim-result').innerHTML = '';
            playArea.style.display = 'block';
            document.getElementById('btn-next-round').disabled = false;
        };
    }

    getCyElements(strategy) {
        const nodes = strategy.nodes.map(n => ({
            group: 'nodes',
            data: { id: n.id, action: n.action },
            classes: n.action === 'C' ? 'cooperate' : 'defect',
            position: { x: n.x || 200, y: n.y || 200 }
        }));
        const edges = strategy.edges.map(e => ({
            group: 'edges',
            data: {
                source: e.source,
                target: e.target,
                playerAction: e.playerAction,
                probability: e.probability
            },
            classes: e.playerAction === 'C' ? 'playerC' : 'playerD'
        }));
        return nodes.concat(edges);
    }

    showTournament() {
        import('./TournamentUI.js').then(mod => {
            const tourUI = new mod.TournamentUI('tournament-bracket', 'strategy-list');
            document.getElementById('simulator-screen').classList.remove('active');
            document.getElementById('tournament-screen').classList.add('active');
            window.tourUI = tourUI;
        });
    }
}