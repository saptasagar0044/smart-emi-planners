import { useState } from "react";
import { Plus, Trash2, Scale, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";

interface LoanOption {
  id: string;
  name: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  tenureType: "months" | "years";
}

interface CalculatedLoan extends LoanOption {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  tenureInMonths: number;
}

const calculateEMI = (loan: LoanOption): CalculatedLoan => {
  const tenureInMonths = loan.tenureType === "years" ? loan.tenure * 12 : loan.tenure;
  const monthlyRate = loan.interestRate / 12 / 100;

  let emi: number;
  if (monthlyRate === 0) {
    emi = loan.loanAmount / tenureInMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureInMonths);
    emi = (loan.loanAmount * monthlyRate * factor) / (factor - 1);
  }

  const totalAmount = emi * tenureInMonths;
  const totalInterest = totalAmount - loan.loanAmount;

  return {
    ...loan,
    emi: Math.round(emi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    tenureInMonths,
  };
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const loanColors = [
  "from-primary/20 to-primary/5 border-primary/30",
  "from-secondary/20 to-secondary/5 border-secondary/30",
  "from-accent/20 to-accent/5 border-accent/30",
  "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
];

const LoanComparison = () => {
  const [loans, setLoans] = useState<LoanOption[]>([
    {
      id: "1",
      name: "Option A",
      loanAmount: 2500000,
      interestRate: 8.5,
      tenure: 20,
      tenureType: "years",
    },
    {
      id: "2",
      name: "Option B",
      loanAmount: 2500000,
      interestRate: 9.0,
      tenure: 15,
      tenureType: "years",
    },
  ]);

  const addLoan = () => {
    if (loans.length >= 4) return;
    const newId = Date.now().toString();
    const optionNames = ["A", "B", "C", "D"];
    setLoans([
      ...loans,
      {
        id: newId,
        name: `Option ${optionNames[loans.length]}`,
        loanAmount: 2500000,
        interestRate: 8.5,
        tenure: 20,
        tenureType: "years",
      },
    ]);
  };

  const removeLoan = (id: string) => {
    if (loans.length <= 2) return;
    setLoans(loans.filter((loan) => loan.id !== id));
  };

  const updateLoan = (id: string, updates: Partial<LoanOption>) => {
    setLoans(
      loans.map((loan) => (loan.id === id ? { ...loan, ...updates } : loan))
    );
  };

  const calculatedLoans = loans.map(calculateEMI);

  // Find best options
  const lowestEMI = Math.min(...calculatedLoans.map((l) => l.emi));
  const lowestInterest = Math.min(...calculatedLoans.map((l) => l.totalInterest));
  const lowestTotal = Math.min(...calculatedLoans.map((l) => l.totalAmount));

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Loan Comparison</h2>
            <p className="text-sm text-muted-foreground">Compare up to 4 loan options</p>
          </div>
        </div>
        {loans.length < 4 && (
          <Button
            onClick={addLoan}
            variant="outline"
            size="sm"
            className="gap-2 border-primary/30 hover:bg-primary/10"
          >
            <Plus className="w-4 h-4" />
            Add Option
          </Button>
        )}
      </div>

      {/* Loan Options Grid */}
      <div className={cn(
        "grid gap-4 mb-8",
        loans.length === 2 && "md:grid-cols-2",
        loans.length === 3 && "md:grid-cols-3",
        loans.length === 4 && "md:grid-cols-2 lg:grid-cols-4"
      )}>
        {loans.map((loan, index) => (
          <div
            key={loan.id}
            className={cn(
              "relative rounded-2xl border bg-gradient-to-br p-4 transition-all duration-300 hover:scale-[1.02]",
              loanColors[index]
            )}
          >
            {/* Remove button */}
            {loans.length > 2 && (
              <button
                onClick={() => removeLoan(loan.id)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Option Name */}
            <Input
              value={loan.name}
              onChange={(e) => updateLoan(loan.id, { name: e.target.value })}
              className="mb-4 text-center font-semibold bg-background/50 border-border/50"
            />

            {/* Loan Amount */}
            <div className="space-y-2 mb-4">
              <label className="text-xs text-muted-foreground">Loan Amount</label>
              <Input
                type="number"
                value={loan.loanAmount}
                onChange={(e) =>
                  updateLoan(loan.id, { loanAmount: Number(e.target.value) })
                }
                className="bg-background/50 border-border/50 text-sm"
              />
              <Slider
                value={[loan.loanAmount]}
                onValueChange={([value]) =>
                  updateLoan(loan.id, { loanAmount: value })
                }
                min={100000}
                max={10000000}
                step={50000}
                className="mt-2"
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-2 mb-4">
              <label className="text-xs text-muted-foreground">Interest Rate (%)</label>
              <Input
                type="number"
                value={loan.interestRate}
                onChange={(e) =>
                  updateLoan(loan.id, { interestRate: Number(e.target.value) })
                }
                step="0.1"
                className="bg-background/50 border-border/50 text-sm"
              />
              <Slider
                value={[loan.interestRate]}
                onValueChange={([value]) =>
                  updateLoan(loan.id, { interestRate: value })
                }
                min={5}
                max={20}
                step={0.1}
                className="mt-2"
              />
            </div>

            {/* Tenure */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Tenure ({loan.tenureType})
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={loan.tenure}
                  onChange={(e) =>
                    updateLoan(loan.id, { tenure: Number(e.target.value) })
                  }
                  className="bg-background/50 border-border/50 text-sm flex-1"
                />
                <select
                  value={loan.tenureType}
                  onChange={(e) =>
                    updateLoan(loan.id, {
                      tenureType: e.target.value as "months" | "years",
                    })
                  }
                  className="px-2 rounded-lg bg-background/50 border border-border/50 text-sm text-foreground"
                >
                  <option value="years">Yrs</option>
                  <option value="months">Mo</option>
                </select>
              </div>
              <Slider
                value={[loan.tenure]}
                onValueChange={([value]) => updateLoan(loan.id, { tenure: value })}
                min={loan.tenureType === "years" ? 1 : 12}
                max={loan.tenureType === "years" ? 30 : 360}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-primary" />
          Comparison Results
        </h3>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Metric
                </th>
                {calculatedLoans.map((loan, index) => (
                  <th
                    key={loan.id}
                    className={cn(
                      "text-center py-3 px-4 text-sm font-semibold",
                      index === 0 && "text-primary",
                      index === 1 && "text-secondary",
                      index === 2 && "text-accent",
                      index === 3 && "text-emerald-500"
                    )}
                  >
                    {loan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Monthly EMI */}
              <tr className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                <td className="py-4 px-4 text-sm text-muted-foreground">
                  Monthly EMI
                </td>
                {calculatedLoans.map((loan) => (
                  <td
                    key={loan.id}
                    className={cn(
                      "text-center py-4 px-4 font-semibold",
                      loan.emi === lowestEMI && "text-green-500"
                    )}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {formatCurrency(loan.emi)}
                      {loan.emi === lowestEMI && (
                        <TrendingDown className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Total Interest */}
              <tr className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                <td className="py-4 px-4 text-sm text-muted-foreground">
                  Total Interest
                </td>
                {calculatedLoans.map((loan) => (
                  <td
                    key={loan.id}
                    className={cn(
                      "text-center py-4 px-4 font-semibold",
                      loan.totalInterest === lowestInterest && "text-green-500"
                    )}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {formatCurrency(loan.totalInterest)}
                      {loan.totalInterest === lowestInterest && (
                        <TrendingDown className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Total Amount */}
              <tr className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                <td className="py-4 px-4 text-sm text-muted-foreground">
                  Total Amount
                </td>
                {calculatedLoans.map((loan) => (
                  <td
                    key={loan.id}
                    className={cn(
                      "text-center py-4 px-4 font-semibold",
                      loan.totalAmount === lowestTotal && "text-green-500"
                    )}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {formatCurrency(loan.totalAmount)}
                      {loan.totalAmount === lowestTotal && (
                        <TrendingDown className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Tenure */}
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-4 px-4 text-sm text-muted-foreground">
                  Loan Tenure
                </td>
                {calculatedLoans.map((loan) => (
                  <td
                    key={loan.id}
                    className="text-center py-4 px-4 font-medium text-foreground"
                  >
                    {loan.tenureInMonths} months
                    <span className="text-xs text-muted-foreground ml-1">
                      ({(loan.tenureInMonths / 12).toFixed(1)} yrs)
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Savings Summary */}
        {calculatedLoans.length >= 2 && (
          <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-500 mb-1">Savings Insight</h4>
                <p className="text-sm text-muted-foreground">
                  {(() => {
                    const bestInterest = calculatedLoans.find(
                      (l) => l.totalInterest === lowestInterest
                    );
                    const worstInterest = calculatedLoans.reduce((prev, curr) =>
                      curr.totalInterest > prev.totalInterest ? curr : prev
                    );
                    const savings = worstInterest.totalInterest - lowestInterest;
                    return `Choosing "${bestInterest?.name}" saves you ${formatCurrency(savings)} in interest compared to "${worstInterest.name}"`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanComparison;
