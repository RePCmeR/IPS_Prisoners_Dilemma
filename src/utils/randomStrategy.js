import { Strategy } from '../core/Strategy.js';

// Генерирует случайную стратегию с заданным числом узлов.
// randomTransitions = true добавляет вероятностные рёбра.
export function generateRandomStrategy(name, nodeCount = 5, randomTransitions = false, probabilityRatio = 0.25) {
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            id: `n${i}`,
            action: Math.random() < 0.5 ? 'C' : 'D',
            x: Math.random() * 400 + 50,
            y: Math.random() * 300 + 50
        });
    }

    const edges = [];
    let probabilisticEdgesCount = 0;
    const maxProbabilisticEdges = Math.floor(nodeCount * 2 * probabilityRatio);

    // Вспомогательная функция добавления ребра (обычного или вероятностного)
    const addEdge = (source, target, action) => {
        if (randomTransitions && probabilisticEdgesCount < maxProbabilisticEdges && Math.random() < 0.5) {
            const prob = Math.random() * 0.6 + 0.2;   // от 0.2 до 0.8
            edges.push({ source, target, playerAction: action, probability: prob });
            const altTarget = `n${Math.floor(Math.random() * nodeCount)}`;
            edges.push({ source, target: altTarget, playerAction: action, probability: 1.0 - prob });
            probabilisticEdgesCount++;
        } else {
            edges.push({ source, target, playerAction: action });
        }
    };

    // Строим остовное дерево, чтобы граф был связным
    const visited = new Set(['n0']);
    const queue = ['n0'];
    while (queue.length > 0 && visited.size < nodeCount) {
        const current = queue.shift();
        for (const node of nodes) {
            if (!visited.has(node.id)) {
                const action = Math.random() < 0.5 ? 'C' : 'D';
                addEdge(current, node.id, action);
                visited.add(node.id);
                queue.push(node.id);
                break;
            }
        }
    }

    // Добавляем недостающие переходы для каждого действия
    for (const node of nodes) {
        for (const action of ['C', 'D']) {
            const existing = edges.filter(e => e.source === node.id && e.playerAction === action);
            if (existing.length === 0) {
                const targetIdx = Math.floor(Math.random() * nodeCount);
                addEdge(node.id, `n${targetIdx}`, action);
            }
        }
    }

    return new Strategy(name, nodes, edges, 'n0');
}

// Генерирует случайную «жёсткую» матрицу выигрышей
export function generateRandomPayoff() {
    const baseCC = 2 + Math.floor(Math.random() * 2);   // 2–3
    const baseDC = 3 + Math.floor(Math.random() * 3);   // 3–5
    return {
        'C,C': [baseCC, baseCC],
        'C,D': [0, 6 + Math.floor(Math.random() * 3)],   // противник получает 6–8
        'D,C': [baseDC, 0],
        'D,D': [1, 1]
    };
}