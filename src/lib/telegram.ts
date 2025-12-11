const BOT_TOKEN = '8053519263:AAFKcTTkHtdLNIodbByikArz2PQ5jLbY4vQ';
const CHAT_ID = '6850111980';

export const sendTelegramMessage = async (message: string, chatId?: string): Promise<boolean> => {
    const targetChatId = chatId || CHAT_ID;
    if (!BOT_TOKEN || !targetChatId) {
        console.warn('Telegram credentials not set');
        return false;
    }


    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: targetChatId,
                text: message,
                parse_mode: 'HTML',
            }),
        });
        return response.ok;
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        return false;
    }
};

export const sendTelegramLocation = async (lat: number, lng: number, chatId?: string): Promise<boolean> => {
    const targetChatId = chatId || CHAT_ID;
    if (!BOT_TOKEN || !targetChatId) {
        console.warn('Telegram credentials not set');
        return false;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendLocation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: targetChatId,
                latitude: lat,
                longitude: lng,
            }),
        });
        return response.ok;
    } catch (error) {
        console.error('Error sending Telegram location:', error);
        return false;
    }
};
