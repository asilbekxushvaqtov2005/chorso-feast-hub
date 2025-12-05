import { Package, Truck, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/context/OrderContext";

const OrderSection = () => {
  const { setOrderType } = useOrder();

  const handleOrderTypeSelect = (type: 'pickup' | 'delivery') => {
    setOrderType(type);


    // Initiate phone call based on order type
    const phoneNumber = type === 'pickup' ? '+998507250309' : '+998975960976';
    window.location.href = `tel:${phoneNumber}`;

    // Scroll to menu section
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="order" className="py-20 bg-cream-dark">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-gold font-body text-sm tracking-widest uppercase mb-2 block">
            Buyurtma Berish
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold mb-4">
            Qanday Olmoqchisiz?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Olib ketish yoki yetkazib berish - tanlang va buyurtma bering
          </p>
        </div>

        {/* Order Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Takeaway Card */}
          <div className="bg-card rounded-3xl p-8 shadow-card hover:shadow-elevated transition-all duration-500 group hover:-translate-y-2">
            <div className="w-20 h-20 bg-gold/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold/30 transition-colors">
              <Package className="w-10 h-10 text-gold" />
            </div>
            <h3 className="font-display text-2xl text-foreground font-bold mb-3">
              Olib Ketish
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Buyurtmangizni tayyorlab qo'yamiz. O'zingiz kelib olib ketasiz.
              Tezroq va qulay!
            </p>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <Clock className="w-5 h-5 text-gold" />
              <span>15-20 daqiqa tayyorlanadi</span>
            </div>
            <Button
              variant="order"
              size="lg"
              className="w-full"
              onClick={() => handleOrderTypeSelect('pickup')}
            >
              <Phone className="w-5 h-5" />
              +998 50 725 03 09
            </Button>
          </div>

          {/* Delivery Card */}
          <div className="bg-card rounded-3xl p-8 shadow-card hover:shadow-elevated transition-all duration-500 group hover:-translate-y-2">
            <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
              <Truck className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display text-2xl text-foreground font-bold mb-3">
              Yetkazib Berish
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Issiq taomlarni uyingizgacha yetkazib beramiz.
              Qulay va tez xizmat!
            </p>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <span>30-45 daqiqada yetkazamiz</span>
            </div>
            <Button
              variant="order"
              size="lg"
              className="w-full"
              onClick={() => handleOrderTypeSelect('delivery')}
            >
              <Phone className="w-5 h-5" />
              +998 97 596 09 76
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Savol bo'lsa, biz bilan bog'laning
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="text-foreground font-semibold">
              📍 Shaxrisabz, Yangi bozor yonida
            </span>
            <span className="text-foreground font-semibold">
              🕐 Har kuni 10:00 - 22:00
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;
