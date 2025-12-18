import { useEffect, useRef } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';
import { printReceipt } from '@/utils/printReceipt';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const OrderListener = () => {
    const { orders } = useAdmin();
    const lastOrderIdRef = useRef<string | null>(null);
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (orders.length === 0) return;

        // Sort orders by ID (assuming ID is incremental or timestamp-based)
        // Actually, our IDs are strings, but let's assume the latest one is at the top or we find the max ID.
        // Since fetchOrders usually returns list, let's find the one with the latest date.
        const latestOrder = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        if (!latestOrder) return;

        if (isFirstRun.current) {
            lastOrderIdRef.current = latestOrder.id;
            isFirstRun.current = false;
            return;
        }

        if (lastOrderIdRef.current !== latestOrder.id) {
            // New order detected!
            lastOrderIdRef.current = latestOrder.id;

            // Check if it's recent (within last minute) to avoid spamming on reload if logic fails
            const orderTime = new Date(latestOrder.date).getTime();
            const now = new Date().getTime();
            if (now - orderTime < 60000) {
                // Play sound (browser policy might block audio without interaction, but we try)
                const audio = new Audio('/assets/notification.mp3'); // Ensure this file exists or use a base64
                audio.play().catch(e => console.log('Audio play failed', e));

                toast("Yangi buyurtma tushdi!", {
                    description: `#${latestOrder.id.slice(-4)} - ${latestOrder.total.toLocaleString()} so'm`,
                    action: {
                        label: "Chek chiqarish",
                        onClick: () => printReceipt(latestOrder),
                    },
                    duration: 10000, // Stay for 10 seconds
                });

                // Attempt auto-print if user has interacted with document recently
                // printReceipt(latestOrder); // Uncomment if you want to be aggressive
            }
        }
    }, [orders]);

    return null; // This component renders nothing
};

export default OrderListener;
