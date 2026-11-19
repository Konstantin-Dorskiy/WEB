/* =======================================================================
   ПР8: ФРОНТЕНД, РАБОТАЮЩИЙ С СЕРВЕРОМ (FETCH API)
   ======================================================================= */

// Глобальная переменная для хранения текущих статей (нужна для поиска)
let currentArticles = [];

// Элементы DOM
const postsContainer = document.getElementById('postsContainer');
const addForm = document.getElementById('addArticleForm');
const postTitleInput = document.getElementById('postTitle');
const postTextInput = document.getElementById('postText');
const postTagsInput = document.getElementById('postTags');
const searchInput = document.getElementById('searchInput');
const themeButton = document.getElementById('themeBtn');


/* =======================================================================
   1. ЗАГРУЗКА СТАТЕЙ С СЕРВЕРА
   ======================================================================= */
async function loadArticles() {
    try {
        // Делаем GET-запрос к нашему серверу
        const response = await fetch('/api/articles');
        if (!response.ok) throw new Error('Ошибка сети');
        
        // Преобразуем ответ сервера из JSON в JavaScript-массив
        currentArticles = await response.json();
        
        // Отрисовываем полученные статьи
        renderArticles(currentArticles);
    } catch (error) {
        console.error('❌ Не удалось загрузить статьи:', error);
        postsContainer.innerHTML = '<p class="no-results">Ошибка загрузки данных с сервера 😢</p>';
    }
}


/* =======================================================================
   2. ОТРИСОВКА (РЕНДЕРИНГ) СТАТЕЙ
   ======================================================================= */
function renderArticles(articlesArray) {
    postsContainer.innerHTML = '';
    
    if (articlesArray.length === 0) {
        postsContainer.innerHTML = '<p class="no-results">Ничего не найдено 😢 Попробуйте другой запрос.</p>';
        return;
    }
    
    articlesArray.forEach(article => {
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
        postsContainer.insertAdjacentHTML('beforeend', articleHtml);
    });
    
    // Переназначаем обработчики событий на новые кнопки
    attachEventHandlers();
}


/* =======================================================================
   3. ДОБАВЛЕНИЕ НОВОЙ СТАТЬИ ЧЕРЕЗ СЕРВЕР (POST-запрос)
   ======================================================================= */
addForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Отменяем стандартную перезагрузку
    
    const titleValue = postTitleInput.value.trim();
    const textValue = postTextInput.value.trim();
    const tagsValue = postTagsInput.value.trim() || "#информатика";
    
    // Валидация
    if (titleValue.length < 5) {
        alert('Ошибка: Заголовок должен быть не короче 5 символов!');
        return;
    }
    if (textValue.length < 20) {
        alert('Ошибка: Описание слишком короткое (минимум 20 символов)!');
        return;
    }
    
    // Формируем данные для отправки на сервер
    const newArticleData = {
        title: titleValue,
        text: textValue,
        tags: tagsValue
        // Дату и ID сервер сгенерирует сам!
    };
    
    try {
        // Отправляем POST-запрос на сервер
        const response = await fetch('/api/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Сообщаем серверу, что отправляем JSON
            },
            body: JSON.stringify(newArticleData) // Превращаем объект в строку JSON
        });
        
        if (response.ok) {
            addForm.reset(); // Очищаем форму
            await loadArticles(); // Перезагружаем список статей с сервера
            document.getElementById('postsContainer').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('Ошибка при сохранении статьи');
        }
    } catch (error) {
        console.error('❌ Ошибка отправки:', error);
        alert('Не удалось связаться с сервером');
    }
});


/* =======================================================================
   4. ЖИВОЙ ПОИСК (работает с массивом currentArticles)
   ======================================================================= */
searchInput.addEventListener('input', function(event) {
    const searchText = event.target.value.toLowerCase().trim();
    
    const filteredArticles = currentArticles.filter(article => {
        const inTitle = article.title.toLowerCase().includes(searchText);
        const inText = article.text.toLowerCase().includes(searchText);
        const inTags = article.tags.toLowerCase().includes(searchText);
        return inTitle || inText || inTags;
    });
    
    renderArticles(filteredArticles);
});


/* =======================================================================
   5. ОБРАБОТЧИКИ СОБЫТИЙ (Лайки и "Читать далее")
   ======================================================================= */
function attachEventHandlers() {
    // Кнопки "Читать далее"
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    readMoreButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const textBlock = btn.previousElementSibling;
            textBlock.classList.toggle('short');
            btn.textContent = textBlock.classList.contains('short') ? 'Читать далее' : 'Свернуть';
        });
    });
    
    // Кнопки "Лайк"
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
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


/* =======================================================================
   6. ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
   ======================================================================= */
themeButton.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    themeButton.textContent = document.body.classList.contains('dark-theme') ? '☀ Светлая тема' : '🌙 Тёмная тема';
});


// 🚀 ЗАПУСК: Загружаем статьи при открытии страницы
loadArticles();