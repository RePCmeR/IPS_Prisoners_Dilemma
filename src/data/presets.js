import { Strategy } from '../core/Strategy.js';

// Вспомогательная функция для петель
const loop = (nodeId, action) => ({ source: nodeId, target: nodeId, playerAction: action });

export const presetStrategies = [
    // 1
    new Strategy('Всегда сотрудничать',
        [{ id: 'n0', action: 'C', x: 200, y: 200 }],
        [loop('n0', 'C'), loop('n0', 'D')],
        'n0'
    ),
    // 2
    new Strategy('Всегда предавать',
        [{ id: 'n0', action: 'D', x: 200, y: 200 }],
        [loop('n0', 'C'), loop('n0', 'D')],
        'n0'
    ),
    // 3
    new Strategy('Око за око',
        [
            { id: 'n0', action: 'C', x: 150, y: 100 },
            { id: 'n1', action: 'D', x: 350, y: 100 }
        ],
        [
            { source: 'n0', target: 'n0', playerAction: 'C' },
            { source: 'n0', target: 'n1', playerAction: 'D' },
            { source: 'n1', target: 'n0', playerAction: 'C' },
            { source: 'n1', target: 'n1', playerAction: 'D' }
        ],
        'n0'
    ),
    // 4. Око за два ока (Tit-for-2-Tats)
    new Strategy('Око за два ока',
        [
            { id: 'a0', action: 'C', x: 100, y: 100 },
            { id: 'a1', action: 'C', x: 250, y: 100 },
            { id: 'a2', action: 'D', x: 400, y: 100 }
        ],
        [
            { source: 'a0', target: 'a0', playerAction: 'C' },
            { source: 'a0', target: 'a1', playerAction: 'D' },
            { source: 'a1', target: 'a0', playerAction: 'C' },
            { source: 'a1', target: 'a2', playerAction: 'D' },
            { source: 'a2', target: 'a0', playerAction: 'C' },
            { source: 'a2', target: 'a2', playerAction: 'D' }
        ],
        'a0'
    ),
    // 5. Подозрительный Tit-for-Tat
    new Strategy('Подозрительный Tit-for-Tat',
        [
            { id: 'g', action: 'C', x: 150, y: 100 },
            { id: 'b', action: 'D', x: 350, y: 100 }
        ],
        [
            { source: 'g', target: 'g', playerAction: 'C' },
            { source: 'g', target: 'b', playerAction: 'D' },
            { source: 'b', target: 'g', playerAction: 'C' },
            { source: 'b', target: 'b', playerAction: 'D' }
        ],
        'b'
    ),
    // 6. Злопамятный (Grudger)
    new Strategy('Злопамятный',
        [
            { id: 'c0', action: 'C', x: 150, y: 100 },
            { id: 'c1', action: 'D', x: 350, y: 100 }
        ],
        [
            { source: 'c0', target: 'c0', playerAction: 'C' },
            { source: 'c0', target: 'c1', playerAction: 'D' },
            { source: 'c1', target: 'c1', playerAction: 'C' },
            { source: 'c1', target: 'c1', playerAction: 'D' }
        ],
        'c0'
    ),
    // 7. Pavlov (Win-Stay, Lose-Shift)
    new Strategy('Pavlov',
        [
            { id: 'pC', action: 'C', x: 150, y: 100 },
            { id: 'pD', action: 'D', x: 350, y: 100 }
        ],
        [
            { source: 'pC', target: 'pC', playerAction: 'C' },
            { source: 'pC', target: 'pD', playerAction: 'D' },
            { source: 'pD', target: 'pC', playerAction: 'C' },
            { source: 'pD', target: 'pD', playerAction: 'D' }
        ],
        'pC'
    ),
    // 8. Hard Tit-for-Tat
    new Strategy('Hard Tit-for-Tat',
        [
            { id: 'hCC', action: 'C', x: 100, y: 100 },
            { id: 'hCD', action: 'D', x: 250, y: 100 },
            { id: 'hDC', action: 'C', x: 400, y: 100 },
            { id: 'hDD', action: 'D', x: 550, y: 100 }
        ],
        [
            { source: 'hCC', target: 'hCC', playerAction: 'C' },
            { source: 'hCC', target: 'hCD', playerAction: 'D' },
            { source: 'hCD', target: 'hDC', playerAction: 'C' },
            { source: 'hCD', target: 'hDD', playerAction: 'D' },
            { source: 'hDC', target: 'hCC', playerAction: 'C' },
            { source: 'hDC', target: 'hCD', playerAction: 'D' },
            { source: 'hDD', target: 'hDC', playerAction: 'C' },
            { source: 'hDD', target: 'hDD', playerAction: 'D' }
        ],
        'hCC'
    ),
    // 9. Forgiving Tit-for-Tat (прощает с вероятностью 30%)
    new Strategy('Forgiving Tit-for-Tat',
        [
            { id: 'fG', action: 'C', x: 150, y: 100 },
            { id: 'fB', action: 'D', x: 350, y: 100 }
        ],
        [
            { source: 'fG', target: 'fG', playerAction: 'C' },
            { source: 'fG', target: 'fB', playerAction: 'D' },
            { source: 'fB', target: 'fG', playerAction: 'C', probability: 0.3 },
            { source: 'fB', target: 'fB', playerAction: 'C', probability: 0.7 },
            { source: 'fB', target: 'fB', playerAction: 'D' }
        ],
        'fG'
    ),
    // 10. Generous Tit-for-Tat (прощает 50% предательств)
    new Strategy('Generous Tit-for-Tat',
        [
            { id: 'geG', action: 'C', x: 150, y: 100 },
            { id: 'geB', action: 'D', x: 350, y: 100 }
        ],
        [
            { source: 'geG', target: 'geG', playerAction: 'C' },
            { source: 'geG', target: 'geB', playerAction: 'D' },
            { source: 'geB', target: 'geG', playerAction: 'C', probability: 0.5 },
            { source: 'geB', target: 'geB', playerAction: 'C', probability: 0.5 },
            { source: 'geB', target: 'geB', playerAction: 'D' }
        ],
        'geG'
    ),
    // 11. Random (50/50)
    new Strategy('Random 50/50',
        [{ id: 'r0', action: 'C', x: 200, y: 200 }],
        [
            { source: 'r0', target: 'r0', playerAction: 'C', probability: 0.5 },
            { source: 'r0', target: 'r0', playerAction: 'C', probability: 0.5 },
            { source: 'r0', target: 'r0', playerAction: 'D', probability: 0.5 },
            { source: 'r0', target: 'r0', playerAction: 'D', probability: 0.5 }
        ],
        'r0'
    ),
    // 12. Firm but Fair
    new Strategy('Firm but Fair',
        [
            { id: 'f0', action: 'C', x: 100, y: 100 },
            { id: 'f1', action: 'C', x: 200, y: 100 },
            { id: 'f2', action: 'D', x: 300, y: 100 }
        ],
        [
            { source: 'f0', target: 'f0', playerAction: 'C' },
            { source: 'f0', target: 'f1', playerAction: 'D' },
            { source: 'f1', target: 'f0', playerAction: 'C' },
            { source: 'f1', target: 'f2', playerAction: 'D' },
            { source: 'f2', target: 'f0', playerAction: 'C' },
            { source: 'f2', target: 'f2', playerAction: 'D' }
        ],
        'f0'
    ),
    // 13. Bully
    new Strategy('Bully',
        [{ id: 'bully', action: 'D', x: 200, y: 200 }],
        [loop('bully', 'C'), loop('bully', 'D')],
        'bully'
    ),
    // 14. Anti-Grudger
    new Strategy('Anti-Grudger',
        [
            { id: 'ag0', action: 'C', x: 100, y: 100 },
            { id: 'ag1', action: 'D', x: 300, y: 100 }
        ],
        [
            { source: 'ag0', target: 'ag0', playerAction: 'C' },
            { source: 'ag0', target: 'ag1', playerAction: 'D' },
            { source: 'ag1', target: 'ag0', playerAction: 'C', probability: 0.8 },
            { source: 'ag1', target: 'ag1', playerAction: 'C', probability: 0.2 },
            { source: 'ag1', target: 'ag0', playerAction: 'D', probability: 0.2 },
            { source: 'ag1', target: 'ag1', playerAction: 'D', probability: 0.8 }
        ],
        'ag0'
    ),
    // 15. Prober
    new Strategy('Prober',
        [
            { id: 'pr0', action: 'D', x: 50, y: 100 },
            { id: 'pr1', action: 'C', x: 150, y: 100 },
            { id: 'pr2', action: 'C', x: 250, y: 100 },
            { id: 'prG', action: 'C', x: 350, y: 100 },
            { id: 'prB', action: 'D', x: 450, y: 100 }
        ],
        [
            { source: 'pr0', target: 'pr1', playerAction: 'C' },
            { source: 'pr0', target: 'pr1', playerAction: 'D' },
            { source: 'pr1', target: 'pr2', playerAction: 'C' },
            { source: 'pr1', target: 'pr2', playerAction: 'D' },
            { source: 'pr2', target: 'prG', playerAction: 'C' },
            { source: 'pr2', target: 'prB', playerAction: 'D' },
            { source: 'prG', target: 'prG', playerAction: 'C' },
            { source: 'prG', target: 'prB', playerAction: 'D' },
            { source: 'prB', target: 'prG', playerAction: 'C' },
            { source: 'prB', target: 'prB', playerAction: 'D' }
        ],
        'pr0'
    ),
    // 16. Gradual
    new Strategy('Gradual',
        [
            { id: 'gr0', action: 'C', x: 100, y: 100 },
            { id: 'gr1', action: 'D', x: 200, y: 100 },
            { id: 'gr2', action: 'C', x: 300, y: 100 },
            { id: 'gr3', action: 'C', x: 400, y: 100 }
        ],
        [
            { source: 'gr0', target: 'gr0', playerAction: 'C' },
            { source: 'gr0', target: 'gr1', playerAction: 'D' },
            { source: 'gr1', target: 'gr2', playerAction: 'C' },
            { source: 'gr1', target: 'gr1', playerAction: 'D' },
            { source: 'gr2', target: 'gr3', playerAction: 'C' },
            { source: 'gr2', target: 'gr1', playerAction: 'D' },
            { source: 'gr3', target: 'gr0', playerAction: 'C' },
            { source: 'gr3', target: 'gr1', playerAction: 'D' }
        ],
        'gr0'
    ),
    // 17. Stalker
    new Strategy('Stalker',
        [
            { id: 'sA', action: 'C', x: 100, y: 100 },
            { id: 'sB', action: 'C', x: 200, y: 100 },
            { id: 'sC', action: 'D', x: 300, y: 100 },
            { id: 'sD', action: 'D', x: 400, y: 100 }
        ],
        [
            { source: 'sA', target: 'sB', playerAction: 'C' },
            { source: 'sA', target: 'sD', playerAction: 'D' },
            { source: 'sB', target: 'sA', playerAction: 'C' },
            { source: 'sB', target: 'sC', playerAction: 'D' },
            { source: 'sC', target: 'sD', playerAction: 'C' },
            { source: 'sC', target: 'sB', playerAction: 'D' },
            { source: 'sD', target: 'sC', playerAction: 'C' },
            { source: 'sD', target: 'sA', playerAction: 'D' }
        ],
        'sA'
    ),
    // 18. Two Tits for Tat
    new Strategy('Two Tits for Tat',
        [
            { id: 'tt0', action: 'C', x: 100, y: 100 },
            { id: 'tt1', action: 'D', x: 250, y: 100 },
            { id: 'tt2', action: 'D', x: 400, y: 100 }
        ],
        [
            { source: 'tt0', target: 'tt0', playerAction: 'C' },
            { source: 'tt0', target: 'tt1', playerAction: 'D' },
            { source: 'tt1', target: 'tt2', playerAction: 'C' },
            { source: 'tt1', target: 'tt1', playerAction: 'D' },
            { source: 'tt2', target: 'tt0', playerAction: 'C' },
            { source: 'tt2', target: 'tt1', playerAction: 'D' }
        ],
        'tt0'
    ),
    // 19. Adaptive
    new Strategy('Adaptive',
        [
            { id: 'adC', action: 'C', x: 100, y: 100 },
            { id: 'adD', action: 'D', x: 250, y: 100 }
        ],
        [
            { source: 'adC', target: 'adC', playerAction: 'C' },
            { source: 'adC', target: 'adD', playerAction: 'D' },
            { source: 'adD', target: 'adC', playerAction: 'C' },
            { source: 'adD', target: 'adD', playerAction: 'D' }
        ],
        'adC'
    )
];

