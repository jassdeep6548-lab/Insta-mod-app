const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = '8932440611:AAGqp_v5NiQAlLZpHrLXjfOp44J3q6_fcnU';
const FIREBASE_URL = 'https://insight-editor-1f338-default-rtdb.asia-southeast1.firebasedatabase.app/';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

function generateKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
        if (i > 0 && i % 4 === 0) result += '-';
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

bot.onText(/\/genkey (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const days = parseInt(match[1]);

    if (isNaN(days) || days <= 0) {
        return bot.sendMessage(chatId, "⚠️ ਦਿਨ ਸਹੀ ਲਿਖੋ! ਉਦਾਹਰਨ: `/genkey 30`", { parse_mode: 'Markdown' });
    }

    const key = generateKey();
    const keyData = {
        days: days,
        status: "unused",
        createdAt: Date.now()
    };

    try {
        await fetch(`${FIREBASE_URL}/keys/${key}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(keyData)
        });

        bot.sendMessage(chatId, `✅ *Key Generated Successfully!*\n\n🔑 Key: \`${key}\`\n⏳ Validity: ${days} Days\n📌 Status: Unused`, { parse_mode: 'Markdown' });
    } catch (err) {
        bot.sendMessage(chatId, "❌ Key ਸੇਵ ਕਰਨ 'ਚ ਏਰਰ ਆਇਆ!");
    }
});

console.log("Bot is running...");
