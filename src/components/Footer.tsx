import { ChefHat, Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-burgundy-dark text-cream py-16 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-8 h-8 text-gold" />
              <span className="font-display text-2xl font-bold">Chorsu Restoran</span>
            </div>
            <p className="text-cream/70 leading-relaxed">
              Eng mazali o'zbek milliy taomlari. An'anaviy retseptlar, sifatli mahsulotlar.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Aloqa</h3>
            <div className="space-y-3">
              <a href="tel:+998507250309" className="flex items-center gap-3 text-cream/80 hover:text-gold transition-colors">
                <Phone className="w-5 h-5 text-gold" />
                <span>+998 50 725 03 09</span>
              </a>
              <div className="flex items-center gap-3 text-cream/80">
                <MapPin className="w-5 h-5 text-gold" />
                <span>Shaxrisabz, Yangi bozor yaqinida</span>
              </div>
              <div className="flex items-center gap-3 text-cream/80">
                <Clock className="w-5 h-5 text-gold" />
                <span>Har kuni 10:00 - 22:00</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Ijtimoiy tarmoqlar</h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/070_aslbe"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-cream/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-cream/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-12 pt-8 text-center text-cream/60">
          <p>© 2024 Chorsu Restoran. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
