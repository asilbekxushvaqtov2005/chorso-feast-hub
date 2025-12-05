import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2, Plus, Phone, User } from "lucide-react";
import { toast } from "sonner";

const Couriers = () => {
    const { couriers, addCourier, deleteCourier } = useAdmin();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) {
            toast.error("Iltimos, barcha maydonlarni to'ldiring");
            return;
        }

        addCourier(formData);
        setFormData({ name: "", phone: "" });
        setIsAdding(false);
        toast.success("Kuryer muvaffaqiyatli qo'shildi");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Kuryerlar</h2>
                <Button onClick={() => setIsAdding(!isAdding)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {isAdding ? "Bekor qilish" : "Kuryer qo'shish"}
                </Button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-lg shadow-sm border animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                        <div className="space-y-2">
                            <Label htmlFor="name">Ism</Label>
                            <div className="relative">
                                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    placeholder="Kuryer ismi"
                                    className="pl-8"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon raqam</Label>
                            <div className="relative">
                                <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    placeholder="+998 90 123 45 67"
                                    className="pl-8"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <Button type="submit">Saqlash</Button>
                    </form>
                </div>
            )}

            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ism</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {couriers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    Kuryerlar mavjud emas
                                </TableCell>
                            </TableRow>
                        ) : (
                            couriers.map((courier) => (
                                <TableRow key={courier.id}>
                                    <TableCell className="font-medium">{courier.name}</TableCell>
                                    <TableCell>{courier.phone}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${courier.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {courier.status === 'active' ? 'Faol' : 'Nofaol'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
                                                    deleteCourier(courier.id);
                                                    toast.success("Kuryer o'chirildi");
                                                }
                                            }}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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

export default Couriers;
