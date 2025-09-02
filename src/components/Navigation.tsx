import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Defaulter Search & Tracking" },
    { path: "/individual-assessment", label: "Individual Risk Assessment" },
    { path: "/synthetic-data", label: "Synthetic Data Generator" },
    { path: "/how-it-works", label: "How it Works" }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary font-semibold">
            <Shield size={24} className="text-accent" />
            <span className="text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CreditWise</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-gray-600 hover:text-primary hover:bg-accent/10 transition-all duration-200 ${
                    location.pathname === item.path 
                      ? "bg-accent/15 text-primary font-medium shadow-sm" 
                      : ""
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-accent/10">
              <Shield size={20} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;