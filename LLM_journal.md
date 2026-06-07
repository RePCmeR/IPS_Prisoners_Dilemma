# Журнал использования LLM

Архитектура предложена DeapSeek на этапе проектирования и взята за основу для структурирования кода.

Промпты были такие:
```
Мне нужно сделать веб приложение. Его я собираюсь сделать с помощью JavaScript, HTML, css. Опиши мне детальный и подробный план создания веб приложения, можешь помочь и сказать архитектуру папок и код написать. Суть приложения в том, чтобы сыграть в итеративную дилемму заключённого. На экране отображается  граф, который описывает стратегию игры соперника. Мы должны на нажимать на две кнопки (обмануть, сотрудничать) и в зависимости от этого мы попадаем в другую вершину на графе. Также задана матрица выигрышей, которая будет описывать выигрыши в каждом исходе, задача получить больше чем соперник. Ещё нужна возможность самостоятельно создавать свою стратегию и стратегию противника и создать турнир в рамках которого они могут играть друг против друга. Ещё должен быть некоторый элемент рандома в некоторых графах противника (это отдельный режим, который можно выключить) противник может с каким-то шансом пойти в одну вершину при таком-то действии, но с 1-p пойти в другую вершину, учти это тоже. Граф должен быть визуально отображен и создание стратегий должно осуществляться путём перетаскивания вершин, элементов из редактора в некоторое окно редактирования, в котором будем отображен граф, также отмечай цветами то, какое действие делает противник. Сейчас не особо задумывайсяо дизайне и содержании css, это сделаем потом, сейчас нужна просто mvp версия. Можешь истоьзовать разные библиотеки например d3 или любые другие которые посчитаешь нужными/удобными
```

```
Давай немного иначе сделаем, должна быть начальная вкладка, в которой есть кнопки: Играть; Симулятор, в котором можно создать либо турнир, либо игру 1 на 1, с заданными стратегиями, которые либо взяты из встроенных в игру, либо созданных самостоятельно, также можно задавать единственное количество раундов на каждом этапе турнира или для игры 1 на 1. Также должна быть кнопка Выход, которая закрывает веб-приложение. Можно попробовать изменить структуру кнопок или добавить ещё кнопок, это опционально (например кнопку Настройки, где можно менять язык, но тут думай сам). 


Сам Кнопка Играть должна перекидывать на новую страницу, где есть кнопки: Случайный уровень, Уровни, Обучение (тут на своё усмотрение дальше) 

Случайный уровень: должен быть реализован некоторый генератор, который будет создавать случайный граф, или использовать уже существующий в самом приложении (возможно даже тот, который создал игрок), задавать матрицы выигрышей и кол-во раундов. После этого начинается игра, в которой нужно нажимать на вершины графа противника (например левая кнопка мыши нажатие - кооператив, права - обман), в зависимости от этого соперник переходит либо в одну вершину, либо в другую. Игрок должен знать, куда перейдет соперник, после того, как он нажмет на какую-то вершину (т.е. вся стратегия известна игроку заранее). Задача - набрать больше очков чем противник или набрать определённое кол-во баллов + набрать больше противника.

Уровни: заранее созданные уровни с заранее подобранными графами, параметрами и тд. В них просто играть можно сразу. Должен выводить список уровней в виде небольших квадратов с цифрой, если уровней слишком много то сделай возможность их скроллить или еще что-то, чтобы было удобно смотреть и выбирать визуально. 

Кнопка симулятор: перекидывает на новое окно, в котором мы выбираем между кнопками: Один на один, турнир. 
В случае один на один, у нас открывается редактор, в котором мы создаем стратегию противника, есть большое окно слева-посередине, в котором будет располагаться граф, справа если вертикальное меню, из него можно доставать различные элементы элементы графа методом drag and drop (наводимся нажимаем, удерживая, тащим на левое поле). Ребра можно создавать в помощью клика по двум вершинам (порядок важен), когда кликает первая вершина, то сделай так, чтобы она подсветилась. 

Также в этом окне можно создать свою стратегию, с помощью кнопки-перекоючателя сверху справа в нашем основном поле с графом. Кнопка-переключатель должна быть видна всегда и не особо большая, при нажатии на неё, граф противника должен будет остаться в том же виде, в котором был в последний момент до нажатия и переключаться на новое поле, в котором уже также аналогичным образом создаётся граф. Дальше выбирается кол-во раундов и матрица выигрышей. 

Свою стратегию можно не создавать и тогда запустится режим игры с кликами, где нет каких-то условий победы. 

Также стратегии можно взять из тех, что встроенны и заранее реализованы разрабом.

Для турнира все аналогично, но теперь можно ещё выбирать кто с кем играет. Сетка - теннисная (выбирается кол-во участников (степень двойки)). Также нужен отдельный экран, в котором будет отображена сетка и состояние игры (кто в каком раунде, какие выигрыши, кто куда перешёл и тд и тп). Сама эта сетка заполняется тоже drag and drop из стратегий, которые будут сделаны на начальном этапе создания стратегий, сами стратегия сделаны в виде списка справа, в котором находятся кастомные названия или названия заранее заданных стратегий.

 Ещё учти, что можно нажать на уже готовую стратегию, выведется её граф, а потом его можно будет изменить, сделав стратегию уже кастомной. 

Подумай о том, какие кнопки можно добавить, какую архитектуру приложения можно сделать и тд и тп, но постарайся все хорошо структурировать и сделать может уровни болванки и прочее, а потом я подумаю чем их заполнить, главное просто пример. Над дизайном сайта можешь не думать, но если хочешь, то какую-то начальную версию через HTML и CSS  можешь сделать, чтобы глазу было приятно
```

