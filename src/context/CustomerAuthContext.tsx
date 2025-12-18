import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Customer {
    phone: string;
    passportSeries?: string;
    isAuthenticated: boolean;
}

interface CustomerAuthContextType {
    customer: Customer | null;
    login: (phone: string) => Promise<boolean>;
    verify: (otp: string, passportSeries: string) => Promise<boolean>;
    logout: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [tempPhone, setTempPhone] = useState<string | null>(null);
    const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

    useEffect(() => {
        const storedCustomer = localStorage.getItem('customer_auth');
        if (storedCustomer) {
            try {
                setCustomer(JSON.parse(storedCustomer));
            } catch (e) {
                console.error("Failed to parse customer auth", e);
                localStorage.removeItem('customer_auth');
            }
        }
    }, []);

    const login = async (phone: string) => {
        // Simulate sending OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setTempPhone(phone);
        setGeneratedOtp(otp);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show OTP in toast (Simulation of SMS)
        toast.info(`Sizning tasdiqlash kodingiz: ${otp}`, {
            duration: 10000,
            action: {
                label: "Nusxalash",
                onClick: () => navigator.clipboard.writeText(otp),
            },
        });

        return true;
    };

    const verify = async (otp: string, passportSeries: string) => {
        if (!tempPhone || !generatedOtp) {
            toast.error("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
            return false;
        }

        if (otp !== generatedOtp) {
            toast.error("Noto'g'ri kod kiritildi.");
            return false;
        }

        const newCustomer: Customer = {
            phone: tempPhone,
            passportSeries,
            isAuthenticated: true,
        };

        setCustomer(newCustomer);
        localStorage.setItem('customer_auth', JSON.stringify(newCustomer));

        setTempPhone(null);
        setGeneratedOtp(null);

        toast.success("Muvaffaqiyatli kirdingiz!");
        return true;
    };

    const logout = () => {
        setCustomer(null);
        localStorage.removeItem('customer_auth');
        toast.info("Tizimdan chiqdingiz.");
    };

    return (
        <CustomerAuthContext.Provider value={{ customer, login, verify, logout }}>
            {children}
        </CustomerAuthContext.Provider>
    );
};

export const useCustomerAuth = () => {
    const context = useContext(CustomerAuthContext);
    if (context === undefined) {
        throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
    }
    return context;
};
