import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBag } from "lucide-react";
import type { MenuItem } from "@/data/menuData";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuCard = ({ item, onAddToCart }: MenuCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };

  return (
    <div
      className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-gold/90 text-foreground px-3 py-1 rounded-full text-xs font-semibold">
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-display text-2xl text-foreground font-semibold">
            {item.name}
          </h3>
          <span className="text-gold font-bold text-lg">
            {formatPrice(item.price)}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
          {item.description}
        </p>

        <Button
          variant="order"
          className="w-full group"
          onClick={() => onAddToCart(item)}
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          Savatga qo'shish
        </Button>
      </div>
    </div>
  );
};

export default MenuCard;
