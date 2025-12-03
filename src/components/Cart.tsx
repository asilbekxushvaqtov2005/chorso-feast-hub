import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-elevated transform transition-transform animate-scale-in">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">Savat</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
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
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-card">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">Jami:</span>
                <span className="font-display text-2xl font-bold text-foreground">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Button variant="order" size="lg" className="w-full">
                Buyurtma Berish
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
