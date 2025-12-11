import React, { createContext, useContext, useState, useEffect } from 'react';
import { menuItems as initialMenuData } from '../data/menuData';
import { sendTelegramMessage, sendTelegramLocation } from '../lib/telegram';

// Define types
export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

export interface Courier {
    id: string;
    name: string;
    phone: string;
    telegramChatId?: string;
    status: 'active' | 'inactive';
}

export interface Order {
    id: string;
    customerName: string; // Keeping for backward compatibility, can be used for name input if needed
    phone: string;
    location: { lat: number; lng: number } | null;
    paymentMethod: 'cash' | 'card' | 'online';
    paymentConfirmed?: boolean; // For online payments
    items: { name: string; quantity: number; price: number }[];
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    date: string;
    courierId?: string;
    deliveryType: 'pickup' | 'delivery';
}

interface AdminContextType {
    menuItems: MenuItem[];
    orders: Order[];
    couriers: Courier[];
    isAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
    addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
    updateMenuItem: (item: MenuItem) => void;
    deleteMenuItem: (id: number) => void;
    updateOrderStatus: (id: string, status: Order['status']) => void;
    addOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'paymentConfirmed'>) => Promise<void>;
    addCourier: (courier: Omit<Courier, 'id' | 'status'>) => void;
    deleteCourier: (id: string) => void;
    assignCourier: (orderId: string, courierId: string) => void;
    confirmPayment: (orderId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [couriers, setCouriers] = useState<Courier[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load data from localStorage on mount
    useEffect(() => {
        const storedMenu = localStorage.getItem('menuItems_v5');
        const storedOrders = localStorage.getItem('orders');
        const storedCouriers = localStorage.getItem('couriers');
        const storedAuth = localStorage.getItem('isAuthenticated');

        if (storedMenu) {
            setMenuItems(JSON.parse(storedMenu));
        } else {
            setMenuItems(initialMenuData);
        }

        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        } else {
            // Mock orders for demonstration
            setOrders([
                {
                    id: '1',
                    customerName: 'John Doe',
                    phone: '+998901234567',
                    location: null,
                    paymentMethod: 'cash',
                    items: [{ name: 'Osh', quantity: 2, price: 45000 }],
                    total: 90000,
                    status: 'pending',
                    date: new Date().toISOString(),
                    deliveryType: 'delivery',
                },
            ]);
        }

        if (storedCouriers) {
            setCouriers(JSON.parse(storedCouriers));
        }

        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (menuItems.length > 0) {
            localStorage.setItem('menuItems_v5', JSON.stringify(menuItems));
        }
    }, [menuItems]);

    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('couriers', JSON.stringify(couriers));
    }, [couriers]);

    useEffect(() => {
        localStorage.setItem('isAuthenticated', String(isAuthenticated));
    }, [isAuthenticated]);

    const login = (password: string) => {
        if (password === 'admin123') {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
        const newItem = { ...item, id: Date.now() };
        setMenuItems([...menuItems, newItem]);
    };

    const updateMenuItem = (updatedItem: MenuItem) => {
        setMenuItems(menuItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    };

    const deleteMenuItem = (id: number) => {
        setMenuItems(menuItems.filter((item) => item.id !== id));
    };

    const updateOrderStatus = (id: string, status: Order['status']) => {
        setOrders(orders.map((order) => (order.id === id ? { ...order, status } : order)));
    };

    const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status' | 'paymentConfirmed'>) => {
        let assignedCourierId: string | undefined = undefined;

        // Auto-assign courier for delivery orders
        if (orderData.deliveryType === 'delivery') {
            const activeCouriers = couriers.filter(c => c.status === 'active');

            if (activeCouriers.length > 0) {
                // Find courier with least pending orders
                const courierOrderCounts = activeCouriers.map(courier => ({
                    courierId: courier.id,
                    count: orders.filter(o => o.courierId === courier.id && o.status === 'pending').length
                }));

                courierOrderCounts.sort((a, b) => a.count - b.count);
                assignedCourierId = courierOrderCounts[0].courierId;
            }
        }

        const newOrder: Order = {
            ...orderData,
            id: Date.now().toString(),
            date: new Date().toISOString(),
            status: 'pending',
            paymentConfirmed: orderData.paymentMethod !== 'online', // Auto-confirm for cash/card
            courierId: assignedCourierId,
        };

        // Notify assigned courier
        if (assignedCourierId) {
            const courier = couriers.find(c => c.id === assignedCourierId);
            if (courier && courier.telegramChatId) {
                let itemsList = "";
                newOrder.items.forEach(item => {
                    itemsList += `▫️ ${item.quantity}x ${item.name}\n`;
                });

                const message = `📦 <b>Yangi buyurtma sizga biriktirildi!</b>\n\n` +
                    `🆔 Buyurtma: #${newOrder.id.slice(-4)}\n` +
                    `👤 Mijoz: ${newOrder.customerName}\n` +
                    `📞 Tel: ${newOrder.phone}\n` +
                    `💰 Jami: ${newOrder.total.toLocaleString()} UZS\n` +
                    `📍 Manzil: ${newOrder.location ? 'Xarita pastda' : 'Belgilanmagan'}\n\n` +
                    `<b>Buyurtma tarkibi:</b>\n${itemsList}`;

                // Send message asynchronously without blocking UI significantly, but we await it to ensure it's sent
                try {
                    await sendTelegramMessage(message, courier.telegramChatId);
                    if (newOrder.location) {
                        await sendTelegramLocation(newOrder.location.lat, newOrder.location.lng, courier.telegramChatId);
                    }
                } catch (error) {
                    console.error("Failed to send auto-assignment notification:", error);
                }
            }
        }

        setOrders((prev) => [newOrder, ...prev]);
    };

    const addCourier = (courierData: Omit<Courier, 'id' | 'status'>) => {
        const newCourier: Courier = {
            ...courierData,
            id: Date.now().toString(),
            status: 'active',
        };
        setCouriers((prev) => [...prev, newCourier]);
    };

    const deleteCourier = (id: string) => {
        setCouriers((prev) => prev.filter((c) => c.id !== id));
    };

    const assignCourier = async (orderId: string, courierId: string) => {
        const courier = couriers.find(c => c.id === courierId);
        const order = orders.find(o => o.id === orderId);

        if (courier && order && courier.telegramChatId) {
            let itemsList = "";
            order.items.forEach(item => {
                itemsList += `▫️ ${item.quantity}x ${item.name}\n`;
            });

            const message = `📦 <b>Yangi buyurtma sizga biriktirildi!</b>\n\n` +
                `🆔 Buyurtma: #${order.id.slice(-4)}\n` +
                `👤 Mijoz: ${order.customerName}\n` +
                `📞 Tel: ${order.phone}\n` +
                `💰 Jami: ${order.total.toLocaleString()} UZS\n` +
                `📍 Manzil: ${order.location ? 'Xarita pastda' : 'Belgilanmagan'}\n\n` +
                `<b>Buyurtma tarkibi:</b>\n${itemsList}`;

            await sendTelegramMessage(message, courier.telegramChatId);

            if (order.location) {
                await sendTelegramLocation(order.location.lat, order.location.lng, courier.telegramChatId);
            }
        }

        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, courierId } : order
            )
        );
    };

    const confirmPayment = async (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            await sendTelegramMessage(`✅ <b>Buyurtma #${order.id.slice(-4)} to'lovi tasdiqlandi!</b>\n\nTo'lov turi: Online`);
        }

        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, paymentConfirmed: true } : order
            )
        );
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
