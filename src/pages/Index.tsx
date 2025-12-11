import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import OrderSection from "@/components/OrderSection";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import type { MenuItem } from "@/data/menuData";

interface CartItem extends MenuItem {
  quantity: number;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id && i.name === item.name);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id && i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, name: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id, name);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id && item.name === name ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: number, name: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.name === name)));
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemsCount={cartItemsCount} onCartClick={() => setIsCartOpen(true)} />
      <main>
        <Hero />
        <Menu onAddToCart={handleAddToCart} />
        <OrderSection />
      </main>
      <Footer />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
};

export default Index;
