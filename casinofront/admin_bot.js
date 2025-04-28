import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config({ path: './datad.env' });

const bot = new Telegraf(process.env.ADMIN_BOT_TOKEN);

const users = {}; // Словарь для хранения пользователей и их балансов

// Команда для получения списка всех пользователей
bot.command('users', (ctx) => {
  let userList = 'Список пользователей:\n';
  for (const userId in users) {
    userList += `ID: ${userId}, Баланс: ${users[userId].balance}, Шанс: ${users[userId].chance}%\n`;
  }
  ctx.reply(userList || 'Нет пользователей.');
});

// Команда для изменения баланса
bot.command('setbalance', (ctx) => {
  const args = ctx.message.text.split(' ');
  const userId = args[1];
  const balance = parseInt(args[2]);

  if (!userId || isNaN(balance)) {
    return ctx.reply('Пожалуйста, укажите ID пользователя и новый баланс. Пример: /setbalance 12345 1000');
  }

  if (!users[userId]) {
    users[userId] = { balance: 0, chance: 50 }; // Инициализация нового пользователя, если его нет
  }

  users[userId].balance = balance;
  ctx.reply(`Баланс пользователя ${userId} изменен на ${balance}.`);
});

// Команда для изменения шанса победы
bot.command('setchance', (ctx) => {
  const args = ctx.message.text.split(' ');
  const userId = args[1];
  const chance = parseInt(args[2]);

  if (!userId || isNaN(chance)) {
    return ctx.reply('Пожалуйста, укажите ID пользователя и новый шанс. Пример: /setchance 12345 60');
  }

  if (!users[userId]) {
    users[userId] = { balance: 0, chance: 50 }; // Инициализация нового пользователя, если его нет
  }

  users[userId].chance = chance;
  ctx.reply(`Шанс победы пользователя ${userId} изменен на ${chance}%.`);
});

// Запуск бота
bot.launch().then(() => {
  console.log('Admin bot is running...');
});
