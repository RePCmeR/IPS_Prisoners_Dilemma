import { GameUI } from './ui/GameUI.js';
import { LevelSelector } from './ui/LevelSelector.js';
import { SimulatorUI } from './ui/SimulatorUI.js';
import { GraphEditor } from './ui/GraphEditor.js';
import { generateRandomStrategy, generateRandomPayoff } from './utils/randomStrategy.js';
import { DEFAULT_PAYOFF } from './core/PayoffMatrix.js';

function editorTemplate() {
    return `
    <div class="card">
        <div id="editor-toolbar" style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <button id="btn-toggle-strategy" class="btn" style="width:auto; background:var(--danger);">Противник</button>
            <button id="btn-save-strategy" class="btn btn-primary" style="width:auto;">Сохранить</button>
            <button id="btn-load-preset" class="btn btn-secondary" style="width:auto;">Загрузить встроенную</button>
            <button id="btn-discard-changes" class="btn btn-outline" style="width:auto;">Отменить изменения</button>
            <button id="btn-delete-selected" class="btn btn-outline" style="width:auto;">Удалить</button>
        </div>
        <div id="editor-main">
            <div id="palette">
                <div class="drag-item" draggable="true" data-action="C">C</div>
                <div class="drag-item" draggable="true" data-action="D">D</div>
            </div>
            <div id="cy-container"></div>
        </div>
        <button id="btn-back-editor" class="btn btn-secondary" style="margin-top:1rem;">Назад</button>
    </div>
    <div id="edge-modal" class="modal" style="display:none;">
        <div class="modal-content card">
            <h3>Создание ребра</h3>
            <div class="edge-form">
                <label>Действие игрока:</label>
                <div class="action-buttons">
                    <button id="edge-action-c" class="edge-action-btn">🟢 Сотрудничать</button>
                    <button id="edge-action-d" class="edge-action-btn">🔴 Предать</button>
                </div>
                <input type="hidden" id="edge-action" value="C">
                <label for="edge-prob">Вероятность:</label>
                <input id="edge-prob" type="range" min="0" max="1" step="0.01" value="1">
                <div class="prob-display">
                    <span id="prob-value">1.00</span>
                </div>
            </div>
            <div style="display:flex; gap:10px; justify-content:center; margin-top:1rem;">
                <button id="edge-create" class="btn btn-primary" style="width:auto;">Создать</button>
                <button id="edge-cancel" class="btn btn-outline" style="width:auto;">Отмена</button>
            </div>
        </div>
    </div>
    `;
}

const screens = {
    main: document.getElementById('main-menu'),
    game: document.getElementById('game-screen'),
    simulator: document.getElementById('simulator-screen'),
    editor: document.getElementById('editor-screen'),
    tournament: document.getElementById('tournament-screen')
};

const parentScreen = {
    game: 'main',
    simulator: 'main',
    editor: 'simulator',
    tournament: 'simulator'
};
window.parentScreen = parentScreen;

window.currentPayoff = { ...DEFAULT_PAYOFF };

window.showMessage = (text) => {
    document.getElementById('message-modal-text').innerText = text;
    document.getElementById('message-modal').style.display = 'flex';
    document.getElementById('message-modal-ok').onclick = () => {
        document.getElementById('message-modal').style.display = 'none';
    };
};

function resetGameScreen() {
    document.getElementById('game-submenu').style.display = 'block';
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('tutorial-panel').style.display = 'none';
    document.getElementById('game-area').innerHTML = '';
    if (window.__currentGameUI) {
        window.__currentGameUI.destroy();
        window.__currentGameUI = null;
    }
}

function resetSimulatorScreen() {
    document.getElementById('sim-area').innerHTML = '';
}

function showScreen(name) {
    Object.values(screens).forEach(s => {
        s.classList.remove('active');
        s.style.display = '';
    });
    const target = screens[name];
    if (target) target.classList.add('active');
}

function goBackFrom(currentScreenId) {
    if (window.__currentGameUI) {
        window.__currentGameUI.destroy();
        window.__currentGameUI = null;
    }
    const parent = parentScreen[currentScreenId] || 'main';
    if (currentScreenId === 'game') resetGameScreen();
    if (currentScreenId === 'simulator') resetSimulatorScreen();
    showScreen(parent);
}

window.goBackFrom = goBackFrom;
window.__currentGameUI = null;

document.getElementById('editor-screen').innerHTML = editorTemplate();

