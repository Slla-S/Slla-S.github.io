// Состояние приложения
const state = {
    lockedColors: [false, false, false, false, false],
    savedPalettes: [],
    currentPaletteType: 'random'
};

// Предопределенные палитры для вкладки "Идеи"
const paletteIdeas = {
    warm: [
        { name: "Осенние листья", colors: ["#8c2318", "#5e8c6a", "#88a65e", "#bfb35a", "#f2c45a"] },
        { name: "Закат", colors: ["#ff7e5f", "#feb47b", "#ffcc66", "#6a4a3c", "#ee5a24"] },
        { name: "Специи", colors: ["#d16a1c", "#e87c2c", "#f39c12", "#c44e17", "#e74c3c"] }
    ],
    cool: [
        { name: "Океан", colors: ["#006994", "#2c3e50", "#3498db", "#16a085", "#27ae60"] },
        { name: "Зимняя ночь", colors: ["#2c3e50", "#34495e", "#5d6d7e", "#85929e", "#aeb6bf"] },
        { name: "Ледяные тона", colors: ["#a8daea", "#56ccf2", "#2d9cdb", "#6fc2d9", "#b3e4f5"] }
    ],
    pastel: [
        { name: "Пасхальные яйца", colors: ["#f8a5c2", "#e77a9c", "#f5d7dc", "#a3d9ff", "#b9fbc0"] },
        { name: "Сладкая вата", colors: ["#ffccee", "#ccddff", "#ffddcc", "#eeccff", "#ccffdd"] },
        { name: "Нежные тона", colors: ["#ffe0e6", "#e6f0ff", "#fff0e6", "#f0e6ff", "#e6fff0"] }
    ],
    vibrant: [
        { name: "Неоновые вывески", colors: ["#ff073a", "#ffce00", "#00ffd1", "#9600ff", "#ff0080"] },
        { name: "Фруктовый микс", colors: ["#ff3838", "#ff9f1a", "#fff200", "#32ff7e", "#18dcff"] },
        { name: "Радуга", colors: ["#ff3838", "#ff9f1a", "#fff200", "#32ff7e", "#18dcff"] }
    ]
};

// Цвета дня с описаниями
const colorOfTheDayOptions = [
    { color: "#E27D60", name: "Коралловый", description: "Теплый и жизнерадостный, напоминает закат" },
    { color: "#85DCB0", name: "Мятный", description: "Свежий и успокаивающий, как прохладный ветерок" },
    { color: "#E8A87C", name: "Персиковый", description: "Нежный и уютный, создает атмосферу тепла" },
    { color: "#41B3A3", name: "Бирюзовый", description: "Напоминает о тропических водах и летнем отдыхе" },
    { color: "#C38D9E", name: "Лавандовый", description: "Романтичный и спокойный, навевает мечты" },
    { color: "#F64C72", name: "Фуксия", description: "Энергичный и смелый, привлекает внимание" }
];

// Функция для переключения вкладок
function switchTab(tabName) {
    // Скрыть все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показать выбранную вкладку
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Обновить активную ссылку в меню
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === tabName) {
            link.classList.add('active');
        }
    });
    
    // Особые действия для определенных вкладок
    if (tabName === 'ideas') {
        loadPaletteIdeas('warm');
    } else if (tabName === 'random') {
        showColorOfTheDay();
    } else if (tabName === 'saved') {
        updateSavedPalettes();
    }
}

// Функция для генерации случайного цвета
function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// Функция для генерации теплого цвета
function getWarmColor() {
    const warmHues = [0, 15, 30, 45, 60];
    const hue = warmHues[Math.floor(Math.random() * warmHues.length)];
    const saturation = 70 + Math.floor(Math.random() * 30);
    const lightness = 40 + Math.floor(Math.random() * 40);
    return hslToHex(hue, saturation, lightness);
}

