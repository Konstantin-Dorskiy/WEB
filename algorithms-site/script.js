/* =======================================================================
   ПР4: ИНТЕРАКТИВНОСТЬ (ТЕМЫ, ЛАЙКИ, СВЁРТКА ТЕКСТА)
   ======================================================================= */

// --- ЗАДАНИЕ 1: ПЕРЕКЛЮЧАТЕЛЬ ТЕМ ---
const themeButton = document.getElementById('themeBtn');

themeButton.addEventListener('click', function() {
    // Переключаем класс 'dark-theme' у тега <body> (если есть - уберёт, если нет - добавит)
    document.body.classList.toggle('dark-theme');
    
    // Меняем текст на кнопке в зависимости от текущей темы
    if (document.body.classList.contains('dark-theme')) {
        themeButton.textContent = '☀ Светлая тема';
    } else {
        themeButton.textContent = '🌙 Тёмная тема';
    }
});


// --- ЗАДАНИЕ 2: СЧЁТЧИК ЛАЙКОВ (с возможностью убрать лайк) ---

// Находим ВСЕ кнопки лайков на странице
const likeButtons = document.querySelectorAll('.like-btn');

// Проходимся по каждой кнопке в цикле
likeButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        // Находим счётчик именно внутри ЭТОЙ нажатой кнопки
        const countSpan = button.querySelector('.like-count');
        
        // Превращаем текст "0" в число
        let currentLikes = parseInt(countSpan.textContent);
        
        // Проверяем, лайкнута ли уже эта статья (есть ли класс 'liked')
        if (button.classList.contains('liked')) {
            // Если уже лайкнута — УБИРАЕМ лайк
            currentLikes--; // Уменьшаем счётчик на 1
            button.classList.remove('liked'); // Убираем класс 'liked'
            
            // Возвращаем исходные стили кнопки (серая)
            button.style.backgroundColor = '#f0f0f0';
            button.style.color = '#333';
            button.style.borderColor = '#ddd';
        } else {
            // Если не лайкнута — СТАВИМ лайк
            currentLikes++; // Увеличиваем счётчик на 1
            button.classList.add('liked'); // Добавляем класс 'liked'
            
            // Меняем стили кнопки на красные
            button.style.backgroundColor = '#e74c3c';
            button.style.color = 'white';
            button.style.borderColor = '#e74c3c';
        }
        
        // Записываем новое число обратно в HTML
        countSpan.textContent = currentLikes;
    });
});
// --- ЗАДАНИЕ 3: СВЁРТКА/РАЗВЁРТКА ТЕКСТА ---
// Находим ВСЕ кнопки «Читать далее»
const readMoreButtons = document.querySelectorAll('.read-more-btn');

readMoreButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
        // Находим текст, который идёт ПЕРЕД этой кнопкой (предыдущий соседний элемент)
        const textBlock = btn.previousElementSibling;
        
        // Переключаем класс 'short' (свёрнут ↔ развёрнут)
        textBlock.classList.toggle('short');
        
        // Меняем текст кнопки
        if (textBlock.classList.contains('short')) {
            btn.textContent = 'Читать далее';
        } else {
            btn.textContent = 'Свернуть';
        }
    });
});
/* =======================================================================
   ПР5: ДИНАМИЧЕСКИЙ РЕНДЕРИНГ И ЖИВОЙ ПОИСК
   ======================================================================= */

// 1. Имитация базы данных статей (Массив объектов)
// Данные адаптированы под тему "Алгоритмика 5 класс"
const initialArticles = [
    {
        id: 1,
        title: "Что такое алгоритм? Примеры из жизни",
        date: "19 сентября 2026",
        isoDate: "2026-09-19",
        text: "Алгоритм — это последовательность действий для достижения цели. Мы сталкиваемся с ними каждый день: рецепт бутерброда, маршрут до школы или инструкция по сборке LEGO. У любого алгоритма есть важные свойства: понятность, точность и конечность. В информатике алгоритмы помогают нам управлять компьютером. А в Scratch мы превращаем эти алгоритмы в настоящие игры!",
        tags: "#алгоритм #информатика #5класс"
    },
    {
        id: 2,
        title: "Создаём первую игру в Scratch",
        date: "15 сентября 2026",
        isoDate: "2026-09-15",
        text: "Сегодня на уроке мы написали наш первый алгоритм для кота из Scratch. Мы использовали блоки из раздела «Движение». Алгоритм получился простым: когда зелёный флаг нажат, двигаться 10 шагов и оттолкнуться от края. Теперь наш кот бесконечно бегает по экрану! Это и есть основа программирования.",
        tags: "#scratch #программирование #игры"
    },
    {
        id: 3,
        title: "Циклы и переменные: делаем игру сложнее",
        date: "10 сентября 2026",
        isoDate: "2026-09-10",
        text: "Чтобы игра стала интереснее, мы добавляем переменные для счёта и используем циклы 'повторять всегда'. Это позволяет создавать бесконечные игровые процессы и отслеживать очки игрока в реальном времени. В Scratch это блоки из раздела 'Управление' и 'Данные'.",
        tags: "#циклы #переменные #scratch"
    }
];

