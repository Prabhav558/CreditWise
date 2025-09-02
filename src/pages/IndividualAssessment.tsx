import { useEffect } from "react";
import FloatingChatbot from "@/components/FloatingChatbot";

const IndividualAssessment = () => {
  useEffect(() => {
    document.title = "CreditWise - Individual Risk Assessment";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Assess individual credit risk using CreditWise's AI-powered analysis.");
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Individual Risk Assessment
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Analyze credit risk for individual borrowers using comprehensive behavioral data and alternative signals.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8">
          {/* Individual Assessment Form */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">User Risk Assessment</h2>
            <p className="text-muted-foreground mb-6">
              Enter user details to perform real-time credit risk analysis. Our AI model will evaluate behavioral patterns and provide instant risk scoring.
            </p>
            
            <div className="bg-muted/30 border border-dashed rounded-lg p-8 text-center">
              <div className="text-muted-foreground">
                <p className="text-lg font-medium mb-2">Individual Assessment Feature</p>
                <p>This feature will allow you to:</p>
                <ul className="mt-4 space-y-2 text-left max-w-md mx-auto">
                  <li>• Enter user details manually</li>
                  <li>• Get instant risk probability scores</li>
                  <li>• View detailed risk breakdown</li>
                  <li>• Export individual assessment reports</li>
                </ul>
                <p className="mt-6 text-sm text-muted-foreground">
                  Feature coming soon - integrate with your assessment workflow
                </p>
              </div>
            </div>
          </div>

          {/* Assessment History */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Assessment History</h2>
            <p className="text-muted-foreground mb-4">
              View and manage previous individual risk assessments.
            </p>
            <div className="bg-muted/20 rounded-lg p-4 text-center text-muted-foreground">
              No assessments found. Start by creating your first individual assessment above.
            </div>
          </div>
        </div>
      </div>
      <FloatingChatbot />
    </main>
  );
};

export default IndividualAssessment;