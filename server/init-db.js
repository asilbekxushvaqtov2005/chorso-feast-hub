import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
    try {
        // Create connection without database selected to create it if not exists
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });

        console.log('Connected to MySQL server.');

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split queries by semicolon (simple split, might need more robust parsing for complex SQL)
        const queries = schemaSql.split(';').filter(query => query.trim() !== '');

        for (const query of queries) {
            if (query.trim()) {
                await connection.query(query);
                console.log('Executed query:', query.substring(0, 50) + '...');
            }
        }

        console.log('Database initialized successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initDb();
