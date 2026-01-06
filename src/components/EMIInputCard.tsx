import { Slider } from "@/components/ui/slider";
import { IndianRupee, Percent, Calendar } from "lucide-react";

interface EMIInputCardProps {
  loanAmount: number;
  setLoanAmount: (value: number) => void;
  interestRate: number;
  setInterestRate: (value: number) => void;
  tenure: number;
  setTenure: (value: number) => void;
  tenureType: "months" | "years";
  setTenureType: (type: "months" | "years") => void;
}

const EMIInputCard = ({
  loanAmount,
  setLoanAmount,
  interestRate,
  setInterestRate,
  tenure,
  setTenure,
  tenureType,
  setTenureType,
}: EMIInputCardProps) => {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(2)} L`;
    }
    return value.toLocaleString("en-IN");
  };

  return (
    <div className="glass-card p-6 md:p-8 space-y-8 animate-slide-in-left">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold gradient-text">
          EMI Calculator
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Calculate your monthly installment instantly
        </p>
      </div>

      {/* Loan Amount */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <IndianRupee className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Loan Amount</span>
          </div>
          <div className="flex items-center gap-1 px-4 py-2 rounded-xl bg-muted/50 border border-border">
            <span className="text-muted-foreground">₹</span>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => {
                const val = Math.max(100000, Math.min(50000000, Number(e.target.value) || 100000));
                setLoanAmount(val);
              }}
              className="w-28 bg-transparent text-right font-semibold text-foreground focus:outline-none"
            />
          </div>
        </div>
        <Slider
          value={[loanAmount]}
          onValueChange={([val]) => setLoanAmount(val)}
          min={100000}
          max={50000000}
          step={50000}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₹1 Lakh</span>
          <span className="text-primary font-medium">₹{formatCurrency(loanAmount)}</span>
          <span>₹5 Cr</span>
        </div>
      </div>

      {/* Interest Rate */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/20">
              <Percent className="w-5 h-5 text-secondary" />
            </div>
            <span className="font-semibold text-foreground">Interest Rate</span>
          </div>
          <div className="flex items-center gap-1 px-4 py-2 rounded-xl bg-muted/50 border border-border">
            <input
              type="number"
              value={interestRate}
              onChange={(e) => {
                const val = Math.max(1, Math.min(30, Number(e.target.value) || 1));
                setInterestRate(val);
              }}
              step={0.1}
              className="w-16 bg-transparent text-right font-semibold text-foreground focus:outline-none"
            />
            <span className="text-muted-foreground">%</span>
          </div>
        </div>
        <Slider
          value={[interestRate]}
          onValueChange={([val]) => setInterestRate(val)}
          min={1}
          max={30}
          step={0.1}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1%</span>
          <span className="text-secondary font-medium">{interestRate.toFixed(1)}% p.a.</span>
          <span>30%</span>
        </div>
      </div>

      {/* Tenure */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <span className="font-semibold text-foreground">Loan Tenure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-4 py-2 rounded-xl bg-muted/50 border border-border">
              <input
                type="number"
                value={tenure}
                onChange={(e) => {
                  const max = tenureType === "years" ? 30 : 360;
                  const val = Math.max(1, Math.min(max, Number(e.target.value) || 1));
                  setTenure(val);
                }}
                className="w-12 bg-transparent text-right font-semibold text-foreground focus:outline-none"
              />
            </div>
            <div className="flex rounded-xl overflow-hidden border border-border">
              <button
                onClick={() => {
                  if (tenureType === "years") {
                    setTenureType("months");
                    setTenure(Math.min(tenure * 12, 360));
                  }
                }}
                className={`px-3 py-2 text-sm font-medium transition-all ${
                  tenureType === "months"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                Mo
              </button>
              <button
                onClick={() => {
                  if (tenureType === "months") {
                    setTenureType("years");
                    setTenure(Math.max(1, Math.round(tenure / 12)));
                  }
                }}
                className={`px-3 py-2 text-sm font-medium transition-all ${
                  tenureType === "years"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                Yr
              </button>
            </div>
          </div>
        </div>
        <Slider
          value={[tenure]}
          onValueChange={([val]) => setTenure(val)}
          min={1}
          max={tenureType === "years" ? 30 : 360}
          step={1}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 {tenureType === "years" ? "Year" : "Month"}</span>
          <span className="text-accent font-medium">
            {tenure} {tenureType === "years" ? (tenure === 1 ? "Year" : "Years") : (tenure === 1 ? "Month" : "Months")}
          </span>
          <span>{tenureType === "years" ? "30 Years" : "360 Months"}</span>
        </div>
      </div>
    </div>
  );
};

export default EMIInputCard;
