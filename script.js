/* =======================================================================
   ПР7: LOCALSTORAGE И БАЗА ДАННЫХ СТАТЕЙ
   ======================================================================= */

// Проверяем, есть ли сохранённые статьи в памяти браузера (LocalStorage).
// Если нет — используем дефолтные статьи (адаптированы под тему "Алгоритмика и Scratch")
let initialArticles = JSON.parse(localStorage.getItem('myBlogPosts')) || [
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


/* =======================================================================
   ПР4: ПЕРЕКЛЮЧАТЕЛЬ ТЕМ
   ======================================================================= */

const themeButton = document.getElementById('themeBtn');

themeButton.addEventListener('click', function() {
    // Переключаем класс 'dark-theme' у тега <body>
    document.body.classList.toggle('dark-theme');
    
    // Меняем текст на кнопке в зависимости от текущей темы
    if (document.body.classList.contains('dark-theme')) {
        themeButton.textContent = '☀ Светлая тема';
    } else {
        themeButton.textContent = '🌙 Тёмная тема';
    }
});


/* =======================================================================
   ПР5: ДИНАМИЧЕСКИЙ РЕНДЕРИНГ И ОБРАБОТЧИКИ СОБЫТИЙ (ПР4 + ПР5)
   ======================================================================= */

// Находим пустой контейнер, куда JavaScript будет вставлять статьи
const postsContainer = document.getElementById('postsContainer');

// Функция рендеринга: превращает массив объектов в HTML-карточки
function renderArticles(articlesArray) {
    // Очищаем контейнер перед каждым рендером, чтобы статьи не дублировались
    postsContainer.innerHTML = '';
    
    // Если ничего не найдено (например, при поиске), выводим сообщение
    if (articlesArray.length === 0) {
        postsContainer.innerHTML = '<p class="no-results">Ничего не найдено 😢 Попробуйте другой запрос.</p>';
        return; // Прерываем выполнение функции
    }
    
    // Проходим циклом по каждому объекту в массиве
    articlesArray.forEach(article => {
        // Создаём HTML-шаблон для карточки статьи (обратные кавычки `` позволяют вставлять переменные через ${})
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


// Функция для навешивания обработчиков на динамически созданные элементы
function attachEventHandlers() {
    
    // --- Обработчики для кнопок "Читать далее" ---
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    readMoreButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Находим текст, который идёт ПЕРЕД этой кнопкой
            const textBlock = btn.previousElementSibling;
            
            // Переключаем класс 'short' (свёрнут ↔ развёрнут)
            textBlock.classList.toggle('short');
            
            // Меняем текст кнопки в зависимости от состояния
            if (textBlock.classList.contains('short')) {
                btn.textContent = 'Читать далее';
            } else {
                btn.textContent = 'Свернуть';
            }
        });
    });
    
    // --- Обработчики для кнопок "Лайк" (с возможностью убрать лайк) ---
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const countSpan = button.querySelector('.like-count');
            let currentLikes = parseInt(countSpan.textContent);
            
            if (button.classList.contains('liked')) {
                // Убираем лайк
                currentLikes--;
                button.classList.remove('liked');
                button.style.backgroundColor = '#f0f0f0';
                button.style.color = '#333';
                button.style.borderColor = '#ddd';
            } else {
                // Ставим лайк
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

// Запускаем первичный рендер при загрузке страницы
renderArticles(initialArticles);


/* =======================================================================
   ПР5: ЖИВОЙ ПОИСК
   ======================================================================= */

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
        
        // Если текст найден хотя бы в одном из мест — статья проходит фильтр
        return inTitle || inText || inTags;
    });
    
    // Перерисовываем страницу с отфильтрованными статьями
    renderArticles(filteredArticles);
});


/* =======================================================================
   ПР7: ИНТЕРАКТИВНАЯ ФОРМА ДОБАВЛЕНИЯ СТАТЕЙ И LOCALSTORAGE
   ======================================================================= */

// 1. Находим форму и её элементы
const addForm = document.getElementById('addArticleForm');
const postTitleInput = document.getElementById('postTitle');
const postTextInput = document.getElementById('postText');
const postTagsInput = document.getElementById('postTags');

// 2. Слушаем событие отправки формы (submit)
addForm.addEventListener('submit', function(event) {
    // ОТМЕНЯЕМ стандартную перезагрузку страницы
    event.preventDefault();
    
    // 3. Собираем данные из полей ввода
    const titleValue = postTitleInput.value.trim();
    const textValue = postTextInput.value.trim();
    // Если теги не введены, ставим дефолтный тег
    const tagsValue = postTagsInput.value.trim() || "#информатика";
    
    // 4. Простая валидация данных (проверка длины)
    if (titleValue.length < 5) {
        alert('Ошибка: Заголовок статьи должен быть не короче 5 символов!');
        return; // Останавливает выполнение, статья не добавится
    }
    if (textValue.length < 20) {
        alert('Ошибка: Описание слишком короткое. Расскажите подробнее (минимум 20 символов)!');
        return;
    }
    
    // 5. Формируем дату для новой статьи (сегодняшний день)
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    const isoDate = today.toISOString().split('T')[0]; // Формат YYYY-MM-DD
    
    // 6. Создаем новый объект статьи (используем Date.now() для уникального ID)
    const newArticle = {
        id: Date.now(),
        title: titleValue,
        date: formattedDate,
        isoDate: isoDate,
        text: textValue,
        tags: tagsValue
    };
    
    // 7. ДОБАВЛЯЕМ СТАТЬЮ В НАЧАЛО МАССИВА
    initialArticles.unshift(newArticle);
    
    // 8. СОХРАНЯЕМ обновленный массив в LocalStorage браузера (превращаем в строку JSON)
    localStorage.setItem('myBlogPosts', JSON.stringify(initialArticles));
    
    // 9. ОБНОВЛЯЕМ ИНТЕРФЕЙС (перерисовываем список статей)
    renderArticles(initialArticles);
    
    // 10. Очищаем поля формы для следующей записи
    addForm.reset();
    
    // Плавная прокрутка к новой статье
    document.getElementById('postsContainer').scrollIntoView({ behavior: 'smooth' });
});