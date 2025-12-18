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
    addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
    updateMenuItem: (item: MenuItem) => void;
    deleteMenuItem: (id: number) => void;
    deleteOrder: (id: string) => void;
    updateOrderStatus: (id: string, status: Order['status']) => void;
    addOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'paymentConfirmed'>) => Promise<void>;
    addCourier: (courier: Omit<Courier, 'id' | 'status'>) => void;
    deleteCourier: (id: string) => void;
    assignCourier: (orderId: string, courierId: string) => Promise<void>;
    confirmPayment: (orderId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
        const storedMenu = localStorage.getItem('offlineMenu');
        if (storedMenu) {
            try {
                const parsedMenu = JSON.parse(storedMenu);
                if (Array.isArray(parsedMenu)) {
                    return parsedMenu;
                }
            } catch (e) {
                console.error("Failed to parse offline menu:", e);
                localStorage.removeItem('offlineMenu');
            }
        }
        return initialMenuData;
    });

    const [orders, setOrders] = useState<Order[]>([]);
    const [couriers, setCouriers] = useState<Courier[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('adminAuth') === 'true';
    });

    // Load data from localStorage on mount
    useEffect(() => {
        // Load orders
        const storedOrders = localStorage.getItem('offlineOrders');
        if (storedOrders) {
            try {
                const parsedOrders = JSON.parse(storedOrders);
                if (Array.isArray(parsedOrders)) {
                    setOrders(parsedOrders);
                }
            } catch (e) {
                console.error("Failed to parse offline orders:", e);
                localStorage.removeItem('offlineOrders');
            }
        }

        // Load couriers (mock persistence for now)
        const storedCouriers = localStorage.getItem('offlineCouriers');
        if (storedCouriers) {
            try {
                const parsedCouriers = JSON.parse(storedCouriers);
                if (Array.isArray(parsedCouriers)) {
                    setCouriers(parsedCouriers);
                }
            } catch (e) {
                console.error("Failed to parse offline couriers:", e);
                localStorage.removeItem('offlineCouriers');
            }
        }
    }, []);

    // Listen for changes in other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'offlineMenu' && e.newValue) {
                try {
                    const parsedMenu = JSON.parse(e.newValue);
                    if (Array.isArray(parsedMenu)) {
                        setMenuItems(parsedMenu);
                    }
                } catch (error) {
                    console.error("Failed to sync menu from storage event:", error);
                }
            }
            if (e.key === 'offlineOrders' && e.newValue) {
                try {
                    const parsedOrders = JSON.parse(e.newValue);
                    if (Array.isArray(parsedOrders)) {
                        setOrders(parsedOrders);
                    }
                } catch (error) {
                    console.error("Failed to sync orders from storage event:", error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Save menu items to localStorage
    useEffect(() => {
        localStorage.setItem('offlineMenu', JSON.stringify(menuItems));
    }, [menuItems]);

    // Save orders to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('offlineOrders', JSON.stringify(orders));
    }, [orders]);

    // Save couriers to localStorage
    useEffect(() => {
        localStorage.setItem('offlineCouriers', JSON.stringify(couriers));
    }, [couriers]);

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

    const deleteOrder = (id: string) => {
        setOrders(orders.filter((order) => order.id !== id));
    };

    const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status' | 'paymentConfirmed'>) => {
        const newOrder: Order = {
            ...orderData,
            id: Date.now().toString(),
            date: new Date().toISOString(),
            status: 'pending',
            paymentConfirmed: orderData.paymentMethod === 'online' ? false : undefined
        };
        setOrders((prev) => [newOrder, ...prev]);

        // Telegram notification logic can go here if needed client-side
        // sendTelegramMessage(...)
    };

    const addCourier = (courierData: Omit<Courier, 'id' | 'status'>) => {
        const newCourier: Courier = {
            ...courierData,
            id: Date.now().toString(),
            status: 'active'
        };
        setCouriers([...couriers, newCourier]);
    };

    const deleteCourier = (id: string) => {
        setCouriers((prev) => prev.filter((c) => c.id !== id));
    };

    const assignCourier = async (orderId: string, courierId: string) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, courierId } : order
            )
        );

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

    const confirmPayment = (orderId: string) => {
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
