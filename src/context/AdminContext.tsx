import React, { createContext, useContext, useState, useEffect } from 'react';
import { menuItems as initialMenuData } from '../data/menuData';

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
    addOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'paymentConfirmed'>) => void;
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
        const storedMenu = localStorage.getItem('menuItems');
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
            localStorage.setItem('menuItems', JSON.stringify(menuItems));
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

    const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status' | 'paymentConfirmed'>) => {
        const newOrder: Order = {
            ...orderData,
            id: Date.now().toString(),
            date: new Date().toISOString(),
            status: 'pending',
            paymentConfirmed: orderData.paymentMethod !== 'online', // Auto-confirm for cash/card
        };
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

    const assignCourier = (orderId: string, courierId: string) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, courierId } : order
            )
        );
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
