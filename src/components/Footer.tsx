import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground dark:bg-muted dark:text-foreground border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* CreditWise Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-foreground dark:text-foreground">CreditWise</h3>
            <p className="text-primary-foreground/80 dark:text-muted-foreground leading-relaxed">
              Advanced AI technology to predict credit risk and probability of default using alternative behavioral signals and real-time data analytics.
            </p>
            <div className="flex items-center gap-2 text-primary-foreground/70 dark:text-muted-foreground hover:text-primary-foreground dark:hover:text-foreground transition-colors">
              <Github size={20} />
              <a href="https://github.com/Prabhav558/CreditWise" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Contribute on GitHub
              </a>
            </div>
          </div>

          {/* Developers Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-foreground dark:text-foreground">Developers</h3>
            <div className="space-y-2">
              <a 
                href="https://github.com/kr1shnasomani" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-primary-foreground/80 dark:text-muted-foreground hover:text-primary-foreground dark:hover:text-foreground transition-colors hover:underline"
              >
                Krishna Somani
              </a>
              <a 
                href="https://github.com/Prabhav558" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-primary-foreground/80 dark:text-muted-foreground hover:text-primary-foreground dark:hover:text-foreground transition-colors hover:underline"
              >
                Prabhav Singh
              </a>
              <a 
                href="https://github.com/sarthaklal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-primary-foreground/80 dark:text-muted-foreground hover:text-primary-foreground dark:hover:text-foreground transition-colors hover:underline"
              >
                Sarthak Lal
              </a>
            </div>
          </div>

          {/* About Our Technology Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-foreground dark:text-foreground">About Our Technology</h3>
            <p className="text-primary-foreground/80 dark:text-muted-foreground leading-relaxed">
              The system performs automatic credit risk assessment using a pre-trained machine learning model. It loads behavioral data and financial indicators, processes the input variables, predicts default probability, combines risk factors with credit history, and converts the result to a comprehensive risk score.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 dark:border-border text-center">
          <p className="text-primary-foreground/70 dark:text-muted-foreground">
            © 2025 CreditWise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;