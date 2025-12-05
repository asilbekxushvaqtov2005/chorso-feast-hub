import { useAdmin } from "@/context/AdminContext";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, CreditCard, Banknote, Smartphone, CheckCircle, AlertCircle } from "lucide-react";

const Orders = () => {
    const { orders, couriers, updateOrderStatus, assignCourier, confirmPayment } = useAdmin();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-500";
            case "pending":
                return "bg-yellow-500";
            case "cancelled":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Buyurtmalar</h2>

            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Mijoz</TableHead>
                            <TableHead>Mahsulotlar</TableHead>
                            <TableHead>To'lov</TableHead>
                            <TableHead>Manzil</TableHead>
                            <TableHead>Kuryer</TableHead>
                            <TableHead>Delivery</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Transfer</TableHead>
                            <TableHead>Sana</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.id.slice(-4)}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{order.customerName}</span>
                                        <a href={`tel:${order.phone}`} className="flex items-center text-sm text-muted-foreground hover:text-primary">
                                            <Phone className="w-3 h-3 mr-1" />
                                            {order.phone}
                                        </a>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {order.items.map((item) => (
                                        <div key={item.name} className="text-sm">
                                            {item.quantity}x {item.name}
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold">{order.total.toLocaleString()} UZS</span>
                                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                                            {order.paymentMethod === 'online' ? (
                                                <><Smartphone className="w-3 h-3 mr-1" /> Online</>
                                            ) : order.paymentMethod === 'card' ? (
                                                <><CreditCard className="w-3 h-3 mr-1" /> Karta</>
                                            ) : (
                                                <><Banknote className="w-3 h-3 mr-1" /> Naqd</>
                                            )}
                                        </div>
                                        {order.paymentMethod === 'online' && (
                                            <div className="mt-2">
                                                {order.paymentConfirmed ? (
                                                    <Badge className="bg-green-500 text-xs">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Tasdiqlangan
                                                    </Badge>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <Badge variant="destructive" className="text-xs">
                                                            <AlertCircle className="w-3 h-3 mr-1" />
                                                            Kutilmoqda
                                                        </Badge>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => confirmPayment(order.id)}
                                                            className="w-full text-xs h-7"
                                                        >
                                                            Tasdiqlash
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {order.location ? (
                                        <a
                                            href={`https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-blue-500 hover:underline text-sm"
                                        >
                                            <MapPin className="w-3 h-3 mr-1" />
                                            Xarita
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">Belgilanmagan</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={order.courierId || "unassigned"}
                                        onValueChange={(value) => assignCourier(order.id, value)}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Kuryer tanlang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">Biriktirilmagan</SelectItem>
                                            {couriers.map((courier) => (
                                                <SelectItem key={courier.id} value={courier.id}>
                                                    {courier.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            // Find courier with no orders (free courier)
                                            const courierOrderCounts = couriers.map(courier => ({
                                                courier,
                                                orderCount: orders.filter(o => o.courierId === courier.id && o.status === 'pending').length
                                            }));

                                            // Sort by order count (ascending) - couriers with 0 orders first
                                            courierOrderCounts.sort((a, b) => a.orderCount - b.orderCount);

                                            // Assign to the courier with least orders (preferably 0)
                                            if (courierOrderCounts.length > 0) {
                                                assignCourier(order.id, courierOrderCounts[0].courier.id);
                                            }
                                        }}
                                        className="ml-2"
                                        disabled={couriers.length === 0}
                                    >
                                        Transfer
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={order.status}
                                        onValueChange={(value: any) =>
                                            updateOrderStatus(order.id, value)
                                        }
                                    >
                                        <SelectTrigger className="w-[130px]">
                                            <SelectValue>
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status}
                                                </Badge>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Kutilmoqda</SelectItem>
                                            <SelectItem value="completed">Yakunlandi</SelectItem>
                                            <SelectItem value="cancelled">Bekor qilindi</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(order.date).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Orders;
