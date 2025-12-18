import React, { createContext, useContext, useState, useEffect } from 'react';
import { menuItems as initialMenuData } from '../data/menuData';
import { sendTelegramMessage, sendTelegramLocation } from '../lib/telegram';
import { MenuItem, Order, Courier } from '../types/admin';

interface AdminContextType {
    menuItems: MenuItem[];
    orders: Order[];
    couriers: Courier[];
    isAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
    addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
    updateMenuItem: (item: MenuItem) => Promise<void>;
    deleteMenuItem: (id: number) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
    updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
    addOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'paymentConfirmed'>) => Promise<void>;
    addCourier: (courier: Omit<Courier, 'id' | 'status'>) => Promise<void>;
    deleteCourier: (id: string) => Promise<void>;
    assignCourier: (orderId: string, courierId: string) => Promise<void>;
    confirmPayment: (orderId: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Check if we are running locally or in production (Vercel)
    // If localhost, we use the API (Database)
    // If production (Vercel), we use localStorage (Browser memory) because the DB is local
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [couriers, setCouriers] = useState<Courier[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('adminAuth') === 'true';
    });

    // Load initial data
    useEffect(() => {
        if (isLocalhost) {
            fetchMenu();
            fetchOrders();
            fetchCouriers();
        } else {
            // Load from localStorage for production
            loadFromLocalStorage();
        }
    }, [isLocalhost]);

    // Save to localStorage when data changes (only for production)
    useEffect(() => {
        if (!isLocalhost) {
            localStorage.setItem('offlineMenu', JSON.stringify(menuItems));
        }
    }, [menuItems, isLocalhost]);

    useEffect(() => {
        if (!isLocalhost) {
            localStorage.setItem('offlineOrders', JSON.stringify(orders));
        }
    }, [orders, isLocalhost]);

    useEffect(() => {
        if (!isLocalhost) {
            localStorage.setItem('offlineCouriers', JSON.stringify(couriers));
        }
    }, [couriers, isLocalhost]);

    const loadFromLocalStorage = () => {
        // Menu
        const storedMenu = localStorage.getItem('offlineMenu');
        if (storedMenu) {
            try {
                setMenuItems(JSON.parse(storedMenu));
            } catch (e) {
                setMenuItems(initialMenuData);
            }
        } else {
            setMenuItems(initialMenuData);
        }

        // Orders
        const storedOrders = localStorage.getItem('offlineOrders');
        if (storedOrders) {
            try {
                setOrders(JSON.parse(storedOrders));
            } catch (e) {
                setOrders([]);
            }
        }

        // Couriers
        const storedCouriers = localStorage.getItem('offlineCouriers');
        if (storedCouriers) {
            try {
                setCouriers(JSON.parse(storedCouriers));
            } catch (e) {
                setCouriers([]);
            }
        }
    };

    const fetchMenu = async () => {
        try {
            const res = await fetch('/api/menu');
            const data = await res.json();
            setMenuItems(data);
        } catch (error) {
            console.error('Failed to fetch menu:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            const mappedOrders = data.map((o: any) => ({
                id: o.id.toString(),
                customerName: o.customer_name,
                phone: o.phone,
                total: o.total,
                deliveryType: o.delivery_type,
                location: o.location_lat ? { lat: o.location_lat, lng: o.location_lng } : null,
                paymentMethod: o.payment_method,
                status: o.status,
                items: o.items.map((i: any) => ({
                    name: i.item_name,
                    quantity: i.quantity,
                    price: i.price
                })),
                courierId: o.courier_id?.toString(),
                paymentConfirmed: !!o.payment_confirmed,
                date: o.created_at
            }));
            setOrders(mappedOrders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const fetchCouriers = async () => {
        try {
            const res = await fetch('/api/couriers');
            const data = await res.json();
            const mappedCouriers = data.map((c: any) => ({
                id: c.id.toString(),
                name: c.name,
                phone: c.phone,
                telegramChatId: c.telegram_chat_id,
                status: 'active'
            }));
            setCouriers(mappedCouriers);
        } catch (error) {
            console.error('Failed to fetch couriers:', error);
        }
    };

    const login = (password: string) => {
        if (password === 'admin123') {
            setIsAuthenticated(true);
            localStorage.setItem('adminAuth', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('adminAuth');
    };

    const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
        if (isLocalhost) {
            try {
                const res = await fetch('/api/menu', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });
                if (res.ok) fetchMenu();
            } catch (error) {
                console.error('Failed to add menu item:', error);
            }
        } else {
            const newItem = { ...item, id: Date.now() };
            setMenuItems([...menuItems, newItem]);
        }
    };

    const updateMenuItem = async (updatedItem: MenuItem) => {
        if (isLocalhost) {
            try {
                const res = await fetch(`/api/menu/${updatedItem.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedItem)
                });
                if (res.ok) fetchMenu();
            } catch (error) {
                console.error('Failed to update menu item:', error);
            }
        } else {
            setMenuItems(menuItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
        }
    };

    const deleteMenuItem = async (id: number) => {
        if (isLocalhost) {
            try {
                await fetch(`/api/menu/${id}`, { method: 'DELETE' });
                fetchMenu();
            } catch (error) {
                console.error('Failed to delete menu item:', error);
            }
        } else {
            setMenuItems(menuItems.filter((item) => item.id !== id));
        }
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        if (isLocalhost) {
            try {
                await fetch(`/api/orders/${id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status })
                });
                fetchOrders();
            } catch (error) {
                console.error('Failed to update order status:', error);
            }
        } else {
            setOrders(orders.map((order) => (order.id === id ? { ...order, status } : order)));
        }
    };

    const deleteOrder = async (id: string) => {
        if (isLocalhost) {
            try {
                await fetch(`/api/orders/${id}`, { method: 'DELETE' });
                fetchOrders();
            } catch (error) {
                console.error('Failed to delete order:', error);
            }
        } else {
            setOrders(orders.filter((order) => order.id !== id));
        }
    };

    const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status' | 'paymentConfirmed'>) => {
        if (isLocalhost) {
            try {
                await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                fetchOrders();
            } catch (error) {
                console.error('Failed to add order:', error);
            }
        } else {
            const newOrder: Order = {
                ...orderData,
                id: Date.now().toString(),
                date: new Date().toISOString(),
                status: 'pending',
                paymentConfirmed: orderData.paymentMethod === 'online' ? false : undefined
            };
            setOrders((prev) => [newOrder, ...prev]);
        }
    };

    const addCourier = async (courierData: Omit<Courier, 'id' | 'status'>) => {
        if (isLocalhost) {
            try {
                await fetch('/api/couriers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(courierData)
                });
                fetchCouriers();
            } catch (error) {
                console.error('Failed to add courier:', error);
            }
        } else {
            const newCourier: Courier = {
                ...courierData,
                id: Date.now().toString(),
                status: 'active'
            };
            setCouriers([...couriers, newCourier]);
        }
    };

    const deleteCourier = async (id: string) => {
        if (isLocalhost) {
            try {
                await fetch(`/api/couriers/${id}`, { method: 'DELETE' });
                fetchCouriers();
            } catch (error) {
                console.error('Failed to delete courier:', error);
            }
        } else {
            setCouriers((prev) => prev.filter((c) => c.id !== id));
        }
    };

    const assignCourier = async (orderId: string, courierId: string) => {
        if (isLocalhost) {
            try {
                await fetch(`/api/orders/${orderId}/assign`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courierId: courierId === 'unassigned' ? null : courierId })
                });
                fetchOrders();
            } catch (error) {
                console.error('Failed to assign courier:', error);
            }
        } else {
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? { ...order, courierId } : order
                )
            );
        }

        // Telegram logic (shared)
        if (courierId === 'unassigned') return;

        const courier = couriers.find(c => c.id === courierId);
        const order = orders.find(o => o.id === orderId);

        if (courier && courier.telegramChatId && order) {
            const date = new Date(order.date).toLocaleString('uz-UZ');
            let message = `<b>🆕 Yangi Buyurtma!</b>\n\n`;
            message += `🆔 <b>ID:</b> #${order.id.slice(-4)}\n`;
            message += `👤 <b>Mijoz:</b> ${order.customerName}\n`;
            message += `📞 <b>Tel:</b> ${order.phone}\n`;
            message += `📍 <b>Manzil:</b> ${order.location ? 'Lokatsiya' : 'Olib ketish'}\n`;
            message += `💰 <b>Jami:</b> ${order.total.toLocaleString()} so'm\n`;

            if (order.paymentMethod === 'online') {
                message += `💳 <b>To'lov:</b> Online ${order.paymentConfirmed ? '✅' : '⏳'}\n`;
            } else {
                message += `💵 <b>To'lov:</b> ${order.paymentMethod === 'card' ? 'Karta' : 'Naqd'}\n`;
            }

            message += `\n<b>Buyurtma tarkibi:</b>\n`;
            order.items.forEach(item => {
                message += `▫️ ${item.name} x ${item.quantity}\n`;
            });

            await sendTelegramMessage(message, courier.telegramChatId);

            if (order.location) {
                await sendTelegramLocation(order.location.lat, order.location.lng, courier.telegramChatId);
            }
        }
    };

    const confirmPayment = async (orderId: string) => {
        if (isLocalhost) {
            try {
                await fetch(`/api/orders/${orderId}/payment`, {
                    method: 'PUT'
                });
                fetchOrders();
            } catch (error) {
                console.error('Failed to confirm payment:', error);
            }
        } else {
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? { ...order, paymentConfirmed: true } : order
                )
            );
        }
    };

    return (
        <AdminContext.Provider
            value={{
                menuItems,
                orders,
                couriers,
                isAuthenticated,
                login,
                logout,
                addMenuItem,
                updateMenuItem,
                deleteMenuItem,
                deleteOrder,
                updateOrderStatus,
                addOrder,
                addCourier,
                deleteCourier,
                assignCourier,
                confirmPayment,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
