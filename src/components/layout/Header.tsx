
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { toast } = useToast();
  const { cart } = useCart();

  const cartItemsCount = cart.items.length;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/uploads/eea408af-c5b1-4a7d-9462-d5f83769cacd.png" 
            alt="HealMeal Logo" 
            className="w-10 h-10 object-contain" 
          />
          <span className="text-2xl font-bold text-heal-600">HealMeal</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/profile" className="text-foreground hover:text-primary transition-colors">
            My Profile
          </Link>
          <Link to="/meals" className="text-foreground hover:text-primary transition-colors">
            Meal Suggestions
          </Link>
          <Link to="/tracker" className="text-foreground hover:text-primary transition-colors">
            Meal Tracker
          </Link>
          <Button 
            variant="outline" 
            className="ml-2"
            onClick={() => toast({
              title: "Coming Soon!",
              description: "This feature will be available in a future update.",
            })}
          >
            Share Plan
          </Button>
          <Link to="/cart" className="relative flex items-center">
            <ShoppingCart className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
            {cartItemsCount > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cartItemsCount}
              </Badge>
            )}
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <Link to="/cart" className="relative flex items-center mr-2">
            <ShoppingCart className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
            {cartItemsCount > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cartItemsCount}
              </Badge>
            )}
          </Link>
          <button className="text-foreground" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/profile" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              My Profile
            </Link>
            <Link 
              to="/meals" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Meal Suggestions
            </Link>
            <Link 
              to="/tracker" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Meal Tracker
            </Link>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Coming Soon!",
                  description: "This feature will be available in a future update.",
                });
                setIsMenuOpen(false);
              }}
            >
              Share Plan
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