export const presetLevels = [
    { name: 'Уровень 1: Доверчивый', description: 'Противник всегда сотрудничает.', opponentStrategy: presetStrategies[0], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 10 },
    { name: 'Уровень 2: Предатель', description: 'Противник всегда предаёт.', opponentStrategy: presetStrategies[1], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 10 },
    { name: 'Уровень 3: Зеркало', description: 'Око за око.', opponentStrategy: presetStrategies[2], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 10 },
    { name: 'Уровень 4: Око за два ока', description: 'Прощает после двух предательств.', opponentStrategy: presetStrategies[3], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 12 },
    { name: 'Уровень 5: Подозрительный', description: 'Начинает с предательства.', opponentStrategy: presetStrategies[4], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 12 },
    { name: 'Уровень 6: Злопамятный', description: 'Мстит навсегда.', opponentStrategy: presetStrategies[5], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 7: Pavlov', description: 'Меняет тактику при проигрыше.', opponentStrategy: presetStrategies[6], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 20 },
    { name: 'Уровень 8: Hard TFT', description: 'Требует два C для возврата.', opponentStrategy: presetStrategies[7], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 9: Прощающий TFT', description: 'Прощает 30% предательств.', opponentStrategy: presetStrategies[8], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 10: Щедрый TFT', description: 'Прощает половину предательств.', opponentStrategy: presetStrategies[9], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 11: Случайный', description: 'Действует случайно (50/50).', opponentStrategy: presetStrategies[10], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 10 },
    { name: 'Уровень 12: Firm but Fair', description: 'Жёсткая, но справедливая.', opponentStrategy: presetStrategies[11], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 12 },
    { name: 'Уровень 13: Bully', description: 'Всегда предаёт.', opponentStrategy: presetStrategies[12], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 10 },
    { name: 'Уровень 14: Anti-Grudger', description: 'Мстит, но быстро прощает.', opponentStrategy: presetStrategies[13], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 15: Prober', description: 'Проверяет соперника.', opponentStrategy: presetStrategies[14], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 10 },
    { name: 'Уровень 16: Gradual', description: 'Постепенное наказание.', opponentStrategy: presetStrategies[15], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 17: Stalker', description: 'Хитрая стратегия.', opponentStrategy: presetStrategies[16], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 18: Two Tits for Tat', description: 'Дважды мстит за предательство.', opponentStrategy: presetStrategies[17], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 12 },
    { name: 'Уровень 19: Adaptive', description: 'Адаптируется к сопернику.', opponentStrategy: presetStrategies[18], payoff: { 'C,C': [3,3], 'C,D': [0,5], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 }
];