import { Strategy } from '../core/Strategy.js';

const loop = (nodeId, action) => ({ source: nodeId, target: nodeId, playerAction: action });

export const presetStrategies = [
    // 1
    new Strategy('Всегда сотрудничать',
        [{ id: 'n0', action: 'C', x: 300, y: 250 }],
        [loop('n0', 'C'), loop('n0', 'D')],
        'n0'
    ),
    // 2
    new Strategy('Всегда предавать',
        [{ id: 'n0', action: 'D', x: 300, y: 250 }],
        [loop('n0', 'C'), loop('n0', 'D')],
        'n0'
    ),
    // 3
    new Strategy('Око за око',
        [
            { id: 'n0', action: 'C', x: 200, y: 150 },
            { id: 'n1', action: 'D', x: 400, y: 350 }
        ],
        [
            { source: 'n0', target: 'n0', playerAction: 'C' },
            { source: 'n0', target: 'n1', playerAction: 'D' },
            { source: 'n1', target: 'n0', playerAction: 'C' },
            { source: 'n1', target: 'n1', playerAction: 'D' }
        ],
        'n0'
    ),
    // 4
    new Strategy('Око за два ока',
        [
            { id: 'a0', action: 'C', x: 150, y: 150 },
            { id: 'a1', action: 'C', x: 300, y: 150 },
            { id: 'a2', action: 'D', x: 450, y: 400 }
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
    // 5
    new Strategy('Подозрительное Око за око',
        [
            { id: 'g', action: 'C', x: 200, y: 150 },
            { id: 'b', action: 'D', x: 400, y: 350 }
        ],
        [
            { source: 'g', target: 'g', playerAction: 'C' },
            { source: 'g', target: 'b', playerAction: 'D' },
            { source: 'b', target: 'g', playerAction: 'C' },
            { source: 'b', target: 'b', playerAction: 'D' }
        ],
        'b'
    ),
    // 6
    new Strategy('Злопамятный',
        [
            { id: 'c0', action: 'C', x: 200, y: 150 },
            { id: 'c1', action: 'D', x: 400, y: 350 }
        ],
        [
            { source: 'c0', target: 'c0', playerAction: 'C' },
            { source: 'c0', target: 'c1', playerAction: 'D' },
            { source: 'c1', target: 'c1', playerAction: 'C' },
            { source: 'c1', target: 'c1', playerAction: 'D' }
        ],
        'c0'
    ),
    // 7
    new Strategy('Павлов',
        [
            { id: 'pC', action: 'C', x: 200, y: 150 },
            { id: 'pD', action: 'D', x: 400, y: 350 }
        ],
        [
            { source: 'pC', target: 'pC', playerAction: 'C' },
            { source: 'pC', target: 'pD', playerAction: 'D' },
            { source: 'pD', target: 'pC', playerAction: 'C' },
            { source: 'pD', target: 'pD', playerAction: 'D' }
        ],
        'pC'
    ),
    // 8
    new Strategy('Суровое Око за око',
        [
            { id: 'hCC', action: 'C', x: 120, y: 120 },
            { id: 'hCD', action: 'D', x: 300, y: 120 },
            { id: 'hDC', action: 'C', x: 200, y: 300 },
            { id: 'hDD', action: 'D', x: 480, y: 400 }
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
    // 9
    new Strategy('Прощающее Око за око',
        [
            { id: 'fG', action: 'C', x: 200, y: 150 },
            { id: 'fB', action: 'D', x: 400, y: 350 }
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
    // 10
    new Strategy('Щедрое Око за око',
        [
            { id: 'geG', action: 'C', x: 200, y: 150 },
            { id: 'geB', action: 'D', x: 400, y: 350 }
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
    // 11
    new Strategy('Случайный 50/50',
        [{ id: 'r0', action: 'C', x: 300, y: 250 }],
        [
            { source: 'r0', target: 'r0', playerAction: 'C', probability: 0.5 },
            { source: 'r0', target: 'r0', playerAction: 'C', probability: 0.5 },
            { source: 'r0', target: 'r0', playerAction: 'D', probability: 0.5 },
            { source: 'r0', target: 'r0', playerAction: 'D', probability: 0.5 }
        ],
        'r0'
    ),
    // 12
    new Strategy('Строгий, но справедливый',
        [
            { id: 'f0', action: 'C', x: 150, y: 150 },
            { id: 'f1', action: 'C', x: 300, y: 150 },
            { id: 'f2', action: 'D', x: 450, y: 400 }
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
    // 13
    new Strategy('Хулиган',
        [{ id: 'bully', action: 'D', x: 300, y: 250 }],
        [loop('bully', 'C'), loop('bully', 'D')],
        'bully'
    ),
    // 14
    new Strategy('Анти-Злопамятный',
        [
            { id: 'ag0', action: 'C', x: 200, y: 150 },
            { id: 'ag1', action: 'D', x: 400, y: 350 }
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
    // 15
    new Strategy('Проверяющий',
        [
            { id: 'pr0', action: 'D', x: 80, y: 150 },
            { id: 'pr1', action: 'C', x: 200, y: 150 },
            { id: 'pr2', action: 'C', x: 320, y: 150 },
            { id: 'prG', action: 'C', x: 200, y: 350 },
            { id: 'prB', action: 'D', x: 440, y: 350 }
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
    // 16
    new Strategy('Постепенный',
        [
            { id: 'gr0', action: 'C', x: 100, y: 100 },
            { id: 'gr1', action: 'D', x: 250, y: 100 },
            { id: 'gr2', action: 'C', x: 400, y: 100 },
            { id: 'gr3', action: 'C', x: 550, y: 400 }
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
    // 17
    new Strategy('Сталкер',
        [
            { id: 'sA', action: 'C', x: 100, y: 100 },
            { id: 'sB', action: 'C', x: 300, y: 100 },
            { id: 'sC', action: 'D', x: 200, y: 300 },
            { id: 'sD', action: 'D', x: 500, y: 400 }
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
    // 18
    new Strategy('Двойное Око за око',
        [
            { id: 'tt0', action: 'C', x: 150, y: 150 },
            { id: 'tt1', action: 'D', x: 300, y: 150 },
            { id: 'tt2', action: 'D', x: 450, y: 400 }
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
    // 19
    new Strategy('Адаптивный',
        [
            { id: 'adC', action: 'C', x: 200, y: 150 },
            { id: 'adD', action: 'D', x: 400, y: 350 }
        ],
        [
            { source: 'adC', target: 'adC', playerAction: 'C' },
            { source: 'adC', target: 'adD', playerAction: 'D' },
            { source: 'adD', target: 'adC', playerAction: 'C' },
            { source: 'adD', target: 'adD', playerAction: 'D' }
        ],
        'adC'
    ),
    // 20
    new Strategy('Мягкий Злопамятный',
        [
            { id: 'sg0', action: 'C', x: 200, y: 150 },
            { id: 'sg1', action: 'D', x: 400, y: 350 }
        ],
        [
            { source: 'sg0', target: 'sg0', playerAction: 'C' },
            { source: 'sg0', target: 'sg1', playerAction: 'D' },
            { source: 'sg1', target: 'sg0', playerAction: 'C', probability: 0.1 },
            { source: 'sg1', target: 'sg1', playerAction: 'C', probability: 0.9 },
            { source: 'sg1', target: 'sg1', playerAction: 'D' }
        ],
        'sg0'
    ),
    // 21
    new Strategy('Око за три ока',
        [
            { id: 't3t0', action: 'C', x: 100, y: 100 },
            { id: 't3t1', action: 'C', x: 250, y: 100 },
            { id: 't3t2', action: 'C', x: 400, y: 100 },
            { id: 't3t3', action: 'D', x: 550, y: 400 }
        ],
        [
            { source: 't3t0', target: 't3t0', playerAction: 'C' },
            { source: 't3t0', target: 't3t1', playerAction: 'D' },
            { source: 't3t1', target: 't3t0', playerAction: 'C' },
            { source: 't3t1', target: 't3t2', playerAction: 'D' },
            { source: 't3t2', target: 't3t0', playerAction: 'C' },
            { source: 't3t2', target: 't3t3', playerAction: 'D' },
            { source: 't3t3', target: 't3t0', playerAction: 'C' },
            { source: 't3t3', target: 't3t3', playerAction: 'D' }
        ],
        't3t0'
    ),
    // 22
    new Strategy('Ворчливый',
        [
            { id: 'grp0', action: 'C', x: 200, y: 150 },
            { id: 'grp1', action: 'D', x: 400, y: 350 }
        ],
        [
            { source: 'grp0', target: 'grp0', playerAction: 'C' },
            { source: 'grp0', target: 'grp1', playerAction: 'D' },
            { source: 'grp1', target: 'grp0', playerAction: 'C', probability: 0.05 },
            { source: 'grp1', target: 'grp1', playerAction: 'C', probability: 0.95 },
            { source: 'grp1', target: 'grp1', playerAction: 'D' }
        ],
        'grp0'
    ),
    // 23
    new Strategy('Наивный Проверяющий',
        [
            { id: 'np0', action: 'C', x: 100, y: 150 },
            { id: 'np1', action: 'D', x: 250, y: 150 },
            { id: 'np2', action: 'C', x: 400, y: 400 }
        ],
        [
            { source: 'np0', target: 'np0', playerAction: 'C' },
            { source: 'np0', target: 'np1', playerAction: 'D' },
            { source: 'np1', target: 'np1', playerAction: 'C' },
            { source: 'np1', target: 'np2', playerAction: 'D' },
            { source: 'np2', target: 'np2', playerAction: 'C' },
            { source: 'np2', target: 'np2', playerAction: 'D' }
        ],
        'np0'
    ),
    // 24
    new Strategy('Расчётливый',
        [
            { id: 'calc0', action: 'C', x: 120, y: 120 },
            { id: 'calc1', action: 'C', x: 280, y: 120 },
            { id: 'calc2', action: 'D', x: 200, y: 300 },
            { id: 'calc3', action: 'D', x: 440, y: 400 }
        ],
        [
            { source: 'calc0', target: 'calc0', playerAction: 'C' },
            { source: 'calc0', target: 'calc1', playerAction: 'D' },
            { source: 'calc1', target: 'calc0', playerAction: 'C' },
            { source: 'calc1', target: 'calc2', playerAction: 'D' },
            { source: 'calc2', target: 'calc3', playerAction: 'C' },
            { source: 'calc2', target: 'calc2', playerAction: 'D' },
            { source: 'calc3', target: 'calc3', playerAction: 'C' },
            { source: 'calc3', target: 'calc2', playerAction: 'D' }
        ],
        'calc0'
    ),
    // 25
    new Strategy('Обманчивый',
        [
            { id: 'dec0', action: 'C', x: 120, y: 120 },
            { id: 'dec1', action: 'D', x: 280, y: 120 },
            { id: 'dec2', action: 'C', x: 200, y: 300 },
            { id: 'dec3', action: 'D', x: 440, y: 400 }
        ],
        [
            { source: 'dec0', target: 'dec0', playerAction: 'C' },
            { source: 'dec0', target: 'dec1', playerAction: 'D' },
            { source: 'dec1', target: 'dec2', playerAction: 'C' },
            { source: 'dec1', target: 'dec1', playerAction: 'D' },
            { source: 'dec2', target: 'dec3', playerAction: 'C' },
            { source: 'dec2', target: 'dec1', playerAction: 'D' },
            { source: 'dec3', target: 'dec2', playerAction: 'C' },
            { source: 'dec3', target: 'dec3', playerAction: 'D' }
        ],
        'dec0'
    )
];

export const presetLevels = [
    { name: 'Уровень 1: Всегда сотрудничать', description: 'Противник всегда сотрудничает.', opponentStrategy: presetStrategies[0], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 10 },
    { name: 'Уровень 2: Всегда предавать', description: 'Противник всегда предаёт.', opponentStrategy: presetStrategies[1], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 10 },
    { name: 'Уровень 3: Око за око', description: 'Классическая взаимная стратегия.', opponentStrategy: presetStrategies[2], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 10 },
    { name: 'Уровень 4: Око за два ока', description: 'Прощает после двух предательств.', opponentStrategy: presetStrategies[3], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 12 },
    { name: 'Уровень 5: Подозрительное Око за око', description: 'Начинает с предательства.', opponentStrategy: presetStrategies[4], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 12 },
    { name: 'Уровень 6: Злопамятный', description: 'Никогда не прощает ни одного предательства.', opponentStrategy: presetStrategies[5], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 7: Павлов', description: 'Побеждаешь – остаёшься, проигрываешь – меняешь.', opponentStrategy: presetStrategies[6], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 20 },
    { name: 'Уровень 8: Суровое Око за око', description: 'Требует два сотрудничества для возврата.', opponentStrategy: presetStrategies[7], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 9: Прощающее Око за око', description: 'Прощает 30% предательств.', opponentStrategy: presetStrategies[8], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 10: Щедрое Око за око', description: 'Прощает половину предательств.', opponentStrategy: presetStrategies[9], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 11: Случайный', description: 'Действует случайным образом (50/50).', opponentStrategy: presetStrategies[10], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 10 },
    { name: 'Уровень 12: Строгий, но справедливый', description: 'Строгое, но справедливое возмездие.', opponentStrategy: presetStrategies[11], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 12 },
    { name: 'Уровень 13: Хулиган', description: 'Всегда предаёт.', opponentStrategy: presetStrategies[12], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 10 },
    { name: 'Уровень 14: Анти-Злопамятный', description: 'Мстит, но быстро прощает.', opponentStrategy: presetStrategies[13], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 15: Проверяющий', description: 'Сначала проверяет оппонента.', opponentStrategy: presetStrategies[14], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 10 },
    { name: 'Уровень 16: Постепенный', description: 'Постепенно усиливающееся возмездие.', opponentStrategy: presetStrategies[15], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 17: Сталкер', description: 'Сложная стратегия, основанная на памяти.', opponentStrategy: presetStrategies[16], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 18: Двойное Око за око', description: 'Мстит дважды за каждое предательство.', opponentStrategy: presetStrategies[17], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 12 },
    { name: 'Уровень 19: Адаптивный', description: 'Адаптируется к поведению оппонента.', opponentStrategy: presetStrategies[18], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 20: Мягкий Злопамятный', description: 'Злопамятный с небольшим шансом прощения.', opponentStrategy: presetStrategies[19], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 21: Око за три ока', description: 'Прощает только после трёх предательств.', opponentStrategy: presetStrategies[20], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 22: Ворчливый', description: 'Почти никогда не прощает.', opponentStrategy: presetStrategies[21], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 23: Наивный Проверяющий', description: 'Проверяет в начале, затем фиксируется.', opponentStrategy: presetStrategies[22], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 12 },
    { name: 'Уровень 24: Расчётливый', description: 'Сложная условная стратегия.', opponentStrategy: presetStrategies[23], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 },
    { name: 'Уровень 25: Обманчивый', description: 'Заманивает вас в ловушку.', opponentStrategy: presetStrategies[24], payoff: { 'C,C': [3,3], 'C,D': [0,7], 'D,C': [5,0], 'D,D': [1,1] }, rounds: 15 }
];