// Функция для генерации холодного цвета
function getCoolColor() {
    const coolHues = [180, 195, 210, 225, 240, 270];
    const hue = coolHues[Math.floor(Math.random() * coolHues.length)];
    const saturation = 70 + Math.floor(Math.random() * 30);
    const lightness = 40 + Math.floor(Math.random() * 40);
    return hslToHex(hue, saturation, lightness);
}

// Функция для генерации пастельного цвета
function getPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 30 + Math.floor(Math.random() * 30);
    const lightness = 70 + Math.floor(Math.random() * 20);
    return hslToHex(hue, saturation, lightness);
}

// Функция для генерации монохромной палитры
function getMonochromaticColor(baseHue) {
    if (!baseHue) baseHue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 30);
    const lightnessVariations = [30, 45, 60, 75, 90];
    const lightness = lightnessVariations[Math.floor(Math.random() * lightnessVariations.length)];
    return hslToHex(baseHue, saturation, lightness);
}

// Конвертация HSL в HEX
function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Функция для генерации новой палитры
function generatePalette() {
    const paletteType = document.getElementById('palette-type').value;
    state.currentPaletteType = paletteType;
    
    let baseHue = paletteType === 'mono' ? Math.floor(Math.random() * 360) : null;
    
    for (let i = 1; i <= 5; i++) {
        if (!state.lockedColors[i-1]) {
            let color;
            
            switch(paletteType) {
                case 'warm': color = getWarmColor(); break;
                case 'cool': color = getCoolColor(); break;
                case 'pastel': color = getPastelColor(); break;
                case 'mono': color = getMonochromaticColor(baseHue); break;
                default: color = getRandomColor();
            }
            
            document.getElementById(`color-${i}`).style.backgroundColor = color;
            document.getElementById(`code-${i}`).textContent = color;
        }
    }
}

// Функция для показа модального окна сохранения
function showSaveModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    
    document.getElementById('confirm-save').onclick = () => {
        const paletteName = document.getElementById('palette-name').value.trim();
        if (paletteName) {
            savePalette(paletteName);
            modal.style.display = 'none';
            document.getElementById('palette-name').value = '';
        } else {
            alert('Пожалуйста, введите название палитры');
        }
    };
    
    document.getElementById('cancel-save').onclick = () => {
        modal.style.display = 'none';
        document.getElementById('palette-name').value = '';
    };
}

// Функция для сохранения текущей палитры
function savePalette(paletteName) {
    const colors = Array.from({length: 5}, (_, i) => 
        document.getElementById(`code-${i+1}`).textContent
    );
    
    state.savedPalettes.push({
        name: paletteName,
        colors: colors,
        type: state.currentPaletteType,
        date: new Date().toLocaleDateString()
    });
    
    updateSavedPalettes();
    alert(`Палитра "${paletteName}" сохранена!`);
}

// Функция для копирования палитры в буфер обмена
function copyPalette() {
    const colors = Array.from({length: 5}, (_, i) => 
        document.getElementById(`code-${i+1}`).textContent
    );
    
    navigator.clipboard.writeText(colors.join(', '))
        .then(() => alert('Палитра скопирована в буфер обмена!'))
        .catch(err => console.error('Ошибка при копировании: ', err));
}

// Функция для удаления палитры
function deletePalette(index) {
    state.savedPalettes.splice(index, 1);
    updateSavedPalettes();
}

// Функция для отображения сохраненных палитр
function updateSavedPalettes() {
    const container = document.getElementById('saved-palettes-container');
    
    if (state.savedPalettes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>У вас пока нет сохраненных палитр</p></div>';
        return;
    }
    
    container.innerHTML = state.savedPalettes.map((palette, index) => {
        const colorsHTML = palette.colors.map(color => `
            <div class="color-box">
                <div class="color-preview" style="background-color: ${color};"></div>
                <span class="color-code">${color}</span>
            </div>
        `).join('');
        
        return `
            <div class="saved-palette">
                <div class="palette-header">
                    <h3>${palette.name}</h3>
                    <span class="palette-date">${palette.date}</span>
                </div>
                <div class="palette-container">${colorsHTML}</div>
                <button class="delete-btn" data-index="${index}">Удалить палитру</button>
            </div>
        `;
    }).join('');
    
    // Добавляем обработчики для кнопок удаления
    container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            deletePalette(parseInt(btn.getAttribute('data-index')));
        });
    });
}

