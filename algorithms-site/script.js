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