// 2. Находим пустой контейнер, куда будем вставлять статьи
const postsContainer = document.getElementById('postsContainer');

// 3. Функция рендеринга (превращает данные в HTML)
function renderArticles(articlesArray) {
    // Очищаем контейнер перед каждым рендером, чтобы статьи не дублировались
    postsContainer.innerHTML = '';
    
    // Если ничего не найдено, выводим сообщение
    if (articlesArray.length === 0) {
        postsContainer.innerHTML = '<p class="no-results">Ничего не найдено 😢 Попробуйте другой запрос.</p>';
        return; // Прерываем выполнение функции
    }
    
    // Проходим циклом по каждому объекту в массиве
    articlesArray.forEach(article => {
        // Создаем HTML-шаблон для карточки статьи (используем обратные кавычки ``)
        const articleHtml = `
            <article>
                <h3>${article.title}</h3>
                <p>Опубликовано: <time datetime="${article.isoDate}">${article.date}</time></p>
                
                <p class="article-text short">${article.text}</p>
                <button class="read-more-btn">Читать далее</button>
                
                <p>Теги: ${article.tags}</p>
                <button class="like-btn">❤ Лайк (<span class="like-count">0</span>)</button>
            </article>
        `;
        // Вставляем сгенерированный HTML внутрь контейнера в конец
        postsContainer.insertAdjacentHTML('beforeend', articleHtml);
    });
    
    // ВАЖНО: После рендеринга нужно заново навесить обработчики событий на новые кнопки!
    attachEventHandlers();
}

// 4. Функция для навешивания обработчиков на динамически созданные элементы
function attachEventHandlers() {
    // Обработчики для кнопок "Читать далее"
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    readMoreButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const textBlock = btn.previousElementSibling;
            textBlock.classList.toggle('short');
            if (textBlock.classList.contains('short')) {
                btn.textContent = 'Читать далее';
            } else {
                btn.textContent = 'Свернуть';
            }
        });
    });
    
    // Обработчики для кнопок "Лайк"
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const countSpan = button.querySelector('.like-count');
            let currentLikes = parseInt(countSpan.textContent);
            
            if (button.classList.contains('liked')) {
                currentLikes--;
                button.classList.remove('liked');
                button.style.backgroundColor = '#f0f0f0';
                button.style.color = '#333';
                button.style.borderColor = '#ddd';
            } else {
                currentLikes++;
                button.classList.add('liked');
                button.style.backgroundColor = '#e74c3c';
                button.style.color = 'white';
                button.style.borderColor = '#e74c3c';
            }
            
            countSpan.textContent = currentLikes;
        });
    });
}

// 5. Запускаем первичный рендер при загрузке страницы
renderArticles(initialArticles);


// 6. Реализация «живого поиска» (поиск по заголовку, тексту и тегам)
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function(event) {
    // Переводим введенный текст в нижний регистр и убираем пробелы по краям
    const searchText = event.target.value.toLowerCase().trim();
    
    // Фильтруем массив статей
    const filteredArticles = initialArticles.filter(article => {
        // Проверяем, содержится ли текст в заголовке, тексте или тегах
        const inTitle = article.title.toLowerCase().includes(searchText);
        const inText = article.text.toLowerCase().includes(searchText);
        const inTags = article.tags.toLowerCase().includes(searchText);
        
        // Если текст найден хотя бы в одном из мест — статья проходит фильтр (возвращаем true)
        return inTitle || inText || inTags;
    });
    
    // Перерисовываем страницу с отфильтрованными статьями
    renderArticles(filteredArticles);
});