import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Navigation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { path: "/", label: t('nav.defaulter') },
    { path: "/individual-assessment", label: t('nav.individual') },
    { path: "/synthetic-data", label: t('nav.synthetic') },
    { path: "/how-it-works", label: t('nav.howItWorks') }
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
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
                  className={`text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all duration-200 ${
                    location.pathname === item.path 
                      ? "bg-accent/15 text-foreground font-medium shadow-sm" 
                      : ""
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <LanguageSelector />
            <ThemeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
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