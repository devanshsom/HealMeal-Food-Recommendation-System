
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src="/uploads/eea408af-c5b1-4a7d-9462-d5f83769cacd.png" 
                alt="HealMeal Logo" 
                className="w-8 h-8 object-contain" 
              />
              <span className="text-xl font-bold text-heal-600">HealMeal</span>
            </Link>
            <p className="text-muted-foreground">
              Personalized meal plans designed to heal and nourish your body based on your health conditions.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/meals" className="text-muted-foreground hover:text-primary transition-colors">
                  Meal Suggestions
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="text-muted-foreground hover:text-primary transition-colors">
                  Meal Tracker
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <p className="text-sm text-muted-foreground mt-4">
                  © {new Date().getFullYear()} HealMeal. All rights reserved.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
