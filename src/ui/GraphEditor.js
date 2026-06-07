import { Strategy } from '../core/Strategy.js';
import { saveStrategy } from '../data/storage.js';
import { presetStrategies } from '../data/presets.js';

export class GraphEditor {
    constructor(containerId, paletteId) {
        this.container = document.getElementById(containerId);
        this.palette = document.getElementById(paletteId);
        this.cy = null;
        this.currentMode = 'opponent';
        this.opponentStrategy = null;
        this.myStrategy = null;
        this.originalOpponent = null;
        this.originalMy = null;

        this.initCytoscape();
        this.initDragAndDrop();
        this.initEdgeCreation();
        this.initDeletion();
    }

    saveOriginalState() {
        this.originalOpponent = this.opponentStrategy ? this.opponentStrategy.clone() : null;
        this.originalMy = this.myStrategy ? this.myStrategy.clone() : null;
    }

    discardChanges() {
        if (this.currentMode === 'opponent') {
            this.opponentStrategy = this.originalOpponent;
            this.loadStrategyToEditor(this.opponentStrategy);
        } else {
            this.myStrategy = this.originalMy;
            this.loadStrategyToEditor(this.myStrategy);
        }
    }

    initCytoscape() {
        this.cy = cytoscape({
            container: this.container,
            elements: [],
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
                    style: { 'background-color': '#4caf50', 'border-color': '#2e7d32' }
                },
                {
                    selector: 'node.defect',
                    style: { 'background-color': '#f44336', 'border-color': '#c62828' }
                },
                {
                    selector: 'node.current',
                    style: { 'border-width': 4, 'border-color': '#ff9800', 'border-style': 'solid' }
                },
                {
                    selector: 'node.selected',
                    style: { 'border-width': 3, 'border-color': '#ffdd00', 'border-style': 'solid' }
                },
                {
                    selector: ':selected',
                    style: { 'overlay-opacity': 0.2, 'overlay-color': '#fff' }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'line-color': '#888',
                        'target-arrow-color': '#888'
                    }
                },
                {
                    selector: 'edge.playerC',
                    style: { 'line-color': '#4caf50', 'target-arrow-color': '#4caf50' }
                },
                {
                    selector: 'edge.playerD',
                    style: { 'line-color': '#f44336', 'target-arrow-color': '#f44336' }
                },
                {
                    selector: 'edge:selected',
                    style: { 'line-color': '#ffdd00', 'target-arrow-color': '#ffdd00' }
                }
            ],
            layout: { name: 'preset' },
            userZooming: true,
            userPanning: true
        });
    }

    initDeletion() {
        this.cy.on('keydown', (event) => {
            if (event.key === 'Delete' || event.key === 'Backspace') {
                const selected = this.cy.elements(':selected');
                if (selected.length > 0) selected.remove();
            }
        });
    }

    switchMode(mode) {
        if (mode === this.currentMode) return;
        this.saveCurrentToStrategy();
        this.currentMode = mode;
        this.loadStrategyToEditor(mode === 'opponent' ? this.opponentStrategy : this.myStrategy);
    }

    saveCurrentToStrategy() {
        const strat = this.buildStrategyFromCy();
        if (this.currentMode === 'opponent') this.opponentStrategy = strat;
        else this.myStrategy = strat;
    }

    loadStrategyToEditor(strategy) {
        this.cy.elements().remove();
        if (!strategy) return;
        strategy.nodes.forEach(n => {
            this.cy.add({
                group: 'nodes',
                data: { id: n.id, action: n.action },
                classes: n.action === 'C' ? 'cooperate' : 'defect',
                position: { x: n.x || 100, y: n.y || 100 }
            });
        });
        strategy.edges.forEach(e => {
            this.cy.add({
                group: 'edges',
                data: {
                    source: e.source,
                    target: e.target,
                    playerAction: e.playerAction,
                    probability: e.probability
                },
                classes: e.playerAction === 'C' ? 'playerC' : 'playerD'
            });
        });
        if (strategy.nodes.length > 0) this.cy.layout({ name: 'preset' }).run();
    }

    buildStrategyFromCy() {
        const nodes = this.cy.nodes().map(n => ({
            id: n.id(),
            action: n.data('action'),
            x: n.position().x,
            y: n.position().y
        }));
        const edges = this.cy.edges().map(e => ({
            source: e.data('source'),
            target: e.data('target'),
            playerAction: e.data('playerAction'),
            probability: e.data('probability') || undefined
        }));
        const startNode = this.cy.nodes()[0]?.id() || null;
        return new Strategy('temp', nodes, edges, startNode);
    }

    initDragAndDrop() {
        this.container.addEventListener('dragover', e => e.preventDefault());
        this.container.addEventListener('drop', e => {
            e.preventDefault();
            const action = e.dataTransfer.getData('text/plain');
            const rect = this.container.getBoundingClientRect();
            const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            const id = 'node_' + Date.now();
            this.cy.add({
                group: 'nodes',
                data: { id, action },
                position: pos,
                classes: action === 'C' ? 'cooperate' : 'defect'
            });
        });
        document.querySelectorAll('.drag-item').forEach(el => {
            el.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', e.target.dataset.action);
            });
        });
    }

    requestEdgeData() {
        return new Promise((resolve) => {
            const modal = document.getElementById('edge-modal');
            if (!modal) { resolve(null); return; }
            modal.style.display = 'flex';
            document.getElementById('edge-action').value = 'C';
            document.getElementById('edge-prob').value = '1';
            document.getElementById('prob-value').innerText = '1.00';

            const cBtn = document.getElementById('edge-action-c');
            const dBtn = document.getElementById('edge-action-d');
            const probSlider = document.getElementById('edge-prob');
            const probDisplay = document.getElementById('prob-value');
            const createBtn = document.getElementById('edge-create');
            const cancelBtn = document.getElementById('edge-cancel');

            cBtn.classList.add('selected');
            dBtn.classList.remove('selected');

            const setAction = (action) => {
                document.getElementById('edge-action').value = action;
                if (action === 'C') {
                    cBtn.classList.add('selected');
                    dBtn.classList.remove('selected');
                } else {
                    dBtn.classList.add('selected');
                    cBtn.classList.remove('selected');
                }
            };
            cBtn.onclick = () => setAction('C');
            dBtn.onclick = () => setAction('D');

            probSlider.oninput = () => {
                probDisplay.innerText = parseFloat(probSlider.value).toFixed(2);
            };

            const cleanup = () => {
                modal.style.display = 'none';
                cBtn.classList.remove('selected');
                dBtn.classList.remove('selected');
            };
            createBtn.onclick = () => {
                const action = document.getElementById('edge-action').value;
                let prob = parseFloat(probSlider.value);
                if (isNaN(prob) || prob < 0 || prob > 1) prob = 1;
                cleanup();
                resolve({ action, probability: prob < 1 ? prob : undefined });
            };
            cancelBtn.onclick = () => { cleanup(); resolve(null); };
        });
    }

    initEdgeCreation() {
        let sourceNode = null;
        this.cy.on('tap', 'node', async (evt) => {
            const node = evt.target;
            if (!sourceNode) {
                sourceNode = node;
                node.addClass('selected');
                return;
            }
            if (sourceNode === node) {
                const data = await this.requestEdgeData();
                if (!data) {
                    sourceNode.removeClass('selected');
                    sourceNode = null;
                    return;
                }
                const prob = data.probability;
                const label = data.action + (prob ? ` (${prob.toFixed(2)})` : '');
                this.cy.add({
                    group: 'edges',
                    data: {
                        source: sourceNode.id(),
                        target: sourceNode.id(),
                        playerAction: data.action,
                        probability: prob,
                        label
                    },
                    classes: data.action === 'C' ? 'playerC' : 'playerD'
                });
                sourceNode.removeClass('selected');
                sourceNode = null;
                return;
            }
            const data = await this.requestEdgeData();
            if (!data) {
                sourceNode.removeClass('selected');
                sourceNode = null;
                return;
            }
            const prob = data.probability;
            const label = data.action + (prob ? ` (${prob.toFixed(2)})` : '');
            this.cy.add({
                group: 'edges',
                data: {
                    source: sourceNode.id(),
                    target: node.id(),
                    playerAction: data.action,
                    probability: prob,
                    label
                },
                classes: data.action === 'C' ? 'playerC' : 'playerD'
            });
            sourceNode.removeClass('selected');
            sourceNode = null;
        });
    }

    validateStrategy() {
        const nodes = this.cy.nodes();
        const edges = this.cy.edges();
        let modified = false;
        nodes.forEach(node => {
            const nodeId = node.id();
            for (const action of ['C', 'D']) {
                const hasEdge = edges.some(
                    e => e.data('source') === nodeId && e.data('playerAction') === action
                );
                if (!hasEdge) {
                    this.cy.add({
                        group: 'edges',
                        data: {
                            source: nodeId,
                            target: nodeId,
                            playerAction: action,
                            probability: 1
                        },
                        classes: action === 'C' ? 'playerC' : 'playerD'
                    });
                    modified = true;
                }
            }
        });
        if (modified) window.showMessage('В некоторых вершинах не было переходов для C или D. Автоматически добавлены петли.');
    }

    async promptForName(defaultName) {
        return new Promise((resolve) => {
            const modal = document.getElementById('input-modal');
            const title = document.getElementById('input-modal-title');
            const field = document.getElementById('input-modal-field');
            const okBtn = document.getElementById('input-modal-ok');
            const cancelBtn = document.getElementById('input-modal-cancel');

            title.innerText = 'Название стратегии';
            field.value = defaultName || 'Моя стратегия';
            modal.style.display = 'flex';

            const cleanup = () => { modal.style.display = 'none'; };
            okBtn.onclick = () => { cleanup(); resolve(field.value.trim() || defaultName); };
            cancelBtn.onclick = () => { cleanup(); resolve(null); };
        });
    }

    async save() {
        this.saveCurrentToStrategy();
        this.validateStrategy();
        this.saveCurrentToStrategy();

        if (this.opponentStrategy) {
            const name = await this.promptForName('Стратегия противника');
            if (name) {
                this.opponentStrategy.name = name;
                saveStrategy(this.opponentStrategy);
                window.showMessage('Стратегия противника сохранена!');
            }
        }
        if (this.myStrategy) {
            const name = await this.promptForName('Моя стратегия');
            if (name) {
                this.myStrategy.name = name;
                saveStrategy(this.myStrategy);
                window.showMessage('Моя стратегия сохранена!');
            }
        }
        this.originalOpponent = this.opponentStrategy ? this.opponentStrategy.clone() : null;
        this.originalMy = this.myStrategy ? this.myStrategy.clone() : null;
    }

    async loadPreset() {
        const names = presetStrategies.map(s => s.name);
        const modal = document.getElementById('input-modal');
        const title = document.getElementById('input-modal-title');
        const field = document.getElementById('input-modal-field');
        const okBtn = document.getElementById('input-modal-ok');
        const cancelBtn = document.getElementById('input-modal-cancel');

        title.innerText = 'Введите имя встроенной стратегии:\n' + names.join('\n');
        field.value = '';
        modal.style.display = 'flex';

        return new Promise((resolve) => {
            okBtn.onclick = () => {
                modal.style.display = 'none';
                const choice = field.value.trim();
                const preset = presetStrategies.find(s => s.name === choice);
                if (preset) {
                    const clone = preset.clone();
                    if (this.currentMode === 'opponent') this.opponentStrategy = clone;
                    else this.myStrategy = clone;
                    this.loadStrategyToEditor(clone);
                }
                resolve();
            };
            cancelBtn.onclick = () => {
                modal.style.display = 'none';
                resolve();
            };
        });
    }

    getOpponentStrategy() {
        this.saveCurrentToStrategy();
        return this.opponentStrategy;
    }

    getMyStrategy() {
        this.saveCurrentToStrategy();
        return this.myStrategy;
    }
}