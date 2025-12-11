
const https = require('https');

const BOT_TOKEN = '8053519263:AAFKcTTkHtdLNIodbByikArz2PQ5jLbY4vQ';
const CHAT_ID = '6850111980';

const data = JSON.stringify({
    chat_id: CHAT_ID,
    text: 'Test message from Chorsu Feast Hub debugging session',
    parse_mode: 'HTML'
});

const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${BOT_TOKEN}/sendMessage`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);

    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Response:', responseBody);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
