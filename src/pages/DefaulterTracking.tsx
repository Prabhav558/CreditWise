import Hero from "@/components/Hero";
import CreditRiskAnalyzer from "@/components/CreditRiskAnalyzer";
import FloatingChatbot from "@/components/FloatingChatbot";
import Footer from "@/components/Footer";
import { useEffect } from "react";

function DefaulterTrackingContent() {

  useEffect(() => {
    document.title = "CreditWise - Defaulter Search & Tracking";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "CreditWise predicts borrower default risk using alternative data.");
  }, []);

  return (
    <main>
      <Hero />
      
      <FloatingChatbot />
      <Footer />
    </main>
  );
}

export default DefaulterTrackingContent;