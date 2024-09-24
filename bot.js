import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import schedule from 'node-schedule';
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Suppress specific error message
bot.on('polling_error', (error) => {
  if (error.code === 'ETELEGRAM' && error.message.includes('409 Conflict')) {
    // Ignore this specific error
    return;
  }
  console.error('Polling error:', error);
});

const wordsFilePath = './uploads/polish_words.txt';
let polishWords = [];
let currentIndex = 0;

fs.readFile(wordsFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading Polish words file:', err);
    return;
  }
  polishWords = data.split('\n').map(word => word.trim()).filter(word => word);
  sendWords();
});

const getNextWords = (count = 5) => {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(polishWords[currentIndex]);
    currentIndex = (currentIndex + 1) % polishWords.length;
  }
  return words;
};

const chatId = process.env.TELEGRAM_CHANNEL_ID;

const sendWords = () => {
  const words = getNextWords().map(word => `*${word}*`).join('\n');
  bot.sendMessage(chatId, `Bu günün sözləri:\n\n${words}`, { parse_mode: 'Markdown' });
};

const job = schedule.scheduleJob('0 */8 * * *', sendWords);

console.log('Bot is running...');