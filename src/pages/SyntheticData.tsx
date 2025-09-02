import { useEffect } from "react";
import FloatingChatbot from "@/components/FloatingChatbot";
import { Button } from "@/components/ui/button";
import { Download, Shuffle, Database } from "lucide-react";

const SyntheticData = () => {
  useEffect(() => {
    document.title = "CreditWise - Synthetic Data Generator";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Generate synthetic credit data for testing and development with CreditWise.");
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Synthetic Data Generator
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate realistic synthetic credit data for testing, development, and model training while maintaining privacy compliance.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8">
          {/* Generator Configuration */}
          <div className="border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Data Generation Settings</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Configure parameters for generating synthetic credit risk datasets that match real-world patterns.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Records</label>
                  <select className="w-full border rounded-md px-3 py-2 bg-background">
                    <option>1,000 records</option>
                    <option>5,000 records</option>
                    <option>10,000 records</option>
                    <option>25,000 records</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Risk Distribution</label>
                  <select className="w-full border rounded-md px-3 py-2 bg-background">
                    <option>Balanced (33% each risk level)</option>
                    <option>Low Risk Heavy (60% low, 30% medium, 10% high)</option>
                    <option>High Risk Heavy (20% low, 30% medium, 50% high)</option>
                    <option>Custom Distribution</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Data Complexity</label>
                  <select className="w-full border rounded-md px-3 py-2 bg-background">
                    <option>Basic (Core features only)</option>
                    <option>Standard (All standard features)</option>
                    <option>Advanced (Including SMS patterns)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Output Format</label>
                  <select className="w-full border rounded-md px-3 py-2 bg-background">
                    <option>CSV</option>
                    <option>Excel (XLSX)</option>
                    <option>JSON</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button className="bg-gradient-primary hover:opacity-90">
                <Shuffle className="w-4 h-4 mr-2" />
                Generate Dataset
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Sample
              </Button>
            </div>
          </div>

          {/* Features and Benefits */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Realistic behavioral patterns</li>
                <li>• Privacy-compliant synthetic data</li>
                <li>• Customizable risk distributions</li>
                <li>• Multiple output formats</li>
                <li>• Scalable dataset sizes</li>
                <li>• SMS pattern simulation</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold mb-3">Use Cases</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Model training and validation</li>
                <li>• System testing and QA</li>
                <li>• Demo environments</li>
                <li>• Algorithm benchmarking</li>
                <li>• Developer training datasets</li>
                <li>• Privacy-safe data sharing</li>
              </ul>
            </div>
          </div>

          {/* Generated Data Preview */}
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">Preview Generated Data</h3>
            <div className="bg-muted/20 rounded-lg p-8 text-center text-muted-foreground">
              <p className="text-lg font-medium mb-2">No Data Generated Yet</p>
              <p>Generate a dataset above to see a preview of the synthetic data structure and sample records.</p>
            </div>
          </div>
        </div>
      </div>
      <FloatingChatbot />
    </main>
  );
};

export default SyntheticData;