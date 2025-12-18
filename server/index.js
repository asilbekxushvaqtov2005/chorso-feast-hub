import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// --- ORDERS ROUTES ---

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');

        // Fetch items for each order
        const ordersWithItems = await Promise.all(rows.map(async (order) => {
            const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
            return { ...order, items };
        }));

        res.json(ordersWithItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create new order
app.post('/api/orders', async (req, res) => {
    const { customerName, phone, total, deliveryType, location, items, paymentMethod } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO orders (customer_name, phone, total, delivery_type, location_lat, location_lng, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [customerName, phone, total, deliveryType, location?.lat, location?.lng, paymentMethod, 'pending']
        );

        const orderId = result.insertId;

        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.name, item.quantity, item.price]
            );
        }

        await connection.commit();
        res.status(201).json({ id: orderId, message: 'Order created' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Failed to create order' });
    } finally {
        connection.release();
    }
});

// Update order status
app.put('/api/orders/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Order updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Assign courier
app.put('/api/orders/:id/assign', async (req, res) => {
    const { courierId } = req.body;
    try {
        await pool.query('UPDATE orders SET courier_id = ? WHERE id = ?', [courierId, req.params.id]);
        res.json({ message: 'Courier assigned' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Confirm payment
app.put('/api/orders/:id/payment', async (req, res) => {
    try {
        await pool.query('UPDATE orders SET payment_confirmed = TRUE WHERE id = ?', [req.params.id]);
        res.json({ message: 'Payment confirmed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete order
app.delete('/api/orders/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
        res.json({ message: 'Order deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- MENU ROUTES ---

// Get all menu items
app.get('/api/menu', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM menu_items');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add menu item
app.post('/api/menu', async (req, res) => {
    const { name, description, price, image, category } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO menu_items (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, image, category]
        );
        res.status(201).json({ id: result.insertId, message: 'Menu item added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update menu item
app.put('/api/menu/:id', async (req, res) => {
    const { name, description, price, image, category } = req.body;
    try {
        await pool.query(
            'UPDATE menu_items SET name = ?, description = ?, price = ?, image = ?, category = ? WHERE id = ?',
            [name, description, price, image, category, req.params.id]
        );
        res.json({ message: 'Menu item updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete menu item
app.delete('/api/menu/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM menu_items WHERE id = ?', [req.params.id]);
        res.json({ message: 'Menu item deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- COURIER ROUTES ---

// Get all couriers
app.get('/api/couriers', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM couriers');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add courier
app.post('/api/couriers', async (req, res) => {
    const { name, phone, telegramChatId } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO couriers (name, phone, telegram_chat_id) VALUES (?, ?, ?)',
            [name, phone, telegramChatId]
        );
        res.status(201).json({ id: result.insertId, message: 'Courier added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete courier
app.delete('/api/couriers/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM couriers WHERE id = ?', [req.params.id]);
        res.json({ message: 'Courier deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
