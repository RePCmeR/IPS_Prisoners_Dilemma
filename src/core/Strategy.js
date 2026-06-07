// Конечный автомат стратегии: набор состояний (узлов) и переходов (рёбер)
export class Strategy {
    constructor(name, nodes = [], edges = [], startNodeId = null) {
        this.name = name;
        this.nodes = nodes;   // { id, action: 'C'|'D', x?, y? }
        this.edges = edges;   // { source, target, playerAction, probability? }
        this.startNodeId = startNodeId;
    }

    // Возвращает действие (C или D) заданного узла
    getAction(nodeId) {
        const node = this.nodes.find(vertex => vertex.id === nodeId);
        return node ? node.action : 'C';   // по умолчанию сотрудничаем
    }

    // Определяет следующее состояние в зависимости от действия игрока
    // useRandom = true включает вероятностный выбор
    getNextState(currentNodeId, playerAction, useRandom = false) {
        const candidates = this.edges.filter(
            e => e.source === currentNodeId && e.playerAction === playerAction
        );
        if (candidates.length === 0) return currentNodeId; // нет подходящих переходов – остаёмся на месте

        if (candidates.length === 1) return candidates[0].target;

        // Если есть вероятностные переходы и включён случайный режим
        if (useRandom && candidates.some(e => e.probability !== undefined)) {
            const totalProb = candidates.reduce((sum, e) => sum + (e.probability || 0), 0);
            if (totalProb === 0) return candidates[0].target;
            let r = Math.random() * totalProb;
            for (const e of candidates) {
                r -= (e.probability || 0);
                if (r <= 0) return e.target;
            }
            return candidates[candidates.length - 1].target;
        }

        // Без случайности возвращаем первый переход
        return candidates[0].target;
    }

    toJSON() {
        return {
            name: this.name,
            nodes: this.nodes,
            edges: this.edges,
            startNodeId: this.startNodeId
        };
    }

    static fromJSON(json) {
        return new Strategy(json.name, json.nodes, json.edges, json.startNodeId);
    }

    clone(newName) {
        return new Strategy(
            newName || this.name + ' (копия)',
            JSON.parse(JSON.stringify(this.nodes)),
            JSON.parse(JSON.stringify(this.edges)),
            this.startNodeId
        );
    }
}