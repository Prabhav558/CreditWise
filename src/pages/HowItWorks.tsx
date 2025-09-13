import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import FloatingChatbot from "@/components/FloatingChatbot";
import Footer from "@/components/Footer";
import { Upload, Brain, BarChart3, Download, Shield, TrendingUp, Users, AlertTriangle } from "lucide-react";

const HowItWorks = () => {
  useEffect(() => {
    document.title = "CreditWise - How It Works";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Learn how CreditWise uses alternative data and AI to predict credit risk.");
  }, []);

  return (
    <div>
      <header className="relative overflow-hidden bg-gradient-subtle">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 size-[420px] rounded-full blur-3xl opacity-30 bg-gradient-to-br from-accent/40 to-primary/40" />
          <div className="absolute -bottom-24 -right-24 size-[420px] rounded-full blur-3xl opacity-25 bg-gradient-to-br from-primary/40 to-accent/40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full blur-3xl opacity-10 bg-gradient-to-br from-accent to-primary" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center py-16 md:py-24 animate-enter">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              How CreditWise
            </span>
            <br />
            <span className="text-foreground/80">Works</span>
          </h1>
          <p className="mt-6 md:mt-8 text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Upload a CSV containing <span className="text-accent font-medium">behavioral and transactional signals</span>. Select a user to compute Probability of Default with our AI-powered analytics.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#process" className="hover-scale">
              <Button size="lg" className="px-8 py-3 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                See Process
              </Button>
            </a>
            <a className="story-link text-foreground hover:text-accent transition-all duration-300 font-medium hover-scale" href="/">
              Try it now →
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8" id="process">
        <div className="max-w-5xl mx-auto">

          {/* Process Flow */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Upload Data</h3>
              <p className="text-muted-foreground text-sm">
                Upload CSV with user behavioral and transactional data
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-muted-foreground text-sm">
                AI analyzes patterns and behavioral signals
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Risk Scoring</h3>
              <p className="text-muted-foreground text-sm">
                Generate probability of default scores and risk categories
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">4. Export Results</h3>
              <p className="text-muted-foreground text-sm">
                Download comprehensive risk analysis reports
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="border rounded-lg p-6 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Alternative Data Sources</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>SMS Patterns:</strong> Bank, OTP, UPI transaction patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Behavioral Signals:</strong> Payment delays, cart abandonment</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Geo-variance:</strong> Location stability and patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Digital Footprint:</strong> App usage and engagement metrics</span>
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Risk Categories</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="font-medium">Low Risk (0-20%)</span>
                    <p className="text-sm text-muted-foreground">Safe to lend, minimal monitoring</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <div>
                    <span className="font-medium">Medium Risk (20-80%)</span>
                    <p className="text-sm text-muted-foreground">Moderate caution, regular monitoring</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div>
                    <span className="font-medium">High Risk (80%+)</span>
                    <p className="text-sm text-muted-foreground">High default probability, strict controls</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Requirements */}
          <div className="border rounded-lg p-6 bg-card mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Required Data Fields</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-green-600">Essential Fields</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• user_id - Unique identifier</li>
                  <li>• payment_delay_ratio - Payment delay frequency</li>
                  <li>• avg_recharge_amt - Average recharge amount</li>
                  <li>• cart_abandonment_rate - Shopping cart abandonment</li>
                  <li>• geo_variance_score - Location variance</li>
                  <li>• months_active - User tenure</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-blue-600">Enhanced Fields</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• age, location, employment_type</li>
                  <li>• sms_bank_count, sms_otp_count</li>
                  <li>• sms_upi_count - UPI transaction patterns</li>
                  <li>• avg_order_value, recharge_freq</li>
                  <li>• Additional behavioral signals</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Why CreditWise?</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">For Thin-File Borrowers</h4>
                <p className="text-sm text-muted-foreground">
                  Assess creditworthiness of users with limited traditional credit history using alternative data.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Real-Time Assessment</h4>
                <p className="text-sm text-muted-foreground">
                  Get instant risk scores during loan applications for faster decision making.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Comprehensive Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Export detailed reports with risk breakdowns and actionable insights.
                </p>
              </div>
            </div>
          </div>
        </div>
        <FloatingChatbot />
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;