import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface EMIPieChartProps {
  principal: number;
  interest: number;
}

const EMIPieChart = ({ principal, interest }: EMIPieChartProps) => {
  const data = [
    { name: "Principal", value: principal, color: "hsl(199, 89%, 48%)" },
    { name: "Interest", value: interest, color: "hsl(263, 70%, 50%)" },
  ];

  const total = principal + interest;
  const principalPercent = ((principal / total) * 100).toFixed(1);
  const interestPercent = ((interest / total) * 100).toFixed(1);

  const formatValue = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`;
    }
    return `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="text-sm font-semibold text-foreground">{payload[0].name}</p>
          <p className="text-lg font-bold gradient-text">{formatValue(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">
            {((payload[0].value / total) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 md:p-8 animate-scale-in" style={{ animationDelay: "0.2s" }}>
      <h3 className="text-xl font-bold mb-6 gradient-text-secondary">Payment Breakdown</h3>
      
      <div className="h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  strokeWidth={0}
                  style={{
                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Principal</span>
          </div>
          <p className="text-lg font-bold text-foreground">{formatValue(principal)}</p>
          <p className="text-xs text-primary">{principalPercent}%</p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-sm text-muted-foreground">Interest</span>
          </div>
          <p className="text-lg font-bold text-foreground">{formatValue(interest)}</p>
          <p className="text-xs text-secondary">{interestPercent}%</p>
        </div>
      </div>
    </div>
  );
};

export default EMIPieChart;
