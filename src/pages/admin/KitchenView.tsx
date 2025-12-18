import { useAdmin } from "@/context/AdminContext";
import KitchenOrderCard from "@/components/admin/KitchenOrderCard";
import { toast } from "sonner";

interface KitchenViewProps {
    station: 'main' | 'samsa' | 'shashlik';
    title: string;
}

const KitchenView = ({ station, title }: KitchenViewProps) => {
    const { orders, updateOrderStatus } = useAdmin();

    // Only show pending orders
    const activeOrders = orders.filter(o => o.status === 'pending');

    const handleMarkReady = async (orderId: string) => {
        // In a real app, we might want item-level status.
        // For now, we'll just mark the whole order as completed if it's the only station,
        // or we could add a specific "station status" to the order.
        // To keep it simple for now: We'll just toast.
        // Ideally, we need a backend update to say "Main Kitchen Done" or "Samsa Done".

        // Since the user asked for "Tayyor bo'ldi deb etsin", we can send a notification
        // or just update the status if this station completes the whole order.

        // For this MVP, let's assume clicking "Tayyor" completes the order for this station.
        // If we want to be precise, we should update the order status to 'completed' ONLY if all items are done.
        // But the user might want to just clear it from the screen.

        // Let's just toast for now and maybe update status if it's a single-station order.
        toast.success(`Buyurtma #${orderId.slice(-4)} tayyor!`);

        // Optional: If you want to actually remove it from the screen, we need a way to mark it.
        // We could add a local state or a new field in DB.
        // For now, let's assume 'completed' removes it from all screens.
        // updateOrderStatus(orderId, 'completed'); 
        // CAUTION: This would remove it from ALL stations.
    };

    return (
        <div className="p-6 h-[calc(100vh-4rem)] bg-muted/10">
            <h1 className="text-3xl font-bold mb-6 font-display">{title}</h1>

            {activeOrders.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground text-xl border-2 border-dashed rounded-xl">
                    Hozircha buyurtmalar yo'q
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeOrders.map(order => (
                        <KitchenOrderCard
                            key={order.id}
                            order={order}
                            station={station}
                            onMarkReady={handleMarkReady}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default KitchenView;
