import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Phone, User, MapPin } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Couriers = () => {
    const { couriers, addCourier, deleteCourier } = useAdmin();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        telegramChatId: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) {
            toast.error("Ism va telefon raqam kiritilishi shart");
            return;
        }

        addCourier(formData);
        toast.success("Kuryer qo'shildi");
        setIsDialogOpen(false);
        setFormData({ name: "", phone: "", telegramChatId: "" });
    };

    const handleDelete = (id: string) => {
        if (confirm("Kuryerni o'chirmoqchimisiz?")) {
            deleteCourier(id);
            toast.success("Kuryer o'chirildi");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-display">Kuryerlar</h2>
                    <p className="text-muted-foreground">Yetkazib beruvchilar ro'yxati</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Yangi Kuryer
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {couriers.map((courier) => (
                    <Card key={courier.id} className="border-none shadow-md bg-card hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                        <User className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{courier.name}</h3>
                                        <Badge variant={courier.status === 'active' ? 'default' : 'secondary'} className={courier.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                            {courier.status === 'active' ? 'Faol' : 'Band'}
                                        </Badge>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10" onClick={() => handleDelete(courier.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Phone className="w-4 h-4 mr-2 text-primary" />
                                    {courier.phone}
                                </div>
                                {courier.telegramChatId && (
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                                        ID: {courier.telegramChatId}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {couriers.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                        <User className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Hozircha kuryerlar yo'q</p>
                        <Button variant="link" onClick={() => setIsDialogOpen(true)}>
                            Birinchi kuryerni qo'shing
                        </Button>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yangi Kuryer Qo'shish</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Ism Familiya</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Vali Valiyev"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon Raqam</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+998 90 123 45 67"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telegramId">Telegram Chat ID (ixtiyoriy)</Label>
                            <Input
                                id="telegramId"
                                value={formData.telegramChatId}
                                onChange={(e) => setFormData({ ...formData, telegramChatId: e.target.value })}
                                placeholder="123456789"
                            />
                            <p className="text-xs text-muted-foreground">
                                Bot orqali buyurtma yuborish uchun kerak. ID ni bilish uchun <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@userinfobot</a> ga kiring.
                            </p>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Bekor qilish</Button>
                            <Button type="submit">Qo'shish</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Couriers;
