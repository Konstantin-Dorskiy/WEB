/* =======================================================================
   ПР8: СЕРВЕР НА EXPRESS + БАЗА ДАННЫХ SQLITE
   ======================================================================= */

const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Подключаем SQLite

const app = express();
const PORT = 3000;

// Middleware для обработки JSON-данных (нужно для POST-запросов)
app.use(express.json());

// Раздаём статические файлы из папки 'public'
app.use(express.static('public'));

// 1. Инициализация базы данных SQLite (файл database.db создастся автоматически в корне)
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('❌ Ошибка подключения к БД:', err.message);
    } else {
        console.log('✅ Подключено к базе данных SQLite');
        
        // Создаём таблицу articles, если её ещё нет
        db.run(`CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            isoDate TEXT NOT NULL,
            text TEXT NOT NULL,
            tags TEXT
        )`, (err) => {
            if (err) {
                console.error('❌ Ошибка создания таблицы:', err.message);
            } else {
                console.log('✅ Таблица "articles" готова');
                
                // Проверяем, пуста ли таблица, и если да — добавляем начальные данные
                db.get("SELECT COUNT(*) as count FROM articles", (err, row) => {
                    if (row.count === 0) {
                        const initialArticles = [
                            { title: "Что такое алгоритм? Примеры из жизни", date: "19 сентября 2026", isoDate: "2026-09-19", text: "Алгоритм — это последовательность действий для достижения цели. Мы сталкиваемся с ними каждый день: рецепт бутерброда, маршрут до школы или инструкция по сборке LEGO.", tags: "#алгоритм #информатика #5класс" },
                            { title: "Создаём первую игру в Scratch", date: "15 сентября 2026", isoDate: "2026-09-15", text: "Сегодня на уроке мы написали наш первый алгоритм для кота из Scratch. Мы использовали блоки из раздела «Движение».", tags: "#scratch #программирование #игры" },
                            { title: "Циклы и переменные: делаем игру сложнее", date: "10 сентября 2026", isoDate: "2026-09-10", text: "Чтобы игра стала интереснее, мы добавляем переменные для счёта и используем циклы 'повторять всегда'.", tags: "#циклы #переменные #scratch" }
                        ];
                        
                        const stmt = db.prepare("INSERT INTO articles (title, date, isoDate, text, tags) VALUES (?, ?, ?, ?, ?)");
                        initialArticles.forEach(article => {
                            stmt.run(article.title, article.date, article.isoDate, article.text, article.tags);
                        });
                        stmt.finalize();
                        console.log('✅ Начальные данные добавлены в БД');
                    }
                });
            }
        });
    }
});

// 2. API: Получить все статьи (GET)
app.get('/api/articles', (req, res) => {
    db.all("SELECT * FROM articles ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// 3. API: Добавить новую статью (POST)
app.post('/api/articles', (req, res) => {
    const { title, text, tags } = req.body;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    const isoDate = today.toISOString().split('T')[0];
    const finalTags = tags || "#информатика";

    const sql = "INSERT INTO articles (title, date, isoDate, text, tags) VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [title, formattedDate, isoDate, text, finalTags], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Возвращаем созданную статью с её новым ID
        res.json({ 
            id: this.lastID, 
            title, 
            date: formattedDate, 
            isoDate, 
            text, 
            tags: finalTags 
        });
    });
});

// 4. Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер успешно запущен!`);
    console.log(`🌐 Сайт: http://localhost:${PORT}`);
    console.log(`📡 API статей: http://localhost:${PORT}/api/articles`);
});