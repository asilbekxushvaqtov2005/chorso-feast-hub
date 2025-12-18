import React, { createContext, useContext, useState, useEffect } from 'react';
import { menuItems as initialMenuData } from '../data/menuData';
import { sendTelegramMessage, sendTelegramLocation } from '../lib/telegram';
import { MenuItem, Order, Courier } from '../types/admin';
import { db } from '../lib/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

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
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [couriers, setCouriers] = useState<Courier[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('adminAuth') === 'true';
    });

    // Real-time listeners
    useEffect(() => {
        // Menu Listener
        const unsubscribeMenu = onSnapshot(collection(db, "menu"), async (snapshot) => {
            const menuData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

            // If menu is empty in DB, seed it with initial data
            if (menuData.length === 0 && initialMenuData.length > 0) {
                console.log("Seeding database with initial menu...");
                for (const item of initialMenuData) {
                    try {
                        // Use item.id as doc ID to prevent duplicates if run multiple times
                        await setDoc(doc(db, "menu", item.id.toString()), item);
                    } catch (e) {
                        console.error("Error seeding item:", item.name, e);
                    }
                }
                // No need to setMenuItems here, the snapshot listener will fire again
            } else {
                setMenuItems(menuData);
            }
        });

        // Orders Listener
        const q = query(collection(db, "orders"), orderBy("date", "desc"));
        const unsubscribeOrders = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(ordersData);
        });

        // Couriers Listener
        const unsubscribeCouriers = onSnapshot(collection(db, "couriers"), (snapshot) => {
            const couriersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Courier));
            setCouriers(couriersData);
        });

        return () => {
            unsubscribeMenu();
            unsubscribeOrders();
            unsubscribeCouriers();
        };
    }, []);

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
        try {
            await addDoc(collection(db, "menu"), item);
        } catch (e) {
            console.error("Error adding menu item: ", e);
        }
    };

    const updateMenuItem = async (updatedItem: MenuItem) => {
        try {
            const itemRef = doc(db, "menu", updatedItem.id.toString());
            // Exclude ID from data to update
            const { id, ...data } = updatedItem;
            await updateDoc(itemRef, data);
        } catch (e) {
            console.error("Error updating menu item: ", e);
        }
    };

    const deleteMenuItem = async (id: number) => {
        try {
            await deleteDoc(doc(db, "menu", id.toString()));
        } catch (e) {
            console.error("Error deleting menu item: ", e);
        }
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        try {
            await updateDoc(doc(db, "orders", id), { status });
        } catch (e) {
            console.error("Error updating order status: ", e);
        }
    };

    const deleteOrder = async (id: string) => {
        try {
            await deleteDoc(doc(db, "orders", id));
        } catch (e) {
            console.error("Error deleting order: ", e);
        }
    };

    const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status' | 'paymentConfirmed'>) => {
        try {
            const newOrder = {
                ...orderData,
                date: new Date().toISOString(),
                status: 'pending',
                paymentConfirmed: orderData.paymentMethod === 'online' ? false : undefined
            };
            await addDoc(collection(db, "orders"), newOrder);
        } catch (e) {
            console.error("Error adding order: ", e);
        }
    };

    const addCourier = async (courierData: Omit<Courier, 'id' | 'status'>) => {
        try {
            await addDoc(collection(db, "couriers"), { ...courierData, status: 'active' });
        } catch (e) {
            console.error("Error adding courier: ", e);
        }
    };

    const deleteCourier = async (id: string) => {
        try {
            await deleteDoc(doc(db, "couriers", id));
        } catch (e) {
            console.error("Error deleting courier: ", e);
        }
    };

    const assignCourier = async (orderId: string, courierId: string) => {
        try {
            await updateDoc(doc(db, "orders", orderId), { courierId });

            // Telegram logic
            if (courierId === 'unassigned') return;

            const courier = couriers.find(c => c.id === courierId);
            const order = orders.find(o => o.id === orderId);

            if (courier && courier.telegramChatId && order) {
                // ... (Telegram message logic remains same, just ensure data is valid)
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
        } catch (e) {
            console.error("Error assigning courier: ", e);
        }
    };

    const confirmPayment = async (orderId: string) => {
        try {
            await updateDoc(doc(db, "orders", orderId), { paymentConfirmed: true });
        } catch (e) {
            console.error("Error confirming payment: ", e);
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
