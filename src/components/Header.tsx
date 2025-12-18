import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, ChefHat, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemsCount, onCartClick }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { customer } = useCustomerAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-card py-3"
          : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <ChefHat className={`w-8 h-8 ${isScrolled ? "text-primary" : "text-gold"}`} />
            <span className={`font-display text-2xl font-bold ${isScrolled ? "text-foreground" : "text-cream"}`}>
              Chorsu
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo("menu")}
              className={`font-semibold transition-colors ${isScrolled ? "text-foreground hover:text-primary" : "text-cream hover:text-gold"
                }`}
            >
              Menyu
            </button>
            <button
              onClick={() => scrollTo("order")}
              className={`font-semibold transition-colors ${isScrolled ? "text-foreground hover:text-primary" : "text-cream hover:text-gold"
                }`}
            >
              Buyurtma
            </button>
          </div>

          {/* Cart & Profile Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(customer ? "/profile" : "/login")}
              className={`p-2 rounded-full transition-colors ${isScrolled ? "bg-muted hover:bg-muted/80" : "bg-cream/20 hover:bg-cream/30"
                }`}
              title={customer ? "Profil" : "Kirish"}
            >
              <User className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-cream"}`} />
            </button>

            <button
              onClick={onCartClick}
              className={`relative p-2 rounded-full transition-colors ${isScrolled ? "bg-muted hover:bg-muted/80" : "bg-cream/20 hover:bg-cream/30"
                }`}
            >
              <ShoppingBag className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-cream"}`} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-full transition-colors ${isScrolled ? "bg-muted hover:bg-muted/80" : "bg-cream/20 hover:bg-cream/30"
                }`}
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-cream"}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-cream"}`} />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-cream/20">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollTo("menu")}
                className={`font-semibold text-left py-2 ${isScrolled ? "text-foreground" : "text-cream"
                  }`}
              >
                Menyu
              </button>
              <button
                onClick={() => scrollTo("order")}
                className={`font-semibold text-left py-2 ${isScrolled ? "text-foreground" : "text-cream"
                  }`}
              >
                Buyurtma
              </button>
              <button
                onClick={() => {
                  navigate(customer ? "/profile" : "/login");
                  setIsMobileMenuOpen(false);
                }}
                className={`font-semibold text-left py-2 ${isScrolled ? "text-foreground" : "text-cream"
                  }`}
              >
                {customer ? "Profil" : "Kirish"}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
