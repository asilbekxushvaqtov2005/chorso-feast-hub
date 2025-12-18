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
import { MapPin, Phone, CreditCard, Banknote, Smartphone, CheckCircle, Search, Filter, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Orders = () => {
    const { orders, couriers, updateOrderStatus, assignCourier, confirmPayment, deleteOrder } = useAdmin();

    const handleDelete = (id: string) => {
        if (window.confirm("Haqiqatan ham bu buyurtmani o'chirmoqchimisiz?")) {
            deleteOrder(id);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-emerald-500 hover:bg-emerald-600">Yakunlandi</Badge>;
            case "pending":
                return <Badge className="bg-amber-500 hover:bg-amber-600">Kutilmoqda</Badge>;
            case "cancelled":
                return <Badge variant="destructive">Bekor qilindi</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-display">Buyurtmalar</h2>
                    <p className="text-muted-foreground">Barcha buyurtmalarni boshqarish</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Qidirish..."
                            className="pl-9 w-[250px] bg-card"
                        />
                    </div>
                    <Button variant="outline" className="bg-card">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Mijoz</TableHead>
                            <TableHead>Mahsulotlar</TableHead>
                            <TableHead>To'lov</TableHead>
                            <TableHead>Manzil</TableHead>
                            <TableHead>Kuryer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                    Hozircha buyurtmalar yo'q
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium">#{order.id.slice(-4)}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{order.customerName}</span>
                                            <a href={`tel:${order.phone}`} className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                                                <Phone className="w-3 h-3 mr-1" />
                                                {order.phone}
                                            </a>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[200px]">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="text-sm text-muted-foreground truncate">
                                                    <span className="font-medium text-foreground">{item.quantity}x</span> {item.name}
                                                </div>
                                            ))}
                                        </div>
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
                                                        <Badge variant="outline" className="text-emerald-500 border-emerald-500 text-[10px] px-1 py-0 h-5">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            To'landi
                                                        </Badge>
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => confirmPayment(order.id)}
                                                            className="h-6 text-[10px] px-2 border-amber-500 text-amber-500 hover:bg-amber-50"
                                                        >
                                                            Tasdiqlash
                                                        </Button>
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
                                            <span className="text-muted-foreground text-sm">Olib ketish</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.courierId || "unassigned"}
                                            onValueChange={(value) => assignCourier(order.id, value)}
                                        >
                                            <SelectTrigger className="w-[140px] h-8 text-sm">
                                                <SelectValue placeholder="Tanlang" />
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
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(order.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Statusni o'zgartirish</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'pending')}>
                                                    Kutilmoqda
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'completed')}>
                                                    Yakunlandi
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'cancelled')} className="text-destructive">
                                                    Bekor qilish
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDelete(order.id)} className="text-destructive font-medium focus:text-destructive">
                                                    O'chirish
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Orders;
