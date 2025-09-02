import Hero from "@/components/Hero";
import CreditRiskAnalyzer from "@/components/CreditRiskAnalyzer";
import FloatingChatbot from "@/components/FloatingChatbot";
import { useEffect } from "react";

const DefaulterTracking = () => {
  useEffect(() => {
    document.title = "CreditWise - Defaulter Search & Tracking";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "CreditWise predicts borrower default risk using alternative data.");
  }, []);

  return (
    <main>
      <Hero />
      <section id="analyzer" className="pb-16 md:pb-24">
        <div className="container">
          <CreditRiskAnalyzer />
        </div>
      </section>
      <FloatingChatbot />
    </main>
  );
};

export default DefaulterTracking;