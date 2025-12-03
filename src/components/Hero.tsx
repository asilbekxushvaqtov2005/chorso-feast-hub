import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { ChefHat } from "lucide-react";

const Hero = () => {
  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-hero-gradient opacity-85" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ChefHat className="w-10 h-10 text-gold" />
            <span className="text-gold font-body text-lg tracking-widest uppercase">
              An'anaviy Ta'mlar
            </span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream font-bold mb-6 leading-tight">
            Chorsu
            <span className="block text-gold">Restoran</span>
          </h1>
          
          <p className="text-cream/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            O'zbek milliy taomlari bilan tanishing. Bizning oshxonamizda tayyorlangan 
            an'anaviy retseptlar sizni hayratda qoldiradi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="xl" onClick={scrollToMenu}>
              Menyuni Ko'rish
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => document.getElementById("order")?.scrollIntoView({ behavior: "smooth" })}>
              Buyurtma Berish
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
