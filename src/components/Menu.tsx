import { useState, useMemo } from "react";
import MenuCard from "./MenuCard";
import { type MenuItem } from "@/data/menuData";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";

interface MenuProps {
  onAddToCart: (item: MenuItem) => void;
}

const Menu = ({ onAddToCart }: MenuProps) => {
  const { menuItems } = useAdmin();
  const [activeCategory, setActiveCategory] = useState("Hammasi");

  const categories = useMemo(() => {
    const uniqueCategories = new Set(menuItems.map((item) => item.category));
    return ["Hammasi", ...Array.from(uniqueCategories)];
  }, [menuItems]);

  const filteredItems = activeCategory === "Hammasi"
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const handleAddToCart = (item: MenuItem) => {
    onAddToCart(item);
    toast.success(`${item.name} savatga qo'shildi!`);
  };

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-gold font-body text-sm tracking-widest uppercase mb-2 block">
            Bizning Taomlar
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold mb-4">
            Menyu
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Eng mazali o'zbek milliy taomlari sizni kutmoqda
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MenuCard item={item} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
