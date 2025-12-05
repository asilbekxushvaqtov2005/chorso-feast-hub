import { useState } from "react";
import { X, Minus, Plus, ShoppingBag, MapPin, CreditCard, Banknote, Loader2, Package, Truck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAdmin } from "@/context/AdminContext";
import { useOrder } from "@/context/OrderContext";
import { toast } from "sonner";
import type { MenuItem } from "@/data/menuData";

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
}

const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) => {
  const { addOrder } = useAdmin();
  const { orderType, setOrderType } = useOrder();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    paymentMethod: "cash" as "cash" | "card" | "online",
    location: null as { lat: number; lng: number } | null
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleLocation = () => {
    setLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
          setLoadingLocation(false);
          toast.success("Joylashuv muvaffaqiyatli aniqlandi");
        },
        (error) => {
          setLoadingLocation(false);
          console.error(error);
          toast.error("Joylashuvni aniqlab bo'lmadi. Iltimos, ruxsat bering.");
        }
      );
    } else {
      setLoadingLocation(false);
      toast.error("Brauzeringiz joylashuvni aniqlashni qo'llab-quvvatlamaydi");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) {
      toast.error("Iltimos, telefon raqamingizni kiriting");
      return;
    }

    if (!formData.name) {
      toast.error("Iltimos, ismingizni kiriting");
      return;
    }

    // Validate location for delivery orders
    if (orderType === 'delivery' && !formData.location) {
      toast.error("Yetkazib berish uchun joylashuvni aniqlang");
      return;
    }

    addOrder({
      customerName: formData.name,
      phone: formData.phone,
      location: formData.location,
      paymentMethod: formData.paymentMethod,
      items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total: totalPrice,
      deliveryType: orderType || 'pickup', // Default to pickup if not set
    });

    toast.success("Buyurtmangiz qabul qilindi! Tez orada aloqaga chiqamiz.");
    onClearCart();
    setIsCheckingOut(false);
    setFormData({
      phone: "",
      name: "",
      paymentMethod: "cash",
      location: null,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-elevated transform transition-transform animate-scale-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">
              {isCheckingOut ? "Buyurtma berish" : "Savat"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isCheckingOut ? (
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Order Type Selection */}
              <div className="space-y-2">
                <Label>Buyurtma turi</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={orderType === 'pickup' ? 'default' : 'outline'}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => setOrderType('pickup')}
                  >
                    <Package className="w-5 h-5" />
                    <span className="text-sm font-semibold">Olib Ketish</span>
                  </Button>
                  <Button
                    type="button"
                    variant={orderType === 'delivery' ? 'default' : 'outline'}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => setOrderType('delivery')}
                  >
                    <Truck className="w-5 h-5" />
                    <span className="text-sm font-semibold">Yetkazib Berish</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon raqam</Label>
                <Input
                  id="phone"
                  placeholder="+998 90 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Ism</Label>
                <Input
                  id="name"
                  placeholder="Ismingizni kiriting"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Only show location for delivery */}
              {orderType === 'delivery' && (
                <div className="space-y-2">
                  <Label>Joylashuv</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleLocation}
                      disabled={loadingLocation}
                    >
                      {loadingLocation ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="mr-2 h-4 w-4" />
                      )}
                      {formData.location ? "Joylashuv aniqlandi" : "Joylashuvni aniqlash"}
                    </Button>
                  </div>
                  {formData.location && (
                    <p className="text-xs text-green-600">
                      Koordinatalar: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>To'lov turi</Label>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value: "cash" | "card" | "online") =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                  className="grid grid-cols-3 gap-3"
                >
                  <div>
                    <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                    <Label
                      htmlFor="cash"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Banknote className="mb-2 h-5 w-5" />
                      <span className="text-xs">Naqd</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <CreditCard className="mb-2 h-5 w-5" />
                      <span className="text-xs">Karta</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="online" id="online" className="peer sr-only" />
                    <Label
                      htmlFor="online"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Smartphone className="mb-2 h-5 w-5" />
                      <span className="text-xs">Online</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Card Details for Online Payment */}
              {formData.paymentMethod === 'online' && (
                <div className="bg-gradient-to-br from-primary/10 to-gold/10 rounded-xl p-4 border-2 border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Karta ma'lumotlari</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-card rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Karta raqami</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-lg font-bold text-foreground">5614 6805 1298 8102</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText('5614680512988102');
                            toast.success('Karta raqami nusxalandi!');
                          }}
                          className="shrink-0"
                        >
                          Nusxalash
                        </Button>
                      </div>
                    </div>
                    <div className="bg-card rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Karta egasi</p>
                      <p className="font-semibold text-foreground">Asilbek Xushvaqtov</p>
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      💡 To'lovni amalga oshirgandan keyin, buyurtmangiz tez orada tayyorlanadi
                    </p>
                  </div>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Jami:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </form>
          ) : (
            <>
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Savatingiz bo'sh</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-muted rounded-xl p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-gold font-bold">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 bg-card rounded-full hover:bg-background transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 bg-card rounded-full hover:bg-background transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="ml-auto p-1 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-card">
            {!isCheckingOut ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Jami:</span>
                  <span className="font-display text-2xl font-bold text-foreground">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <Button
                  variant="order"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsCheckingOut(true)}
                >
                  Buyurtma Berish
                </Button>
              </>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setIsCheckingOut(false)}
                >
                  Ortga
                </Button>
                <Button
                  variant="order"
                  size="lg"
                  className="flex-1"
                  type="submit"
                  form="checkout-form"
                >
                  Tasdiqlash
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