Была изначально предложена такая структура проекта:

```
prisoners-dilemma/
├── index.html                  # точка входа в приложение
├── package.json                # зависимости и скрипты (если используется сборщик)
├── vite.config.js              # конфигурация Vite (опционально)
└── src/
    ├── main.js                 # инициализация, управление вкладками
    ├── core/                   # бизнес-логика игры
    │   ├── strategy.js         # класс стратегии (конечный автомат)
    │   ├── game.js             # логика отдельной игры
    │   ├── tournament.js       # проведение турниров
    │   └── payoff.js           # матрица выигрышей
    ├── ui/                     # интерфейсные компоненты
    │   ├── gameUI.js           # интерфейс режима игры
    │   ├── editorUI.js         # редактор стратегий
    │   ├── tournamentUI.js     # интерфейс турнира
    │   └── graphView.js        # обёртка для Cytoscape.js
    ├── data/                   # статические данные и хранилище
    │   └── presets.js          # встроенные стратегии (Tit‑for‑Tat и др.)
    └── utils/                  # вспомогательные функции
        └── storage.js          # работа с localStorage
```
---

С помощью DeapSeek был сделан первый дизайн для MVP версии, подобрана библиотека **Cytoscape**, с помощью которой можно рисовать графы, также для большего удобства и дальнейшей работы была исправлена архитектура и вынесены в отдельную папку styles css файлы для каждого из юзер интерфейсов.

Новый дизайн после исправлений стал:

```
IPS_HSE_Perevalov_Daniil/
├── index.html
├── styles/
│   ├── main.css
│   ├── game.css
│   ├── editor.css
│   ├── levels.css
│   ├── simulator.css
│   └── tournament.css
└── src/
    ├── main.js
    ├── core/
    │   ├── Strategy.js
    │   ├── Game.js
    │   ├── Tournament.js
    │   └── PayoffMatrix.js
    ├── ui/
    │   ├── GameUI.js
    │   ├── GraphEditor.js
    │   ├── LevelSelector.js
    │   ├── SimulatorUI.js
    │   └── TournamentUI.js
    ├── data/
    │   ├── presets.js
    │   └── storage.js
    └── utils/
        └── randomStrategy.js
```

Дополнительно для создания дизайна сайта и макетов использовался Gemini 3 Flash, в результате написания ТЗ был получен макет, который описывался html-кодом ниже:

```
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Game Hub</title>
    <style>
      :root {
          --bg-color: #0f172a;
          --card-bg: rgba(30, 41, 59, 0.7);
          --primary: #8b5cf6;
          --primary-hover: #7c3aed;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --accent: #10b981;
          --danger: #ef4444;
      }

      * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }

      body {
          background-color: var(--bg-color);
          background-image:
              radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 40%);
          color: var(--text-main);
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
      }

      .container {
          width: 100%;
          max-width: 500px;
          padding: 2rem;
          text-align: center;
          z-index: 10;
      }

      .card {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 2.5rem;
          letter-spacing: -0.025em;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
      }

      .button-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
      }

      .btn {
          appearance: none;
          border: none;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: white;
          width: 100%;
      }

      .btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
      }

      .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
      }

      .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
      }

      .btn-outline {
          background: transparent;
          border: 1px solid var(--danger);
          color: var(--danger);
          margin-top: 1rem;
      }

      .btn-outline:hover {
          background: rgba(239, 68, 68, 0.1);
      }

      .screen {
          display: none;
          animation: fadeIn 0.5s ease-out forwards;
      }

      .screen.active {
          display: block;
      }

      @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
      }

      .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
      }

      .option-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
      }

      .option-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--primary);
      }

      .option-card svg {
          margin-bottom: 0.75rem;
          color: var(--primary);
      }

      .option-card span {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
      }

      .description {
          color: var(--text-muted);
          margin-bottom: 2rem;
          font-size: 0.95rem;
      }

      /* Back button styling */
      .back-btn {
          position: absolute;
          top: 2rem;
          left: 2rem;
          background: none;
          border: none;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: color 0.2s;
      }

      .back-btn:hover {
          color: var(--text-main);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Main Menu -->
      <div id="main-menu" class="screen card active">
        <h1>GameHub</h1>
        <div class="button-group">
          <button class="btn btn-primary" onclick="showScreen('play-menu')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.14v13.72l11-6.86L8 5.14z" />
            </svg>
            Играть
          </button>
          <button class="btn btn-secondary" onclick="showScreen('sim-menu')">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Симулятор
          </button>
          <button class="btn btn-outline" onclick="handleExit()">Выход</button>
        </div>
      </div>

      <!-- Play Menu -->
      <div id="play-menu" class="screen card">
        <button class="back-btn" onclick="showScreen('main-menu')">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Назад
        </button>
        <h1>Выбор режима</h1>
        <p class="description">
          Выберите подходящий формат игры для начала сессии
        </p>

        <div class="options-grid">
          <div class="option-card">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Одиночная</span>
          </div>
          <div class="option-card">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Мультиплеер</span>
          </div>
          <div class="option-card">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            <span>Быстрый старт</span>
          </div>
          <div class="option-card">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
              />
            </svg>
            <span>Турнир</span>
          </div>
        </div>

        <button class="btn btn-primary">Начать игру</button>
      </div>

      <!-- Simulator Menu -->
      <div id="sim-menu" class="screen card">
        <button class="back-btn" onclick="showScreen('main-menu')">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Назад
        </button>
        <h1>Симулятор</h1>
        <p class="description">Настройте параметры системы для тестирования</p>

        <div class="button-group">
          <button class="btn btn-secondary">Параметры физики</button>
          <button class="btn btn-secondary">ИИ противники</button>
          <button class="btn btn-secondary">Среда окружения</button>
        </div>

        <button class="btn btn-primary" style="margin-top: 2rem;">
          Запустить симуляцию
        </button>
      </div>
    </div>

    <script>
      function showScreen(screenId) {
          // Hidden all screens with a slight delay for better experience or instant swap
          const screens = document.querySelectorAll('.screen');
          screens.forEach(screen => {
              screen.classList.remove('active');
          });

          const targetScreen = document.getElementById(screenId);
          if (targetScreen) {
              targetScreen.classList.add('active');
          }
      }

      function handleExit() {
          if (confirm("Вы действительно хотите выйти?")) {
              // In a real web app, we might redirect or show a goodbye screen
              document.body.innerHTML = `
                  <div class="container">
                      <div class="card">
                          <h1>До встречи!</h1>
                          <p style="color: var(--text-muted)">Приложение закрыто. Обновите страницу, чтобы вернуться.</p>
                      </div>
                  </div>`;
          }
      }
    </script>
  </body>
</html>
```