// Функция для загрузки идей палитр
function loadPaletteIdeas(category) {
    const container = document.getElementById('ideas-container');
    
    // Активируем кнопку категории
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === category);
    });
    
    if (!paletteIdeas[category]) {
        container.innerHTML = '<p>Палитры не найдены</p>';
        return;
    }
    
    container.innerHTML = paletteIdeas[category].map(palette => {
        const colorsHTML = palette.colors.map(color => `
            <div class="color-box">
                <div class="color-preview" style="background-color: ${color};"></div>
                <span class="color-code">${color}</span>
            </div>
        `).join('');
        
        return `
            <div class="idea-palette">
                <h3>${palette.name}</h3>
                <div class="palette-container">${colorsHTML}</div>
                <button class="use-palette-btn" data-colors='${JSON.stringify(palette.colors)}'>
                    Использовать эту палитру
                </button>
            </div>
        `;
    }).join('');
    
    // Добавляем обработчики для кнопок использования палитр
    container.querySelectorAll('.use-palette-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            applyPalette(JSON.parse(btn.getAttribute('data-colors')));
            switchTab('generator');
        });
    });
}

// Функция для применения выбранной палитры
function applyPalette(colors) {
    colors.forEach((color, i) => {
        if (i < 5) {
            document.getElementById(`color-${i+1}`).style.backgroundColor = color;
            document.getElementById(`code-${i+1}`).textContent = color;
        }
    });
}

// Функция для показа цвета дня
function showColorOfTheDay() {
    const colorInfo = colorOfTheDayOptions[Math.floor(Math.random() * colorOfTheDayOptions.length)];
    
    document.getElementById('color-of-day-display').style.backgroundColor = colorInfo.color;
    document.getElementById('color-of-day-name').textContent = colorInfo.name;
    document.getElementById('color-of-day-code').textContent = colorInfo.color;
    document.getElementById('color-of-day-desc').textContent = colorInfo.description;
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Начальная генерация палитры
    generatePalette();
    
    // Обработчики для навигации
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab(this.getAttribute('data-tab'));
        });
    });
    
    // Обработчики для основных функций
    document.getElementById('generate-btn').addEventListener('click', generatePalette);
    document.getElementById('palette-type').addEventListener('change', generatePalette);
    document.getElementById('save-palette').addEventListener('click', showSaveModal);
    document.getElementById('copy-palette').addEventListener('click', copyPalette);
    document.getElementById('new-color-of-day').addEventListener('click', showColorOfTheDay);
    
    // Обработчики для блокировки цветов
    document.querySelectorAll('.lock-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            state.lockedColors[index] = !state.lockedColors[index];
            this.textContent = state.lockedColors[index] ? 'Заблокировано' : 'Разблокировано';
            this.classList.toggle('locked', state.lockedColors[index]);
        });
    });
    
    // Обработчик для переключения темы
    document.getElementById('theme-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        this.textContent = document.body.classList.contains('dark-theme') ? 
            'Светлая тема' : 'Тёмная тема';
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
    
    // Обработчик для кнопки на главной странице
    document.querySelector('.cta-button').addEventListener('click', function() {
        switchTab(this.getAttribute('data-tab'));
    });
    
    // Обработчики для кнопок категорий в идеях палитр
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            loadPaletteIdeas(this.getAttribute('data-category'));
        });
    });
    
    // Загружаем сохраненную тему
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-toggle').textContent = 'Светлая тема';
    }
    
    // Инициализируем вкладку идей палитр
    loadPaletteIdeas('warm');

});
