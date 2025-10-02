import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import DefaulterTracking from "./pages/DefaulterTracking";
import RiskDashboard from "./pages/RiskDashboard";
import IndividualAssessment from "./pages/IndividualAssessment";
import SyntheticData from "./pages/SyntheticData";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ThemeProvider defaultTheme="light" storageKey="finshield-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen">
              <Navigation />
              <Routes>
                <Route path="/" element={<DefaulterTracking />} />
                <Route path="/risk-dashboard" element={<RiskDashboard />} />
                <Route path="/individual-assessment" element={<IndividualAssessment />} />
                <Route path="/synthetic-data" element={<SyntheticData />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
