import { useState, useMemo } from "react";
import EMIInputCard from "./EMIInputCard";
import ResultCard from "./ResultCard";
import EMIPieChart from "./EMIPieChart";
import AIExplanation from "./AIExplanation";
import LoanComparison from "./LoanComparison";
import PrepaymentCalculator from "./PrepaymentCalculator";
import { Calculator, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [tenureType, setTenureType] = useState<"months" | "years">("years");

  const calculations = useMemo(() => {
    // Convert tenure to months
    const tenureInMonths = tenureType === "years" ? tenure * 12 : tenure;

    // Monthly interest rate
    const monthlyRate = interestRate / 12 / 100;

    // EMI Formula: [P × R × (1+R)^N] / [(1+R)^N − 1]
    let emi: number;
    if (monthlyRate === 0) {
      emi = loanAmount / tenureInMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, tenureInMonths);
      emi = (loanAmount * monthlyRate * factor) / (factor - 1);
    }

    const totalAmount = emi * tenureInMonths;
    const totalInterest = totalAmount - loanAmount;

    return {
      emi: Math.round(emi * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      tenureInMonths,
    };
  }, [loanAmount, interestRate, tenure, tenureType]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-10 md:mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Smart Financial Planning</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            <span className="gradient-text">Smart EMI</span>{" "}
            <span className="text-foreground">Calculator</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Plan your loans intelligently with AI-powered insights and beautiful visualizations
          </p>
        </header>

        {/* Tabs for Calculator and Comparison */}
        <Tabs defaultValue="calculator" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8 glass-card">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-primary/20">
              Calculator
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-primary/20">
              Compare
            </TabsTrigger>
            <TabsTrigger value="prepayment" className="data-[state=active]:bg-primary/20">
              Prepayment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              {/* Left Panel - Inputs */}
              <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
                <EMIInputCard
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  interestRate={interestRate}
                  setInterestRate={setInterestRate}
                  tenure={tenure}
                  setTenure={setTenure}
                  tenureType={tenureType}
                  setTenureType={setTenureType}
                />
              </div>

              {/* Right Panel - Results */}
              <div className="space-y-6 animate-slide-in-right">
                <ResultCard
                  emi={calculations.emi}
                  totalInterest={calculations.totalInterest}
                  totalAmount={calculations.totalAmount}
                />
                <EMIPieChart
                  principal={loanAmount}
                  interest={calculations.totalInterest}
                />
                <AIExplanation
                  emi={calculations.emi}
                  loanAmount={loanAmount}
                  interestRate={interestRate}
                  tenureMonths={calculations.tenureInMonths}
                  totalInterest={calculations.totalInterest}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <LoanComparison />
          </TabsContent>

          <TabsContent value="prepayment">
            <PrepaymentCalculator
              loanAmount={loanAmount}
              interestRate={interestRate}
              tenureMonths={calculations.tenureInMonths}
              originalEMI={calculations.emi}
            />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-16 text-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Powered by precise banking formulas
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EMICalculator;
