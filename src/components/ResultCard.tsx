import { useEffect, useState } from "react";
import { TrendingUp, Wallet, PiggyBank } from "lucide-react";

interface ResultCardProps {
  emi: number;
  totalInterest: number;
  totalAmount: number;
}

const AnimatedNumber = ({ value, prefix = "₹" }: { value: number; prefix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const stepValue = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(stepValue * step, value);
      setDisplayValue(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val: number) => {
    if (val >= 10000000) {
      return `${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `${(val / 100000).toFixed(2)} L`;
    }
    return val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  };

  return (
    <span className="tabular-nums">
      {prefix}{formatValue(displayValue)}
    </span>
  );
};

const ResultCard = ({ emi, totalInterest, totalAmount }: ResultCardProps) => {
  const results = [
    {
      label: "Monthly EMI",
      value: emi,
      icon: Wallet,
      gradient: "from-primary to-secondary",
      bgGradient: "from-primary/20 to-secondary/20",
      isPrimary: true,
    },
    {
      label: "Total Interest",
      value: totalInterest,
      icon: TrendingUp,
      gradient: "from-secondary to-accent",
      bgGradient: "from-secondary/10 to-accent/10",
      isPrimary: false,
    },
    {
      label: "Total Amount",
      value: totalAmount,
      icon: PiggyBank,
      gradient: "from-accent to-primary",
      bgGradient: "from-accent/10 to-primary/10",
      isPrimary: false,
    },
  ];

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div
          key={result.label}
          className={`result-card ${result.isPrimary ? "glow-effect" : ""}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${result.bgGradient} opacity-50 rounded-2xl`} />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${result.gradient}`}>
                <result.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{result.label}</p>
                <p className={`text-2xl md:text-3xl font-bold ${result.isPrimary ? "gradient-text" : "text-foreground"}`}>
                  <AnimatedNumber value={result.value} />
                </p>
              </div>
            </div>
            {result.isPrimary && (
              <div className="hidden md:block">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary border border-primary/30">
                  Per Month
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultCard;
