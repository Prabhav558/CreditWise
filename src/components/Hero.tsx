import { Button } from "@/components/ui/button";
import { Shield, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <header className="relative overflow-hidden bg-gradient-subtle">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 size-[420px] rounded-full blur-3xl opacity-30 bg-gradient-to-br from-accent/40 to-primary/40" />
        <div className="absolute -bottom-24 -right-24 size-[420px] rounded-full blur-3xl opacity-25 bg-gradient-to-br from-primary/40 to-accent/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full blur-3xl opacity-10 bg-gradient-to-br from-accent to-primary" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center py-16 md:py-24 animate-enter">
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            Credit Risk Prediction
          </span>
          <br />
          <span className="text-foreground/80">Engine</span>
        </h1>
        <p className="mt-6 md:mt-8 text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Predict Probability of Default using <span className="text-accent font-medium">alternative behavioral signals</span>. Upload your dataset and assess risk instantly with our AI-powered analytics.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#analyzer" className="hover-scale">
            <Button size="lg" className="px-8 py-3 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Get Started
            </Button>
          </a>
          <a className="story-link text-foreground hover:text-accent transition-all duration-300 font-medium hover-scale" href="/how-it-works">
            How it works →
          </a>
        </div>
      </div>
    </header>
  );
};

export default Hero;
