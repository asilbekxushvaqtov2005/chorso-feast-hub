import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";
import { Order } from "@/types/admin";

interface KitchenOrderCardProps {
    order: Order;
    station: 'main' | 'samsa' | 'shashlik';
    onMarkReady: (orderId: string) => void;
}

const KitchenOrderCard = ({ order, station, onMarkReady }: KitchenOrderCardProps) => {
    // Filter items based on station
    const items = order.items.filter(item => {
        const lowerName = item.name.toLowerCase();
        const lowerCategory = (item as any).category?.toLowerCase() || ''; // Fallback if category missing in item type

        if (station === 'samsa') {
            return lowerName.includes('somsa') || lowerName.includes('samsa');
        }
        if (station === 'shashlik') {
            return lowerName.includes('shashlik');
        }
        if (station === 'main') {
            // Main kitchen sees everything EXCEPT Somsa and Shashlik
            return !lowerName.includes('somsa') && !lowerName.includes('samsa') && !lowerName.includes('shashlik');
        }
        return false;
    });

    if (items.length === 0) return null;

    return (
        <Card className="w-full h-full flex flex-col border-2">
            <CardHeader className="pb-2 bg-muted/30">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold">#{order.id.slice(-4)}</CardTitle>
                    <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(order.date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-4">
                <div className="space-y-3 flex-1">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                            <span className="font-medium text-lg">{item.name}</span>
                            <Badge variant="secondary" className="text-lg px-3 py-1">
                                {item.quantity}x
                            </Badge>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                    <Button
                        className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => onMarkReady(order.id)}
                    >
                        <CheckCircle className="w-6 h-6 mr-2" />
                        Tayyor
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default KitchenOrderCard;
