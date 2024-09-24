import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import schedule from 'node-schedule';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN2;
const bot2 = new TelegramBot(token, { polling: true });

// Suppress specific error message
bot2.on('polling_error', (error) => {
  if (error.code === 'ETELEGRAM' && error.message.includes('409 Conflict')) {
    // Ignore this specific error
    return;
  }
  console.error('Polling error:', error);
});

const wordsFilePath = './uploads/english_words.txt';
let englishWords = [];
let currentIndex = 0;

fs.readFile(wordsFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading english words file:', err);
    return;
  }
  englishWords = data.split('\n').map(word => word.trim() || ' ');
  
  // Schedule the first message immediately when bot starts
  sendWords();

  // Schedule subsequent messages every 8 hours
  const job = schedule.scheduleJob('0 */8 * * *', sendWords);
});

const getNextWords = (count = 9) => {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(englishWords[currentIndex]);
    currentIndex = (currentIndex + 1) % englishWords.length;
  }
  return words;
};

const chatId = process.env.TELEGRAM_CHANNEL_ID2;

const sendWords = () => {
  const words = getNextWords(9).map(word => `*${word}*`).join('\n');
  bot2.sendMessage(chatId, `Bu günün sözləri:\n\n${words}`, { parse_mode: 'Markdown' });
};

console.log('Bot2 is running...');