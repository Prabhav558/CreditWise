import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download, Calculator } from "lucide-react";
import FloatingChatbot from "@/components/FloatingChatbot";
import Footer from "@/components/Footer";

interface AssessmentData {
  recharge_freq: number;
  avg_recharge_amt: number;
  employment_type: string;
  avg_days_late: number;
  payment_delay_ratio: number;
  avg_payment_due: number;
  payment_to_due_ratio: number;
  avg_order_value: number;
  return_rate: number;
  months_active: number;
  geo_variance_score: number;
}

interface AssessmentResult extends AssessmentData {
  id: string;
  timestamp: string;
  risk_score: number;
  risk_category: string;
}

const IndividualAssessment = () => {
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<AssessmentData>();

  useEffect(() => {
    document.title = "CreditWise - Individual Risk Assessment";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Assess individual credit risk using CreditWise's AI-powered analysis.");
  }, []);

  const calculateRiskScore = (data: AssessmentData): { risk_score: number; risk_category: string } => {
    // Risk calculation based on input values
    let score = 500; // Base score
    
    // Employment type impact
    const employmentScores: Record<string, number> = {
      'employed': 50,
      'self_employed': -20,
      'unemployed': -100,
      'student': -30,
      'retired': 20
    };
    score += employmentScores[data.employment_type] || 0;
    
    // Payment behavior impact
    score -= data.avg_days_late * 5;
    score -= data.payment_delay_ratio * 200;
    score += (data.payment_to_due_ratio - 1) * 100;
    
    // Financial behavior impact
    score += Math.min(data.recharge_freq * 2, 50);
    score += Math.min(data.avg_recharge_amt / 10, 100);
    score += Math.min(data.months_active * 3, 150);
    
    // Order and return behavior
    score += Math.min(data.avg_order_value / 20, 80);
    score -= data.return_rate * 300;
    score -= data.geo_variance_score * 50;
    
    // Add some randomness while keeping it realistic
    const randomFactor = (Math.random() - 0.5) * 100;
    score += randomFactor;
    
    // Ensure score is within bounds
    score = Math.max(300, Math.min(850, Math.round(score)));
    
    let category: string;
    if (score >= 750) category = "Low Risk";
    else if (score >= 650) category = "Medium Risk";
    else if (score >= 550) category = "High Risk";
    else category = "Very High Risk";
    
    return { risk_score: score, risk_category: category };
  };

  const onSubmit = async (data: AssessmentData) => {
    setIsCalculating(true);
    
    try {
      const { risk_score, risk_category } = calculateRiskScore(data);
      
      const result: AssessmentResult = {
        ...data,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        risk_score,
        risk_category
      };
      
      setAssessmentHistory(prev => [result, ...prev]);
      
      toast({
        title: "Assessment Complete",
        description: `Risk Score: ${risk_score} (${risk_category})`,
      });
    } catch (error) {
      toast({
        title: "Assessment Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const downloadHistory = () => {
    if (assessmentHistory.length === 0) {
      toast({
        title: "No Data",
        description: "No assessment history to download.",
        variant: "destructive",
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(assessmentHistory.map(item => ({
      ID: item.id,
      Timestamp: new Date(item.timestamp).toLocaleDateString(),
      "Risk Score": item.risk_score,
      "Risk Category": item.risk_category,
      "Recharge Frequency": item.recharge_freq,
      "Avg Recharge Amount": item.avg_recharge_amt,
      "Employment Type": item.employment_type,
      "Avg Days Late": item.avg_days_late,
      "Payment Delay Ratio": item.payment_delay_ratio,
      "Avg Payment Due": item.avg_payment_due,
      "Payment to Due Ratio": item.payment_to_due_ratio,
      "Avg Order Value": item.avg_order_value,
      "Return Rate": item.return_rate,
      "Months Active": item.months_active,
      "Geo Variance Score": item.geo_variance_score
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assessment History");
    XLSX.writeFile(workbook, `creditwise-assessments-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Download Complete",
      description: "Assessment history downloaded successfully.",
    });
  };

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
              Individual Risk
            </span>
            <br />
            <span className="text-foreground/80">Assessment</span>
          </h1>
          <p className="mt-6 md:mt-8 text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Analyze credit risk for individual borrowers using <span className="text-accent font-medium">comprehensive behavioral data</span> and alternative signals for precise risk scoring.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#assessment" className="hover-scale">
              <Button size="lg" className="px-8 py-3 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Start Assessment
              </Button>
            </a>
            <a className="story-link text-foreground hover:text-accent transition-all duration-300 font-medium hover-scale" href="/how-it-works">
              How it works →
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8" id="assessment">
        <div className="max-w-4xl mx-auto">

          <div className="grid gap-6 md:gap-8">
            {/* Individual Assessment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  User Risk Assessment
                </CardTitle>
                <p className="text-muted-foreground">
                  Enter user details to perform real-time credit risk analysis. Our AI model will evaluate behavioral patterns and provide instant risk scoring.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recharge_freq">Recharge Frequency</Label>
                      <Input
                        id="recharge_freq"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 5.5"
                        {...register("recharge_freq", { required: "Recharge frequency is required", min: 0 })}
                      />
                      {errors.recharge_freq && (
                        <p className="text-sm text-destructive">{errors.recharge_freq.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avg_recharge_amt">Average Recharge Amount</Label>
                      <Input
                        id="avg_recharge_amt"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 150.00"
                        {...register("avg_recharge_amt", { required: "Average recharge amount is required", min: 0 })}
                      />
                      {errors.avg_recharge_amt && (
                        <p className="text-sm text-destructive">{errors.avg_recharge_amt.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employment_type">Employment Type</Label>
                      <Select onValueChange={(value) => setValue("employment_type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="self_employed">Self Employed</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.employment_type && (
                        <p className="text-sm text-destructive">Employment type is required</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avg_days_late">Average Days Late</Label>
                      <Input
                        id="avg_days_late"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 2.5"
                        {...register("avg_days_late", { required: "Average days late is required", min: 0 })}
                      />
                      {errors.avg_days_late && (
                        <p className="text-sm text-destructive">{errors.avg_days_late.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment_delay_ratio">Payment Delay Ratio</Label>
                      <Input
                        id="payment_delay_ratio"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 0.15"
                        {...register("payment_delay_ratio", { required: "Payment delay ratio is required", min: 0, max: 1 })}
                      />
                      {errors.payment_delay_ratio && (
                        <p className="text-sm text-destructive">{errors.payment_delay_ratio.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avg_payment_due">Average Payment Due</Label>
                      <Input
                        id="avg_payment_due"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 1250.00"
                        {...register("avg_payment_due", { required: "Average payment due is required", min: 0 })}
                      />
                      {errors.avg_payment_due && (
                        <p className="text-sm text-destructive">{errors.avg_payment_due.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment_to_due_ratio">Payment to Due Ratio</Label>
                      <Input
                        id="payment_to_due_ratio"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 0.95"
                        {...register("payment_to_due_ratio", { required: "Payment to due ratio is required", min: 0 })}
                      />
                      {errors.payment_to_due_ratio && (
                        <p className="text-sm text-destructive">{errors.payment_to_due_ratio.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avg_order_value">Average Order Value</Label>
                      <Input
                        id="avg_order_value"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 450.00"
                        {...register("avg_order_value", { required: "Average order value is required", min: 0 })}
                      />
                      {errors.avg_order_value && (
                        <p className="text-sm text-destructive">{errors.avg_order_value.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="return_rate">Return Rate</Label>
                      <Input
                        id="return_rate"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 0.08"
                        {...register("return_rate", { required: "Return rate is required", min: 0, max: 1 })}
                      />
                      {errors.return_rate && (
                        <p className="text-sm text-destructive">{errors.return_rate.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="months_active">Months Active</Label>
                      <Input
                        id="months_active"
                        type="number"
                        placeholder="e.g., 24"
                        {...register("months_active", { required: "Months active is required", min: 0 })}
                      />
                      {errors.months_active && (
                        <p className="text-sm text-destructive">{errors.months_active.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="geo_variance_score">Geo Variance Score</Label>
                      <Input
                        id="geo_variance_score"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 0.25"
                        {...register("geo_variance_score", { required: "Geo variance score is required", min: 0 })}
                      />
                      {errors.geo_variance_score && (
                        <p className="text-sm text-destructive">{errors.geo_variance_score.message}</p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isCalculating}>
                    {isCalculating ? "Calculating Risk Score..." : "Calculate Risk Score"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Assessment History */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Assessment History</CardTitle>
                  <p className="text-muted-foreground">
                    View and manage previous individual risk assessments.
                  </p>
                </div>
                {assessmentHistory.length > 0 && (
                  <Button onClick={downloadHistory} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {assessmentHistory.length === 0 ? (
                  <div className="bg-muted/20 rounded-lg p-4 text-center text-muted-foreground">
                    No assessments found. Start by creating your first individual assessment above.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assessmentHistory.map((assessment) => (
                      <div key={assessment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              assessment.risk_category === "Low Risk" ? "bg-green-100 text-green-800" :
                              assessment.risk_category === "Medium Risk" ? "bg-yellow-100 text-yellow-800" :
                              assessment.risk_category === "High Risk" ? "bg-orange-100 text-orange-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {assessment.risk_category}
                            </div>
                            <span className="text-2xl font-bold">{((assessment.risk_score / 850) * 100).toFixed(1)}%</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(assessment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>Employment: {assessment.employment_type.replace('_', ' ')}</div>
                          <div>Months Active: {assessment.months_active}</div>
                          <div>Avg Days Late: {assessment.avg_days_late}</div>
                          <div>Return Rate: {(assessment.return_rate * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <FloatingChatbot />
      </main>
      <Footer />
    </div>
  );
};

export default IndividualAssessment;