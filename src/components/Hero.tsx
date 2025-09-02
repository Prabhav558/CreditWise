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
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 px-4 py-2 text-xs md:text-sm bg-white/80 backdrop-blur-sm shadow-soft">
          <Shield className="text-accent" size={16} />
          <span className="text-primary font-medium">CreditWise — Alternative Data Credit Risk</span>
        </div>
        <h1 className="mt-8 text-4xl md:text-7xl font-bold tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Credit Risk Prediction
          </span>
          <br />
          <span className="text-primary/80">Engine</span>
        </h1>
        <p className="mt-6 md:mt-8 text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Predict Probability of Default using <span className="text-accent font-medium">alternative behavioral signals</span>. Upload your dataset and assess risk instantly with our AI-powered analytics.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#analyzer">
            <Button size="lg" className="px-8 py-3 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started
            </Button>
          </a>
          <a className="story-link text-primary hover:text-accent transition-colors duration-200 font-medium" href="/how-it-works">
            How it works →
          </a>
        </div>
        <div className="mt-12 inline-flex items-center gap-2 text-sm text-muted-foreground bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
          <TrendingUp className="text-accent" size={16} /> 
          <span>Real-time monitoring ready</span>
        </div>
      </div>
    </header>
  );
};

export default Hero;
