import { loadStrategies, deleteStrategy } from '../data/storage.js';
import { presetStrategies } from '../data/presets.js';
import { runTournament } from '../core/Tournament.js';
import { DEFAULT_PAYOFF } from '../core/PayoffMatrix.js';

export class TournamentUI {
    constructor(bracketContainerId, listContainerId) {
        this.bracketContainer = document.getElementById(bracketContainerId);
        this.listContainer = document.getElementById(listContainerId);
        this.strategies = [];
        this.bracketSize = 4;        // количество слотов по умолчанию
        this.currentRounds = 10;
        this.init();
    }

    init() {
        // Объединяем встроенные и сохранённые стратегии
        this.strategies = [...presetStrategies, ...loadStrategies()];
        this.renderStrategyList();
        this.renderBracket();
        this.setupDragAndDrop();
        this.createSizeSelector();
        this.setupPayoffAndRounds();

        document.getElementById('btn-start-tournament').onclick = () => this.startTournament();
        document.getElementById('btn-back-tournament').onclick = () => {
            document.getElementById('tournament-screen').classList.remove('active');
            document.getElementById('simulator-screen').classList.add('active');
        };
    }

    // Добавляет кнопки управления количеством участников
    createSizeSelector() {
        const controls = document.getElementById('tournament-controls');
        if (!controls) return;

        // Удаляем старый селектор, если он уже существует
        const oldSelector = document.getElementById('size-selector');
        if (oldSelector) oldSelector.remove();

        const sizeSelector = document.createElement('div');
        sizeSelector.id = 'size-selector';  // идентификатор для последующего удаления
        sizeSelector.style.display = 'flex';
        sizeSelector.style.gap = '0.5rem';
        sizeSelector.style.alignItems = 'center';

        const label = document.createElement('span');
        label.style.color = 'var(--text-muted)';
        label.textContent = 'Участники:';
        sizeSelector.appendChild(label);

        const minusBtn = document.createElement('button');
        minusBtn.className = 'btn btn-secondary';
        minusBtn.style.width = 'auto';
        minusBtn.textContent = '−';
        minusBtn.onclick = () => {
            if (this.bracketSize > 2) this.setBracketSize(this.bracketSize - 1);
        };
        sizeSelector.appendChild(minusBtn);

        const sizeDisplay = document.createElement('span');
        sizeDisplay.style.fontWeight = 'bold';
        sizeDisplay.style.minWidth = '20px';
        sizeDisplay.style.textAlign = 'center';
        sizeDisplay.textContent = this.bracketSize;
        this.sizeDisplay = sizeDisplay;
        sizeSelector.appendChild(sizeDisplay);

        const plusBtn = document.createElement('button');
        plusBtn.className = 'btn btn-secondary';
        plusBtn.style.width = 'auto';
        plusBtn.textContent = '+';
        plusBtn.onclick = () => {
            if (this.bracketSize < 12) this.setBracketSize(this.bracketSize + 1);
        };
        sizeSelector.appendChild(plusBtn);

        controls.insertBefore(sizeSelector, controls.firstChild);
    }

    // Изменяет количество слотов и перестраивает сетку
    setBracketSize(size) {
        if (this.bracketSize === size) return;
        this.bracketSize = size;
        if (this.sizeDisplay) this.sizeDisplay.textContent = size;
        this.renderBracket();
        this.setupDragAndDrop();
    }

    // Отрисовывает список стратегий с возможностью удаления пользовательских
    renderStrategyList() {
        this.listContainer.innerHTML = '';
        this.strategies.forEach((s, i) => {
            const card = document.createElement('div');
            card.className = 'strategy-card';
            card.draggable = true;
            card.dataset.index = i;
            card.innerHTML = `<span>${s.name}</span>`;

            // Для пользовательских стратегий добавляем кнопку удаления
            if (i >= presetStrategies.length) {
                const delBtn = document.createElement('button');
                delBtn.textContent = '✕';
                delBtn.style.cssText = 'background:none;border:none;color:var(--danger);cursor:pointer;font-size:1.2rem;padding:0 0.5rem;';
                delBtn.title = 'Удалить стратегию';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (confirm(`Удалить стратегию "${s.name}"?`)) {
                        deleteStrategy(s.name);
                        this.strategies = [...presetStrategies, ...loadStrategies()];
                        this.renderStrategyList();
                        this.setupDragAndDrop();
                    }
                };
                card.appendChild(delBtn);
            }
            this.listContainer.appendChild(card);
        });

        // Кнопка очистки всех пользовательских стратегий
        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn btn-outline';
        clearBtn.style.width = 'auto';
        clearBtn.style.marginTop = '0.5rem';
        clearBtn.textContent = 'Очистить все пользовательские стратегии';
        clearBtn.onclick = () => {
            const userStrategies = loadStrategies();
            if (userStrategies.length === 0) {
                alert('Нет сохранённых стратегий для удаления.');
                return;
            }
            if (confirm('Удалить ВСЕ пользовательские стратегии?')) {
                userStrategies.forEach(s => deleteStrategy(s.name));
                this.strategies = [...presetStrategies, ...loadStrategies()];
                this.renderStrategyList();
                this.setupDragAndDrop();
            }
        };
        this.listContainer.appendChild(clearBtn);
    }

    // Создаёт пустые слоты для турнирной сетки
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

    // Настраивает перетаскивание стратегий в слоты
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

    // Настройка раундов и матрицы выигрышей (модальные окна)
    setupPayoffAndRounds() {
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

        // Настройка матрицы
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

    // Запускает круговой турнир и показывает результаты
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
            alert('Произошла ошибка при проведении турнира.');
        }
    }

    // Отображает результаты турнира в модальном окне
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