const toggleBtn = document.getElementById('btn-toggle-strategy');
toggleBtn.onclick = () => {
    if (window.graphEditor) {
        const mode = window.graphEditor.currentMode === 'opponent' ? 'my' : 'opponent';
        window.graphEditor.switchMode(mode);
        if (mode === 'opponent') {
            toggleBtn.style.background = 'var(--danger)';
            toggleBtn.innerText = 'Противник';
        } else {
            toggleBtn.style.background = 'var(--accent)';
            toggleBtn.innerText = 'Своя';
        }
    }
};
document.getElementById('btn-save-strategy').onclick = () => window.graphEditor?.save();
document.getElementById('btn-load-preset').onclick = () => window.graphEditor?.loadPreset();
document.getElementById('btn-back-editor').onclick = () => {
    window.graphEditor?.saveCurrentToStrategy();
    goBackFrom('editor');
    if (window.simUI && typeof window.simUI.showPlayArea === 'function') {
        window.simUI.showPlayArea();
    }
};
document.getElementById('btn-discard-changes').onclick = () => {
    if (window.graphEditor) {
        window.graphEditor.discardChanges();
        window.showMessage('Изменения отменены.');
    }
};

document.getElementById('btn-delete-selected').onclick = () => {
    if (window.graphEditor?.cy) {
        const selected = window.graphEditor.cy.elements(':selected');
        if (selected.length > 0) selected.remove();
    }
};

document.getElementById('btn-play').onclick = () => {
    showScreen('game');
    resetGameScreen();
};
document.getElementById('btn-simulator').onclick = () => {
    showScreen('simulator');
    resetSimulatorScreen();
};
document.getElementById('btn-exit').onclick = () => window.close();

document.getElementById('btn-back-game').onclick = () => goBackFrom('game');

document.getElementById('btn-random-level').onclick = () => {
    const modal = document.getElementById('nodes-modal');
    const slider = document.getElementById('nodes-slider');
    const countDisplay = document.getElementById('nodes-count');
    const minusBtn = document.getElementById('nodes-minus');
    const plusBtn = document.getElementById('nodes-plus');
    const startBtn = document.getElementById('nodes-start');
    const cancelBtn = document.getElementById('nodes-cancel');
    const randomToggle = document.getElementById('nodes-random-toggle');

    const updateCount = (value) => {
        slider.value = value;
        countDisplay.textContent = value;
    };
    slider.oninput = () => updateCount(slider.value);
    minusBtn.onclick = () => {
        if (parseInt(slider.value) > 2) updateCount(parseInt(slider.value) - 1);
    };
    plusBtn.onclick = () => {
        if (parseInt(slider.value) < 15) updateCount(parseInt(slider.value) + 1);
    };

    updateCount(5);
    randomToggle.checked = true;
    modal.style.display = 'flex';

    startBtn.onclick = () => {
        const nodeCount = parseInt(slider.value);
        const useRandom = randomToggle.checked;
        modal.style.display = 'none';

        document.getElementById('game-submenu').style.display = 'none';
        document.getElementById('game-area').style.display = 'block';
        if (window.__currentGameUI) window.__currentGameUI.destroy();

        const randomStrat = generateRandomStrategy('Случайный противник', nodeCount, useRandom);
        const randomPayoff = generateRandomPayoff();
        const randomRounds = Math.floor(Math.random() * 11) + 5;

        window.__currentGameUI = new GameUI('game-area', randomStrat, randomRounds, randomPayoff, () => {
            document.getElementById('game-submenu').style.display = 'block';
            document.getElementById('game-area').style.display = 'none';
            window.__currentGameUI = null;
        });
    };

    cancelBtn.onclick = () => {
        modal.style.display = 'none';
    };
};

document.getElementById('btn-levels').onclick = () => {
    document.getElementById('game-submenu').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    if (window.__currentGameUI) window.__currentGameUI.destroy();
    const levelSelector = new LevelSelector('game-area');
    levelSelector.show();
};
document.getElementById('btn-tutorial').onclick = () => {
    document.getElementById('game-submenu').style.display = 'none';
    document.getElementById('tutorial-panel').style.display = 'block';
};
document.getElementById('btn-back-tutorial').onclick = () => {
    document.getElementById('tutorial-panel').style.display = 'none';
    document.getElementById('game-submenu').style.display = 'block';
};

document.getElementById('btn-one-vs-one').onclick = () => {
    const simUI = new SimulatorUI('sim-area');
    window.simUI = simUI;
    simUI.showOneVsOne();
};
document.getElementById('btn-tournament').onclick = () => {
    const simUI = new SimulatorUI('sim-area');
    simUI.showTournament();
};
document.getElementById('btn-back-sim').onclick = () => goBackFrom('simulator');

document.getElementById('btn-back-tournament').onclick = () => {
    if (window.tourUI) window.tourUI = null;
    goBackFrom('tournament');
};

showScreen('main');