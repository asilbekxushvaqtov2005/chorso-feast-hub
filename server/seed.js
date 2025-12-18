import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const menuItems = [
    {
        name: "Palov",
        description: "An'anaviy o'zbek palovi mol go'shti, sabzi va ziravorlar bilan",
        price: 45000,
        image: "/assets/plov.jpg",
        category: "1-taom"
    },
    {
        name: "Somsa",
        description: "Go'shtli pishirilgan xachir buxorcha samsa",
        price: 12000,
        image: "/assets/samsa.jpg",
        category: "1-taom"
    },
    {
        name: "Shashlik",
        description: "Ko'mirda pishirilgan mol go'shti shashlik",
        price: 35000,
        image: "/assets/shashlik.jpg",
        category: "1-taom"
    },
    {
        name: "Chorsu",
        description: "Lahm go`shdan iborat",
        price: 60000,
        image: "/assets/chorsu.jpg",
        category: "1-taom"
    },
    {
        name: "Manti",
        description: "Bug'da pishirilgan katta go'shtli chuchvara",
        price: 28000,
        image: "/assets/manti.jpg",
        category: "1-taom"
    },
    {
        name: "Lag'mon",
        description: "Qo'lda tayyorlangan uzun noodle sabzavotlar va go'sht bilan",
        price: 32000,
        image: "/assets/lagman.jpg",
        category: "2-taom"
    },
    {
        name: "Coca-Cola",
        description: "Muzdek Coca-Cola",
        price: 8000,
        image: "/assets/coca_cola.png",
        category: "Ichimliklar"
    },
    {
        name: "Fanta",
        description: "Muzdek Fanta",
        price: 8000,
        image: "/assets/fanta.jpg",
        category: "Ichimliklar"
    },
    {
        name: "Pepsi",
        description: "Muzdek Pepsi",
        price: 8000,
        image: "/assets/pepsi.png",
        category: "Ichimliklar"
    },
    {
        name: "Flash",
        description: "Quvvat beruvchi ichimlik",
        price: 12000,
        image: "/assets/flash.png",
        category: "Ichimliklar"
    },
    {
        name: "Chortoq",
        description: "Ma'danli suv",
        price: 5000,
        image: "/assets/chortoq.png",
        category: "Ichimliklar"
    },
    {
        name: "Sok",
        description: "Tabiiy meva sharbatlari",
        price: 15000,
        image: "/assets/juice.png",
        category: "Ichimliklar"
    },
    {
        name: "Suv",
        description: "Toza ichimlik suvi",
        price: 3000,
        image: "/assets/water.png",
        category: "Ichimliklar"
    }
];

async function seed() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'chorsu_db'
        });

        console.log('Connected to MySQL server.');

        // Clear existing items to avoid duplicates if re-run (optional, but good for seeding)
        await connection.query('DELETE FROM menu_items');
        console.log('Cleared existing menu items.');

        for (const item of menuItems) {
            await connection.query(
                'INSERT INTO menu_items (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)',
                [item.name, item.description, item.price, item.image, item.category]
            );
            console.log(`Added: ${item.name}`);
        }

        console.log('Database seeded successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seed();
