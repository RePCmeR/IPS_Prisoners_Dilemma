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

        this.initCytoscape();
        this.initDragAndDrop();
        this.initEdgeCreation();
        this.initDeletion();
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
            userPanning: true,
            autoungrabify: false,
            autolock: false
        });

        this.container.style.outline = 'none';

        this.container.addEventListener('click', () => {
            this.container.focus();
        });
    }

    initDeletion() {
        this.container.addEventListener('keydown', (event) => {
            if (event.key === 'Delete' || event.key === 'Backspace') {
                event.preventDefault();
                const selected = this.cy.elements(':selected');
                if (selected.length > 0) {
                    selected.remove();
                }
            }
        });

        this.container.setAttribute('tabindex', '0');
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

    initEdgeCreation() {
        let sourceNode = null;
        this.cy.on('tap', 'node', evt => {
            const node = evt.target;
            if (!sourceNode) {
                sourceNode = node;
                node.addClass('selected');
                return;
            }
            if (sourceNode === node) {
                const action = prompt('Действие для петли (C или D)?')?.toUpperCase();
                if (!['C', 'D'].includes(action)) {
                    sourceNode.removeClass('selected');
                    sourceNode = null;
                    return;
                }
                const probStr = prompt('Вероятность (1 = всегда):');
                let prob = parseFloat(probStr) || 1;
                this.cy.add({
                    group: 'edges',
                    data: {
                        source: sourceNode.id(),
                        target: sourceNode.id(),
                        playerAction: action,
                        probability: prob < 1 ? prob : undefined
                    },
                    classes: action === 'C' ? 'playerC' : 'playerD'
                });
                sourceNode.removeClass('selected');
                sourceNode = null;
                return;
            }
            const action = prompt('Действие игрока для перехода (C или D)?')?.toUpperCase();
            if (!['C', 'D'].includes(action)) {
                sourceNode.removeClass('selected');
                sourceNode = null;
                return;
            }
            const probStr = prompt('Вероятность (1 = всегда, 0-1 для стохастического):');
            let prob = parseFloat(probStr) || 1;
            this.cy.add({
                group: 'edges',
                data: {
                    source: sourceNode.id(),
                    target: node.id(),
                    playerAction: action,
                    probability: prob < 1 ? prob : undefined
                },
                classes: action === 'C' ? 'playerC' : 'playerD'
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
        if (modified) alert('В некоторых вершинах не было переходов для C или D. Автоматически добавлены петли.');
    }

    save() {
        this.saveCurrentToStrategy();
        this.validateStrategy();
        this.saveCurrentToStrategy();
        if (this.opponentStrategy) {
            this.opponentStrategy.name = prompt('Название стратегии противника:', 'Моя стратегия') || 'Безымянная';
            saveStrategy(this.opponentStrategy);
        }
        if (this.myStrategy) {
            this.myStrategy.name = prompt('Название моей стратегии:', 'Моя стратегия') || 'Безымянная';
            saveStrategy(this.myStrategy);
        }
        alert('Стратегии сохранены.');
    }

    loadPreset() {
        const names = presetStrategies.map(s => s.name);
        const choice = prompt('Встроенные стратегии:\n' + names.join('\n') + '\nВведите имя:');
        const preset = presetStrategies.find(s => s.name === choice);
        if (preset) {
            const clone = preset.clone();
            if (this.currentMode === 'opponent') this.opponentStrategy = clone;
            else this.myStrategy = clone;
            this.loadStrategyToEditor(clone);
        }
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