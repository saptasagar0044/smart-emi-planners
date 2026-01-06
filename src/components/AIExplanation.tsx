import { Bot, Sparkles, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react";

interface AIExplanationProps {
  emi: number;
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  totalInterest: number;
}

const AIExplanation = ({ emi, loanAmount, interestRate, tenureMonths, totalInterest }: AIExplanationProps) => {
  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`;
    }
    return `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  const interestToLoanRatio = (totalInterest / loanAmount) * 100;
  const tenureYears = (tenureMonths / 12).toFixed(1);

  const getAffordabilityTip = () => {
    if (emi < 30000) {
      return {
        icon: CheckCircle2,
        color: "text-accent",
        bg: "bg-accent/10 border-accent/20",
        text: "This EMI amount is generally manageable for most middle-income households.",
      };
    } else if (emi < 70000) {
      return {
        icon: AlertCircle,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10 border-yellow-400/20",
        text: "Ensure this EMI doesn't exceed 40% of your monthly income for financial safety.",
      };
    }
    return {
      icon: TrendingDown,
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/20",
      text: "This is a significant EMI. Consider increasing tenure or reducing loan amount.",
    };
  };

  const affordability = getAffordabilityTip();

  const tips = [
    {
      title: "EMI-to-Income Ratio",
      content: `Ideally, your EMI should be below 30-40% of your monthly income. If your income is ₹${(emi * 3).toLocaleString("en-IN")}/month or more, this EMI is comfortable.`,
    },
    {
      title: "Interest Cost Analysis",
      content: `You'll pay ${interestToLoanRatio.toFixed(1)}% of your loan amount as interest over ${tenureYears} years. ${interestToLoanRatio > 50 ? "Consider a shorter tenure to reduce interest." : "This is a reasonable interest ratio."}`,
    },
    {
      title: "Smart Tip",
      content: interestRate > 10 
        ? "Consider negotiating for a lower interest rate or look for balance transfer options after a year."
        : "Great interest rate! Making occasional prepayments can help you save even more.",
    },
  ];

  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold gradient-text">AI Financial Advisor</h3>
          <p className="text-xs text-muted-foreground">Personalized insights for your loan</p>
        </div>
      </div>

      {/* Main Insight */}
      <div className={`p-4 rounded-xl ${affordability.bg} border mb-6`}>
        <div className="flex items-start gap-3">
          <affordability.icon className={`w-5 h-5 ${affordability.color} mt-0.5 flex-shrink-0`} />
          <div>
            <p className="text-sm text-foreground leading-relaxed">{affordability.text}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border/50 mb-6">
        <p className="text-sm text-foreground leading-relaxed">
          <span className="text-primary font-semibold">Quick Summary:</span> For a loan of{" "}
          <span className="font-semibold text-accent">{formatCurrency(loanAmount)}</span> at{" "}
          <span className="font-semibold text-secondary">{interestRate}% p.a.</span> for{" "}
          <span className="font-semibold text-primary">{tenureMonths} months</span>, your monthly EMI is{" "}
          <span className="font-bold gradient-text">{formatCurrency(emi)}</span>. Over the loan tenure, you'll pay a total interest of{" "}
          <span className="font-semibold text-secondary">{formatCurrency(totalInterest)}</span>.
        </p>
      </div>

      {/* Tips Grid */}
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-muted/20 border border-border/30 hover:border-primary/30 transition-colors"
          >
            <h4 className="text-sm font-semibold text-primary mb-1">{tip.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{tip.content}</p>
          </div>
        ))}
      </div>

      {/* AI Badge */}
      <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-primary animate-pulse-slow" />
        <span className="text-xs text-muted-foreground">
          AI-powered analysis • Updated in real-time
        </span>
      </div>
    </div>
  );
};

export default AIExplanation;
