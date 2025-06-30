
let entries = JSON.parse(localStorage.getItem('entries') || '[]');
let counter = parseFloat(localStorage.getItem('counter') || '0');
let selectedEmojiType = 'star';
let nameSuggestions = JSON.parse(localStorage.getItem('nameSuggestions') || '[]');

// Создание круга с эмодзи
function createCircle(type, zIndex, half = false, opacity = 1) {
    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.style.backgroundColor = type === 'star' ? '#fff8dc' : '#ffeaea';
    circle.style.zIndex = zIndex;

    const emoji = document.createElement('span');
    emoji.textContent = type === 'star' ? '⭐' : '😡';
    emoji.style.opacity = opacity;
    circle.appendChild(emoji);

    return circle;
}

// Обновление отображения результата
function updateResult() {
    const container = document.getElementById('resultDisplay');
    container.innerHTML = '';

    const absCount = Math.abs(counter);
    const type = counter >= 0 ? 'star' : 'x';

    // Показываем только одну цифру после запятой
    const displayCount = absCount.toFixed(1);

    // Целая и дробная часть
    const intPart = Math.floor(absCount);
    const fracPart = absCount - intPart;

    for (let i = 0; i < intPart; i++) {
        container.appendChild(createCircle(type, i + 1));
    }
    if (fracPart >= 0.05) {
        container.appendChild(createCircle(type, intPart + 1, false, fracPart));
    }

    const count = document.createElement('div');
    count.className = 'result-count';
    count.textContent = displayCount;
    if (absCount > 0) {
        count.textContent = "x" + count.textContent;
    }
    container.appendChild(count);
}

// Рисуем таблицу истории
function renderList() {
    const list = document.getElementById('entryList');
    list.innerHTML = `
        <thead><tr><th>Дата</th><th class="text-cell">Название</th><th class="emoji-cell">Эмодзи</th></tr></thead>
        <tbody>
        ${entries.slice().reverse().map(e => {
            const intPart = Math.floor(Math.abs(e.count));
            const fracPart = Math.abs(e.count) - intPart;
            let icons = '';
            for (let i = 0; i < intPart; i++) {
                icons += `<div class="circle"><span style="opacity:1">${e.type === 'star' ? '⭐' : '😡'}</span></div>`;
            }
            if (fracPart >= 0.05) {
                icons += `<div class="circle"><span style="opacity:${fracPart}">${e.type === 'star' ? '⭐' : '😡'}</span></div>`;
            }
            return `
              <tr>
                <td>${e.date}</td>
                <td class="text-cell">${e.name}</td>
                <td class="emoji-cell">
                  ${icons}
                </td>
              </tr>
            `;
        }).join('')}
        </tbody>
      `;
}

// Выбор эмодзи
function selectEmoji(type) {
    selectedEmojiType = type;
    document.querySelectorAll('.emoji-option').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.emoji-option[data-type="${type}"]`).classList.add('selected');
}

// Сохранение имени для автозаполнения
function saveNameSuggestion(name) {
    if (!name) return;
    if (!nameSuggestions.includes(name)) {
        nameSuggestions.push(name);
        localStorage.setItem('nameSuggestions', JSON.stringify(nameSuggestions));
    }
}

// Подсказки при вводе
function showAutocompleteList(value) {
    const list = document.getElementById('autocompleteList');
    if (!value) return (list.style.display = 'none', list.innerHTML = '');
    const matches = nameSuggestions.filter(n => n.toLowerCase().includes(value.toLowerCase()));
    if (!matches.length) return (list.style.display = 'none', list.innerHTML = '');
    list.innerHTML = matches.map((n, i) => `<div class="autocomplete-item">${n}</div>`).join('');
    list.style.display = 'block';
}

function hideAutocompleteList() {
    document.getElementById('autocompleteList').style.display = 'none';
}

document.getElementById('entryName').addEventListener('input', e => showAutocompleteList(e.target.value));
document.getElementById('entryName').addEventListener('blur', () => setTimeout(hideAutocompleteList, 150));
document.getElementById('autocompleteList').addEventListener('mousedown', e => {
    if (e.target.classList.contains('autocomplete-item')) {
        document.getElementById('entryName').value = e.target.textContent;
        hideAutocompleteList();
    }
});

// Поддержка стрелок вверх/вниз и Enter
document.getElementById('entryName').addEventListener('keydown', function (e) {
    const list = document.getElementById('autocompleteList');
    const items = [...list.querySelectorAll('.autocomplete-item')];
    let idx = items.findIndex(item => item.classList.contains('active'));
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (idx >= 0) items[idx].classList.remove('active');
        idx = (idx + 1) % items.length;
        items[idx].classList.add('active');
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (idx >= 0) items[idx].classList.remove('active');
        idx = (idx - 1 + items.length) % items.length;
        items[idx].classList.add('active');
    } else if (e.key === 'Enter' && idx >= 0) {
        this.value = items[idx].textContent;
        hideAutocompleteList();
        e.preventDefault();
    }
});

// Добавление новой записи
function addEntry() {
    const name = document.getElementById('entryName').value.trim();
    const cnt = parseFloat(document.getElementById('entryCount').value.replace(',', '.'));
    if (!name || isNaN(cnt) || cnt < 0.1 || !selectedEmojiType) {
        alert('Введите название, число (0.1+) и выберите тип эмодзи.');
        return;
    }

    saveNameSuggestion(name);
    const type = selectedEmojiType;
    const now = new Date();
    const date = `${now.getDate()}.${now.getMonth() + 1}`;

    entries.push({ name, type, count: cnt, date });
    counter += type === 'star' ? cnt : -cnt;

    saveAndRefresh();
    selectEmoji('star'); // Сброс выбора
}

// Очистка истории
function clearHistory() {
    if (confirm('Вы уверены, что хотите очистить историю?')) {
        entries = [];
        localStorage.removeItem('entries');
        renderList();
    }
}

// Сохраняем в localStorage и обновляем интерфейс
function saveAndRefresh() {
    localStorage.setItem('entries', JSON.stringify(entries));
    localStorage.setItem('counter', counter.toString());
    document.getElementById('entryName').value = '';
    document.getElementById('entryCount').value = '1';
    renderList();
    updateResult();
}

// Связываем кнопки
document.getElementById('saveBtn').onclick = addEntry;
document.getElementById('clearHistoryBtn').onclick = clearHistory;

// Инициализация
selectEmoji('star');
renderList();
updateResult();

