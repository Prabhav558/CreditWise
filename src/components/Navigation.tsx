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
    <nav className="bg-gradient-primary border-b sticky top-0 z-50 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white font-semibold">
            <Shield size={24} />
            <span className="text-lg">CreditWise</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-white/90 hover:text-white hover:bg-white/10 transition-colors ${
                    location.pathname === item.path 
                      ? "bg-white/20 text-white font-medium" 
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
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Shield size={20} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;