Далее я использовал DeapSeek, чтобы наполнить папку styles новым дизайном, который основывался на варианте, сгенерированном выше.

Промпт для этого:
```
я тебе отправляю дизайн, который ты должен будешь использовать для приложения, постарайся делай все в одном стиле в котором я тебе задал, ниже я тебе скину новый дизайн в html.

--ТУТ КОД HTML--


Из этого дизайна тебе нужно взять именно визуальную часть и стиль, а не логику или еще что-то. Ниже я оптравляю тебе код в котором используется старая архитектура, твоя задача сделать так чтобы ты учел мое замечание с архитектурой и сделал новую где каждая визуальная часть сделана по-новому.

--ТУТ ПОЛНОСТЬЮ ВЕСЬ КОД ПРИЛОЖЕНИЯ--
```

---

В полученном новом коде дополнительно были подкорректированы:
1. Расположения кнопок, 
2. Расстояние между кнопками, 
3. Выравнивание,
4. Обозначение ребер не через буквы C и D, а цветами,
5. Создание обводки вокруг вершин, чтобы лучше считывать вершины;

---

Использовал DeapSeek, чтобы создать систему с перемещением на предыдущий экран с помощью кнопки **Назад**.
Изначально я дал весь код и попросил добавить, после было просто огромное количество багов и проблем, поэтому было огромное количество промптов. Все они по-сути были близки к такому:

```
есть баг, при переходе в играть а потом нажатии назад окно с доп опциями при нажатии играть не пропадает, проверь нет ли таких багов еще и исправь их. также при нажатии симулятор ничего не отображает и вариантов выбора нет, которые были раньше
```

```
играть -> обучение -> назад, снова второй экран снизу + кнопка завершить игру все еще возвращает на главнвй жакрн когда должна возвращать на предыдущий. Внимательно поспмотри на код и найди все такие или похожие баги
```

---

Deapseek
Промпты:
```
улучши интерфейс задавания матрицы выигрышей, еще сейчас при запуске игры вручную получается так что просто пустой экран без стратегии, возможно это из-за того что я стратегию задал не там где нужно, поэтому сделай систему где ты смотришь есть хотя бы одна стратегия или нет и берешь ее, но если есть обе, то берешь противника.

Еще в самом редакторе никак не отображается для кого ты делаешь стратегию, поэтому при переключении экрана сделай систему визуальную которая обозначает чью стратегию ты сейчас создаешь.

Еще в редакторе сделай возможность удалять вершины и ребра, которые уже созданы.

Еще во вкладке уровни, есть кнопка назад, которая не работает и ничего не делает, исправь еее
```

```
сейчас при создании стратегии противника кнопка горит фиолетовым а не красным, еще сделай систему удаления более интуитивной. Не надо делать одну огромнуб кнопку которая просто без надписи или чего-то еще. Явнее систему удаления сделай + не надо переключаться между режимами создания ребер и нет, это лишний функционал

сделай кнопку удаления не сплошной красной а скорее напиши надпись удалить и покрась ее так же как кнопка выйти на главном экране
```

В main.js появились:
```
<button id="btn-delete-selected" class="btn btn-outline" style="width:auto;">Удалить</button>

...

document.getElementById('btn-delete-selected').onclick = () => {
    if (window.graphEditor?.cy) {
        const selected = window.graphEditor.cy.elements(':selected');
        if (selected.length > 0) selected.remove();
    }
};

...

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
```

В GraphEditor.js появились:
```
initDeletion() {
    this.cy.on('keydown', (event) => {
        if (event.key === 'Delete' || event.key === 'Backspace') {
            const selected = this.cy.elements(':selected');
            if (selected.length > 0) selected.remove();
        }
    });
}

...

this.container.setAttribute('tabindex', '0');
this.container.addEventListener('click', () => {
    this.container.focus();
});

...


this.container.style.outline = 'none';
```

---

