import express from 'express';
import { fork } from 'child_process';

// Express uygulaması
const app = express();
const port = 8000;

// Bot işlemlerini başlatan fonksiyon


// Ana sayfa route'u
app.get('/', (req, res) => {
    res.send('Hello World');
});

// About sayfası route'u
app.get('/about', (req, res) => {
    res.send('About route 🎉');
});


function startBotProcesses() {
    const bot1Process = fork('./bot.js');
    bot1Process.on('message', (message) => {
        console.log('Message from bot.js:', message);
    });

    const bot2Process = fork('./bot2.js');
    bot2Process.on('message', (message) => {
        console.log('Message from bot2.js:', message);
    });
}

// Bot işlemlerini başlat
startBotProcesses();

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});
