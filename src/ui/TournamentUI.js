import { loadStrategies } from '../data/storage.js';
import { presetStrategies } from '../data/presets.js';
import { runTournament } from '../core/Tournament.js';
import { DEFAULT_PAYOFF } from '../core/PayoffMatrix.js';

export class TournamentUI {
    constructor(bracketContainerId, listContainerId) {
        this.bracketContainer = document.getElementById(bracketContainerId);
        this.listContainer = document.getElementById(listContainerId);
        this.strategies = [];
        this.bracketSize = 4;
        this.currentRounds = 10;
        this.init();
    }

    init() {
        this.strategies = [...presetStrategies, ...loadStrategies()];
        this.renderStrategyList();
        this.renderBracket();
        this.setupDragAndDrop();
        document.getElementById('btn-start-tournament').onclick = () => this.startTournament();
        document.getElementById('btn-back-tournament').onclick = () => {
            document.getElementById('tournament-screen').classList.remove('active');
            document.getElementById('simulator-screen').classList.add('active');
        };

        const roundsBtn = document.getElementById('btn-rounds-config');
        const roundsModal = document.getElementById('rounds-modal');
        const roundsSlider = document.getElementById('rounds-slider');
        const roundsCount = document.getElementById('rounds-count');
        const roundsMinus = document.getElementById('rounds-minus');
        const roundsPlus = document.getElementById('rounds-plus');
        const roundsSave = document.getElementById('rounds-save');
        const roundsCancel = document.getElementById('rounds-cancel');

        const updateRoundsDisplay = (value) => {
            roundsSlider.value = value;
            roundsCount.textContent = value;
            roundsBtn.textContent = `Раунды: ${value}`;
        };

        roundsBtn.onclick = () => {
            updateRoundsDisplay(this.currentRounds);
            roundsModal.style.display = 'flex';
        };

        roundsSlider.oninput = () => updateRoundsDisplay(roundsSlider.value);
        roundsMinus.onclick = () => {
            if (parseInt(roundsSlider.value) > 1) updateRoundsDisplay(parseInt(roundsSlider.value) - 1);
        };
        roundsPlus.onclick = () => {
            if (parseInt(roundsSlider.value) < 50) updateRoundsDisplay(parseInt(roundsSlider.value) + 1);
        };

        roundsSave.onclick = () => {
            this.currentRounds = parseInt(roundsSlider.value);
            roundsModal.style.display = 'none';
        };
        roundsCancel.onclick = () => {
            roundsModal.style.display = 'none';
        };

        document.getElementById('btn-config-payoff-tournament').onclick = () => {
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
    }

    renderStrategyList() {
        this.listContainer.innerHTML = this.strategies.map((s, i) => `
            <div class="strategy-card" draggable="true" data-index="${i}">
                <span>${s.name}</span>
            </div>
        `).join('');
    }

    renderBracket() {
        this.bracketContainer.innerHTML = '';
        for (let i = 0; i < this.bracketSize; i++) {
            const slot = document.createElement('div');
            slot.className = 'bracket-slot';
            slot.dataset.slot = i;
            slot.textContent = 'Пусто';
            this.bracketContainer.appendChild(slot);
        }
    }

    setupDragAndDrop() {
        this.listContainer.querySelectorAll('.strategy-card').forEach(card => {
            card.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', card.dataset.index);
            });
        });

        this.bracketContainer.querySelectorAll('.bracket-slot').forEach(slot => {
            slot.addEventListener('dragover', e => e.preventDefault());
            slot.addEventListener('drop', e => {
                e.preventDefault();
                const stratIdx = e.dataTransfer.getData('text/plain');
                const strategy = this.strategies[stratIdx];
                slot.textContent = strategy.name;
                slot.dataset.strategy = stratIdx;
                slot.style.border = '2px solid #e94560';
            });
        });
    }

    startTournament() {
        const selected = [];
        this.bracketContainer.querySelectorAll('.bracket-slot').forEach(slot => {
            const idx = slot.dataset.strategy;
            if (idx !== undefined && this.strategies[idx]) {
                selected.push(this.strategies[idx]);
            }
        });

        if (selected.length < 2) {
            alert('Перетащите хотя бы 2 стратегии в сетку!');
            return;
        }

        const rounds = this.currentRounds;
        const payoff = window.currentPayoff || DEFAULT_PAYOFF;

        try {
            const results = runTournament(selected, rounds, payoff);
            this.displayResults(results);
        } catch (err) {
            console.error('Ошибка в турнире:', err);
            alert('Произошла ошибка при проведении турнира. Проверьте консоль.');
        }
    }

    displayResults(results) {
        const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
        const maxScore = sorted[0][1];

        let html = `
            <h3 style="text-align:center; margin-bottom:1rem;">🏆 Результаты турнира</h3>
            <div class="results-list">
        `;

        sorted.forEach(([name, score], index) => {
            const isWinner = score === maxScore;
            html += `
                <div class="result-row" style="display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; margin-bottom:0.5rem; background:${isWinner ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)'}; border-radius:12px; border:${isWinner ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)'};">
                    <div style="display:flex; align-items:center; gap:0.75rem;">
                        <span style="font-size:1.5rem; font-weight:bold; color:var(--primary);">${index + 1}</span>
                        <span style="font-weight:500;">${name}</span>
                    </div>
                    <span style="font-weight:bold; font-size:1.2rem; color:var(--accent);">${score} очков</span>
                </div>
            `;
        });

        html += `
            </div>
            <div style="text-align:center; margin-top:1rem;">
                <button id="btn-close-results" class="btn btn-secondary" style="width:auto;">Закрыть</button>
            </div>
        `;

        const content = document.getElementById('results-content');
        content.innerHTML = html;
        document.getElementById('results-modal').style.display = 'flex';

        document.getElementById('btn-close-results').onclick = () => {
            document.getElementById('results-modal').style.display = 'none';
        };
    }
}