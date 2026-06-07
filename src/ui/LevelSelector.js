import { presetLevels } from '../data/presets.js';
import { GameUI } from './GameUI.js';

export class LevelSelector {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    show() {
        this.container.innerHTML = `
            <button id="btn-back-from-levels" class="btn btn-secondary levels-back-btn" style="margin-bottom:1rem;">Назад</button>
            <div id="levels-grid"></div>
        `;
        document.getElementById('btn-back-from-levels').onclick = () => {
            this.container.style.display = 'none';
            document.getElementById('game-submenu').style.display = 'block';
        };
        const grid = document.getElementById('levels-grid');
        presetLevels.forEach((level, idx) => {
            const card = document.createElement('div');
            card.className = 'level-card';
            card.innerHTML = `<div class="level-num">${idx + 1}</div><div class="level-desc">${level.name}</div>`;
            card.addEventListener('click', () => this.startLevel(level));
            grid.appendChild(card);
        });
    }

    startLevel(level) {
        document.getElementById('game-screen').style.display = 'block';
        document.getElementById('game-submenu').style.display = 'none';
        new GameUI('game-area', level.opponentStrategy, level.rounds, level.payoff, () => {
            document.getElementById('game-area').style.display = 'none';
            document.getElementById('game-submenu').style.display = 'block';
        });
    }
}