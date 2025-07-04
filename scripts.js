
let entries = JSON.parse(localStorage.getItem('entries') || '[]');
let counter = parseFloat(localStorage.getItem('counter'));
if (isNaN(counter)) counter = 0;
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


function myIncrease(intcrease) {
    const myEntryCount = document.getElementById('entryCount');
    myEntryCount.value = (Number(myEntryCount.value) + intcrease).toFixed(1)

}



// Обновление отображения результата
function updateResult() {
    const absCount = Math.abs(counter);
    const countInt = Math.floor(absCount);
    const countDecimal = absCount.toFixed(1);
    const percents = countDecimal - countInt; // .1

    const myCounter = document.getElementById('myCounter')
    myCounter.innerHTML = '';
    let myIcons = '';

    if (countDecimal < 0.1) { // score is zero
        myIcons += `<div class="zero"><div></div><img src="img/counter/zero.png"></div>`;
    } else {
        for (let i = 0; i < countInt; i++) {
            if (counter > 0) { // positive
                myIcons += `<div class="positive"><div></div><img src="img/counter/positive.png"></div>`;
            } else { // negative
                myIcons += `<div class="negative"><div></div><img src="img/counter/negative.png"></div>`;
            }
        }
    }

    const percent = 100 - Math.floor(percents * 100);
    if (percents > 0) {
        if (counter > 0) { // positive
            myIcons += `<div class="positive"><div></div><img style="clip-path: inset(0 ${percent}% 0 0);" src="img/counter/positive.png"></div>`;
        } else { // negative
            myIcons += `<div class="negative"><div></div><img style="clip-path: inset(0 ${percent}% 0 0);" src="img/counter/negative.png"></div>`;
        }
    }
    myCounter.innerHTML = myIcons;

    const myScore = document.getElementById('myScore');
    myScore.innerHTML = countDecimal;
}


// Рисуем таблицу истории
function renderList() {
    const list = document.getElementById('entryList');
    list.innerHTML = `
        <thead>
            <tr>
                <th>Дата</th>
                <th class="text-cell">Название</th>
                <th class="emoji-cell">Эмодзи</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
        ${entries.slice().reverse().map((e, idx) => {
        const intPart = Math.floor(Math.abs(e.count));
        const fracPart = Math.abs(e.count) - intPart;
        const displayValue = (intPart + fracPart).toFixed(1);
        let icons = '';
        for (let i = 0; i < intPart; i++) {
            icons += `<div class="circle"><span style="opacity:1">${e.type === 'star' ? '⭐' : '😡'}</span></div>`;
        }
        if (fracPart >= 0.05) {
            icons += `<div class="circle"><span style="opacity:${fracPart}">${e.type === 'star' ? '⭐' : '😡'}</span></div>`;
        }
        // Индекс для удаления с учётом reverse
        const realIdx = entries.length - 1 - idx;
        return `
              <tr>
                <td>${e.date}</td>
                <td class="text-cell">
                  <span
                  onclick="alert('${displayValue}')" 
                  class="history-name" 
                        data-count="${intPart + (fracPart >= 0.05 ? 1 : 0)}" 
                        data-opacity="${fracPart}" 
                        data-type="${e.type}" >
                    ${e.name}
                  </span>
                </td>
                <td class="emoji-cell">${icons}</td>
                <td>
                  <button class="delete-entry-btn" data-idx="${realIdx}" title="Удалить" style="background:none;border:none;cursor:pointer;font-size:18px;">🗑️</button>
                </td>
              </tr>
            `;
    }).join('')}
        </tbody>
      `;

    // Обработчик для названия
    list.querySelectorAll('.delete-entry-btn').forEach(btn => {
        btn.onclick = function () {
            const idx = parseInt(this.dataset.idx, 10);
            const entry = entries[idx];
            if (!entry) return;

            // 1. Подтверждение удаления
            if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;

            // 2. Второй диалог
            if (confirm('Повлияет ли это на общий счётчик?')) {
                // Да — изменить счётчик
                counter += entry.type === 'star' ? -entry.count : entry.count;
            }
            // В любом случае удаляем запись
            entries.splice(idx, 1);
            saveAndRefresh();
        };
    });
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

function showEmojiInfo(count, opacityLevel, type) {
    if (opacityLevel > 0 && opacityLevel != 10) {
        //alert(count + " h " + opacityLevel)
        count = count - 1
    }
    //opacityLevel
    let value = opacityLevel === 10 ? `${count}` : `${count}.${opacityLevel}`;
    document.getElementById('emojiInfoContent').textContent = value;
    document.getElementById('emojiInfoModal').style.display = 'flex';
}

// Закрыть модальное окно
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('closeEmojiInfoModal').onclick = function () {
        document.getElementById('emojiInfoModal').style.display = 'none';
    };
    document.getElementById('emojiInfoModal').onclick = function (e) {
        if (e.target === this) this.style.display = 'none';
    };
});


// Связываем кнопки
document.getElementById('saveBtn').onclick = addEntry;
document.getElementById('clearHistoryBtn').onclick = clearHistory;
document.getElementById('resetCounterBtn').onclick = function () {
    if (confirm('Сбросить общий счётчик на 0?')) {
        counter = 0;
        localStorage.setItem('counter', '0');
        updateResult();
    }
};
document.getElementById('exportHistoryBtn').onclick = function () {
    const data = JSON.stringify(entries, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'history.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};


// #region myCalc

function myCalc(myEvent) {
    const inputMain = document.getElementById('inputMain');
    const inputPreview = document.getElementById('inputPreview');
    const inputCounter = document.getElementById('entryCount');

    if (myEvent == 'done') {
        inputCounter.value = inputPreview.value
    } else if (myEvent == 'X') {

    } else if (myEvent == '') {
        inputMain.value += myEvent
        inputPreview.value = eval(inputMain.value)
    } else if (myEvent == '<-') {
        inputMain.value = inputMain.value.slice(0, -1)
        inputPreview.value = eval(inputMain.value)
    } else {
        inputMain.value += myEvent
        inputPreview.value = eval(inputMain.value)
    }


}




// #endregion















// Инициализация
selectEmoji('star');
renderList();
updateResult();

