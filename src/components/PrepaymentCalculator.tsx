import { useState, useMemo } from "react";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { 
  Wallet, 
  TrendingDown, 
  Clock, 
  IndianRupee,
  Zap,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PrepaymentCalculatorProps {
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  originalEMI: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const PrepaymentCalculator = ({
  loanAmount,
  interestRate,
  tenureMonths,
  originalEMI,
}: PrepaymentCalculatorProps) => {
  const [extraPayment, setExtraPayment] = useState(5000);
  const [prepaymentType, setPrepaymentType] = useState<"monthly" | "yearly" | "onetime">("monthly");
  const [onetimeAmount, setOnetimeAmount] = useState(100000);

  const calculations = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100;
    
    // Original loan calculations
    const originalTotalAmount = originalEMI * tenureMonths;
    const originalTotalInterest = originalTotalAmount - loanAmount;

    // Calculate with prepayment
    let balance = loanAmount;
    let monthsPaid = 0;
    let totalInterestPaid = 0;
    let totalPrepayment = 0;

    // Apply one-time prepayment at start if selected
    if (prepaymentType === "onetime" && onetimeAmount > 0) {
      balance = Math.max(0, balance - onetimeAmount);
      totalPrepayment = onetimeAmount;
    }

    while (balance > 0 && monthsPaid < tenureMonths * 2) {
      // Calculate interest for this month
      const interestForMonth = balance * monthlyRate;
      totalInterestPaid += interestForMonth;

      // Principal paid this month
      const principalPaid = Math.min(originalEMI - interestForMonth, balance);
      balance -= principalPaid;

      // Apply extra monthly payment
      if (prepaymentType === "monthly" && extraPayment > 0 && balance > 0) {
        const extraPrincipal = Math.min(extraPayment, balance);
        balance -= extraPrincipal;
        totalPrepayment += extraPrincipal;
      }

      // Apply yearly payment at end of each year
      if (prepaymentType === "yearly" && (monthsPaid + 1) % 12 === 0 && extraPayment > 0 && balance > 0) {
        const yearlyPrepayment = extraPayment * 12;
        const extraPrincipal = Math.min(yearlyPrepayment, balance);
        balance -= extraPrincipal;
        totalPrepayment += extraPrincipal;
      }

      monthsPaid++;

      if (balance <= 0) break;
    }

    const newTotalAmount = (originalEMI * monthsPaid) + totalPrepayment;
    const newTotalInterest = totalInterestPaid;

    const monthsSaved = tenureMonths - monthsPaid;
    const interestSaved = originalTotalInterest - newTotalInterest;
    const totalSaved = interestSaved;

    return {
      originalTenure: tenureMonths,
      newTenure: monthsPaid,
      monthsSaved: Math.max(0, monthsSaved),
      yearsSaved: Math.max(0, monthsSaved / 12),
      originalInterest: originalTotalInterest,
      newInterest: newTotalInterest,
      interestSaved: Math.max(0, interestSaved),
      totalPrepayment,
      totalSaved: Math.max(0, totalSaved),
      savingsPercentage: originalTotalInterest > 0 
        ? ((interestSaved / originalTotalInterest) * 100) 
        : 0,
    };
  }, [loanAmount, interestRate, tenureMonths, originalEMI, extraPayment, prepaymentType, onetimeAmount]);

  const maxExtraPayment = Math.round(originalEMI * 2);

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-accent/10">
          <Zap className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Prepayment Calculator</h2>
          <p className="text-sm text-muted-foreground">See how extra payments reduce your loan</p>
        </div>
      </div>

      {/* Prepayment Type Selector */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { value: "monthly", label: "Monthly Extra" },
          { value: "yearly", label: "Yearly Extra" },
          { value: "onetime", label: "One-time" },
        ].map((type) => (
          <button
            key={type.value}
            onClick={() => setPrepaymentType(type.value as typeof prepaymentType)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
              prepaymentType === type.value
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Extra Payment Input */}
      <div className="space-y-4 mb-8">
        {prepaymentType === "onetime" ? (
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4 text-accent" />
              One-time Prepayment Amount
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                value={onetimeAmount}
                onChange={(e) => setOnetimeAmount(Math.max(0, Number(e.target.value)))}
                className="pl-10 h-12 text-lg bg-background/50 border-border/50"
              />
            </div>
            <Slider
              value={[onetimeAmount]}
              onValueChange={([value]) => setOnetimeAmount(value)}
              min={10000}
              max={loanAmount * 0.5}
              step={10000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹10K</span>
              <span>{formatCurrency(loanAmount * 0.5)}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4 text-accent" />
              Extra {prepaymentType === "monthly" ? "Monthly" : "Monthly (Applied Yearly)"} Payment
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(Math.max(0, Number(e.target.value)))}
                className="pl-10 h-12 text-lg bg-background/50 border-border/50"
              />
            </div>
            <Slider
              value={[extraPayment]}
              onValueChange={([value]) => setExtraPayment(value)}
              min={1000}
              max={maxExtraPayment}
              step={500}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹1K</span>
              <span>{formatCurrency(maxExtraPayment)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* Time Saved */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Time Saved</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">
                {calculations.yearsSaved.toFixed(1)} years
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                ({calculations.monthsSaved} months)
              </span>
            </div>
          </div>
        </div>

        {/* Interest Saved */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Interest Saved</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-green-500">
                {formatCurrency(calculations.interestSaved)}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                ({calculations.savingsPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Original Tenure</p>
            <p className="text-lg font-semibold text-foreground">
              {(calculations.originalTenure / 12).toFixed(1)} years
            </p>
            <p className="text-xs text-muted-foreground">
              {calculations.originalTenure} months
            </p>
          </div>
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
            <p className="text-xs text-muted-foreground mb-1">New Tenure</p>
            <p className="text-lg font-semibold text-primary">
              {(calculations.newTenure / 12).toFixed(1)} years
            </p>
            <p className="text-xs text-muted-foreground">
              {calculations.newTenure} months
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Original Interest</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(calculations.originalInterest)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <p className="text-xs text-muted-foreground mb-1">New Interest</p>
            <p className="text-lg font-semibold text-green-500">
              {formatCurrency(calculations.newInterest)}
            </p>
          </div>
        </div>

        {/* Visual Progress */}
        <div className="mt-6 p-4 rounded-xl bg-muted/20 border border-border/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Loan Timeline</span>
            <span className="text-xs text-green-500 font-medium">
              {calculations.savingsPercentage.toFixed(0)}% faster payoff
            </span>
          </div>
          
          {/* Original Timeline */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground w-20">Original</span>
              <div className="flex-1 h-3 rounded-full bg-muted/50 overflow-hidden">
                <div className="h-full bg-muted-foreground/50 rounded-full" style={{ width: "100%" }} />
              </div>
              <span className="text-xs text-muted-foreground w-16 text-right">
                {(calculations.originalTenure / 12).toFixed(1)}y
              </span>
            </div>
          </div>

          {/* New Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground w-20">With Prepay</span>
              <div className="flex-1 h-3 rounded-full bg-muted/50 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-500" 
                  style={{ width: `${(calculations.newTenure / calculations.originalTenure) * 100}%` }} 
                />
              </div>
              <span className="text-xs text-green-500 font-medium w-16 text-right">
                {(calculations.newTenure / 12).toFixed(1)}y
              </span>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-4 p-4 rounded-xl bg-accent/10 border border-accent/20">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h4 className="font-semibold text-accent mb-1">Smart Tip</h4>
              <p className="text-sm text-muted-foreground">
                {calculations.savingsPercentage > 20
                  ? "Great savings! Your prepayment strategy will significantly reduce your loan burden."
                  : "Even small extra payments add up. Try increasing your monthly prepayment to save more on interest."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrepaymentCalculator;
