const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// 1) Вставь сюда токен, который дал тебе BotFather:
const BOT_TOKEN = '8098795168:AAF-M_UuQ-SJTWIaGhxz8SAdMdzpz-IWROM';
// 2) В процессе деплоя на Render переменная WEB_APP_URL будет из process.env
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://greenlightcasino.onrender.com';  // замените на ваш действующий URL

const bot = new Telegraf(BOT_TOKEN);
const app = express();

// Обслуживаем статические файлы (index.html и т.п.)
app.use(express.static(path.join(__dirname)));
// Для safety JSON parsing (если понадобится)
app.use(bodyParser.json());

// Простая проверка, что сервер жив
app.get('/health', (_req, res) => res.send('OK'));

// Команда /start: шлём кнопку WebApp
bot.start(ctx => {
  return ctx.reply('🎲 Добро пожаловать в казино!', {
    reply_markup: {
      inline_keyboard: [[
        { text: '🎰 Открыть казино', web_app: { url: 'https://greenlightcasino.onrender.com' } }
      ]]
    }
  });
});

// Запускаем бота
bot.launch().then(() => console.log('Bot started'));

// Запускаем веб-сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
