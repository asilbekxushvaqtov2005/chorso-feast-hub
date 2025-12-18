export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    variants?: {
        name: string;
        price: number;
    }[];
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
    customerName: string;
    phone: string;
    location: { lat: number; lng: number } | null;
    paymentMethod: 'cash' | 'card' | 'online';
    paymentConfirmed?: boolean;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    date: string;
    courierId?: string;
    deliveryType: 'pickup' | 'delivery';
}
