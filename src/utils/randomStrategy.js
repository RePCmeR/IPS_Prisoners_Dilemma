import { Strategy } from '../core/Strategy.js';

export function generateRandomStrategy(name, nodeCount = 5, randomTransitions = false) {
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
    for (let i = 0; i < nodeCount; i++) {
        const source = `n${i}`;
        for (const action of ['C', 'D']) {
            const targetIdx = Math.floor(Math.random() * nodeCount);
            const edge = { source, target: `n${targetIdx}`, playerAction: action };
            if (randomTransitions && Math.random() < 0.4) {
                const altIdx = Math.floor(Math.random() * nodeCount);
                edges.push({ ...edge, probability: 0.4 });
                edges.push({ source, target: `n${altIdx}`, playerAction: action, probability: 0.6 });
            } else {
                edges.push(edge);
            }
        }
    }
    return new Strategy(name, nodes, edges, 'n0');
}

export function generateRandomPayoff() {
    // DC > CC > DD > CD
    const baseCC = 3 + Math.floor(Math.random() * 4);   // 3..6
    const baseCD = 0 + Math.floor(Math.random() * 2);   // 0..1
    const baseDC = 5 + Math.floor(Math.random() * 4);   // 5..8
    const baseDD = 1 + Math.floor(Math.random() * 3);   // 1..3

    return {
        'C,C': [baseCC, baseCC],
        'C,D': [baseCD, baseDC],
        'D,C': [baseDC, baseCD],
        'D,D': [baseDD, baseDD]
    };
}