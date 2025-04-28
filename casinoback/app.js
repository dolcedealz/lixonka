import express from 'express';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';

dotenv.config();

const app = express();
const db = new Database('casino.db');

app.use(express.json());

// Создание таблицы users, если её ещё нет
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT UNIQUE,
    balance INTEGER DEFAULT 0,
    win_chance REAL DEFAULT 0.5
  )
`).run();

// Эндпоинт: получить всю информацию о пользователе
app.get('/user/:telegram_id', (req, res) => {
  const { telegram_id } = req.params;
  const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegram_id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Эндпоинт: создать или обновить пользователя
app.post('/user', (req, res) => {
  const { telegram_id, balance, win_chance } = req.body;
  if (!telegram_id) {
    return res.status(400).json({ error: 'telegram_id is required' });
  }

  // Обновляем или вставляем нового пользователя
  db.prepare(`
    INSERT INTO users (telegram_id, balance, win_chance)
    VALUES (?, ?, ?)
    ON CONFLICT(telegram_id) DO UPDATE SET
      balance = excluded.balance,
      win_chance = excluded.win_chance
  `).run(telegram_id, balance || 0, win_chance || 0.5);

  res.json({ success: true });
});

// Эндпоинт: обновить баланс пользователя
app.post('/user/:telegram_id/balance', (req, res) => {
  const { telegram_id } = req.params;
  const { balance } = req.body;

  if (typeof balance !== 'number') {
    return res.status(400).json({ error: 'balance must be a number' });
  }

  db.prepare('UPDATE users SET balance = ? WHERE telegram_id = ?').run(balance, telegram_id);

  res.json({ success: true });
});

// Запускаем сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
