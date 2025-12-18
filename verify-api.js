
import http from 'http';

function get(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error('Failed to parse JSON'));
                    }
                } else {
                    reject(new Error(`Status Code: ${res.statusCode}`));
                }
            });
        }).on('error', (err) => reject(err));
    });
}

async function verifyApi() {
    console.log('Testing Backend API...');
    try {
        const menu = await get('http://localhost:5000/api/menu');
        console.log(`✅ Menu API working. Items found: ${menu.length}`);
    } catch (error) {
        console.error(`❌ Menu API failed: ${error.message}`);
    }

    try {
        const orders = await get('http://localhost:5000/api/orders');
        console.log(`✅ Orders API working. Orders found: ${orders.length}`);
    } catch (error) {
        console.error(`❌ Orders API failed: ${error.message}`);
    }
}

verifyApi();
