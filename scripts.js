// Состояние приложения
const state = {
    savedPalettes: [],
    currentTheme: 'light'
};

// Предустановленные палитры
const presetPalettes = [
    {
        name: "Природные тона",
        colors: ["#8B4513", "#228B22", "#F0E68C"],
        description: "Тёплые земляные тона для натурального дизайна"
    },
    {
        name: "Морская тема", 
        colors: ["#1E90FF", "#00CED1", "#F0F8FF"],
        description: "Свежие голубые оттенки для водной тематики"
    },
    {
        name: "Яркий закат",
        colors: ["#FF6B6B", "#FFA726", "#AB47BC"],
        description: "Яркие насыщенные цвета для смелых проектов"
    },
    {
        name: "Пастельная нежность",
        colors: ["#FFD1DC", "#C9F0FF", "#D0F0C0"],
        description: "Мягкие и успокаивающие пастельные тона"
    },
    {
        name: "Осенний лес",
        colors: ["#D2691E", "#DA1E37", "#E9D66B"],
        description: "Богатые и тёплые цвета осенней листвы"
    },
    {
        name: "Ледяная зима",
        colors: ["#E1F5FE", "#81D4FA", "#B3E5FC"],
        description: "Холодные и свежие оттенки зимнего утра"
    },
    {
        name: "Тропический рай",
        colors: ["#4DB6AC", "#FFB74D", "#AED581"],
        description: "Сочные и жизнерадостные тропические цвета"
    },
    {
        name: "Элегантная монохромность",
        colors: ["#616161", "#9E9E9E", "#E0E0E0"],
        description: "Сдержанная серая гамма для минималистичного дизайна"
    },
    {
        name: "Винтажное ретро",
        colors: ["#FFCCBC", "#80CBC4", "#CE93D8"],
        description: "Приглушённые тона, напоминающие ретро-стиль"
    },
    {
        name: "Глубокий океан",
        colors: ["#0A2463", "#3E92CC", "#D8315B"],
        description: "Насыщенные глубокие тона с контрастным акцентом"
    },
    {
        name: "Свежесть мяты",
        colors: ["#99EDCC", "#242423", "#F5CB5C"],
        description: "Освежающая мята с тёмным фоном и золотым акцентом"
    },
    {
        name: "Пыльные розы",
        colors: ["#D4A0A7", "#E3E3E3", "#4A4A4A"],
        description: "Нежные приглушённые тона для элегантного дизайна"
    },
    {
        name: "Электрический неон",
        colors: ["#9D00FF", "#00F5FF", "#FF00C8"],
        description: "Яркие неоновые цвета для современных цифровых проектов"
    },
    {
        name: "Кофейное утро", 
        colors: ["#6F4E37", "#C0A080", "#F4F1DE"],
        description: "Тёплые кофейные оттенки для уютной атмосферы"
    },
    {
        name: "Лесная сказка",
        colors: ["#2D5A27", "#8A9A5B", "#C9C0BB"],
        description: "Естественные зелёные тона с нейтральным балансом"
    }
];

// Переключение вкладок
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    if (tabName === 'saved') {
        updateSavedPalettes();
    }
}

// Переключение темы
function toggleTheme() {
    const body = document.body;
    const themeButton = document.getElementById('theme-switcher');
    
    if (state.currentTheme === 'light') {
        body.classList.add('dark-theme');
        state.currentTheme = 'dark';
        themeButton.textContent = 'Светлая тема';
    } else {
        body.classList.remove('dark-theme');
        state.currentTheme = 'light';
        themeButton.textContent = 'Тёмная тема';
    }
    
    localStorage.setItem('theme', state.currentTheme);
}

// Генерация случайного цвета
function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// Генерация палитры
function generatePalette() {
    for (let i = 1; i <= 3; i++) {
        const color = getRandomColor();
        document.getElementById(`color-${i}`).style.backgroundColor = color;
        document.getElementById(`code-${i}`).textContent = color;
    }
}

// Генерация одного цвета
function generateSingleColor() {
    const color = getRandomColor();
    document.getElementById('single-color').style.backgroundColor = color;
    document.getElementById('single-code').textContent = color;
}

// Сохранение палитры
function savePalette() {
    const paletteName = prompt('Введите название для вашей палитры:');
    if (!paletteName) return;
    
    const colors = [];
    for (let i = 1; i <= 3; i++) {
        colors.push(document.getElementById(`code-${i}`).textContent);
    }
    
    state.savedPalettes.push({
        name: paletteName,
        colors: colors,
        date: new Date().toLocaleDateString('ru-RU')
    });
    
    saveToLocalStorage();
    updateSavedPalettes();
    alert(`Палитра "${paletteName}" сохранена!`);
}

// Удаление палитры
function deletePalette(index) {
    if (confirm('Удалить эту палитру?')) {
        state.savedPalettes.splice(index, 1);
        saveToLocalStorage();
        updateSavedPalettes();
    }
}

// Обновление сохраненных палитр
function updateSavedPalettes() {
    const container = document.getElementById('saved-palettes-container');
    
    if (state.savedPalettes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>У вас пока нет сохранённых палитр</p>
                <p>Сгенерируйте и сохраните свою первую палитру!</p>
            </div>`;
        return;
    }
    
    container.innerHTML = state.savedPalettes.map((palette, index) => {
        const colorsHTML = palette.colors.map(color => `
            <div class="color-box">
                <div class="color-preview" style="background: ${color};"></div>
                <span class="color-code">${color}</span>
            </div>
        `).join('');
        
        return `
            <div class="saved-palette">
                <h3>${palette.name}</h3>
                <p>Создано: ${palette.date}</p>
                <div class="palette-container">${colorsHTML}</div>
                <button class="delete-btn" onclick="deletePalette(${index})">Удалить</button>
            </div>
        `;
    }).join('');
}

// Отображение предустановленных палитр
function displayPresetPalettes() {
    const container = document.getElementById('ideas-container');
    
    container.innerHTML = presetPalettes.map(palette => {
        const colorsHTML = palette.colors.map(color => `
            <div class="color-box">
                <div class="color-preview" style="background: ${color};"></div>
                <span class="color-code">${color}</span>
            </div>
        `).join('');
        
        return `
            <div class="idea-palette">
                <h3>${palette.name}</h3>
                <div class="palette-container">${colorsHTML}</div>
                <p>${palette.description}</p>
            </div>
        `;
    }).join('');
}

// Работа с localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('savedPalettes');
    const theme = localStorage.getItem('theme');
    
    if (saved) {
        state.savedPalettes = JSON.parse(saved);
    }
    
    if (theme === 'dark') {
        toggleTheme();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('savedPalettes', JSON.stringify(state.savedPalettes));
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    
    generatePalette();
    generateSingleColor();
    displayPresetPalettes();
    
    // Навигация
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab(this.getAttribute('data-tab'));
        });
    });
    
    // Кнопки
    document.getElementById('generate-btn').addEventListener('click', generatePalette);
    document.getElementById('save-palette').addEventListener('click', savePalette);
    document.getElementById('generate-single').addEventListener('click', generateSingleColor);
    document.getElementById('theme-switcher').addEventListener('click', toggleTheme);
    
    // Кнопка на главной
    document.querySelector('.cta-button').addEventListener('click', function() {
        switchTab(this.getAttribute('data-tab'));
    });
});