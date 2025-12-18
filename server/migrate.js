import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'chorsu_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function migrate() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        // Check if columns exist
        const [columns] = await connection.query(`SHOW COLUMNS FROM orders LIKE 'courier_id'`);

        if (columns.length === 0) {
            console.log('Adding courier_id column...');
            await connection.query(`ALTER TABLE orders ADD COLUMN courier_id INT`);
            await connection.query(`ALTER TABLE orders ADD CONSTRAINT fk_courier FOREIGN KEY (courier_id) REFERENCES couriers(id) ON DELETE SET NULL`);
            console.log('courier_id added.');
        } else {
            console.log('courier_id already exists.');
        }

        const [paymentColumns] = await connection.query(`SHOW COLUMNS FROM orders LIKE 'payment_confirmed'`);
        if (paymentColumns.length === 0) {
            console.log('Adding payment_confirmed column...');
            await connection.query(`ALTER TABLE orders ADD COLUMN payment_confirmed BOOLEAN DEFAULT FALSE`);
            console.log('payment_confirmed added.');
        } else {
            console.log('payment_confirmed already exists.');
        }

        // Check for category in order_items
        const [itemColumns] = await connection.query(`SHOW COLUMNS FROM order_items LIKE 'category'`);
        if (itemColumns.length === 0) {
            console.log('Adding category column to order_items...');
            await connection.query(`ALTER TABLE order_items ADD COLUMN category VARCHAR(50)`);
            console.log('category added to order_items.');
        } else {
            console.log('category already exists in order_items.');
        }

        console.log('Migration completed.');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
