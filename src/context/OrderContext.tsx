import React, { createContext, useContext, useState } from 'react';

type OrderType = 'pickup' | 'delivery' | null;

interface OrderContextType {
    orderType: OrderType;
    setOrderType: (type: OrderType) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orderType, setOrderType] = useState<OrderType>(null);

    return (
        <OrderContext.Provider value={{ orderType, setOrderType }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};
