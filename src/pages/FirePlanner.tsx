import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Target, Clock, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";
import GlassCard from "@/components/GlassCard";
import { calculateFIRE, formatINR } from "@/lib/finance";
import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { Slider } from "@/components/ui/slider";

export default function FirePlanner() {
  const { financials } = useFinancialProfile();
  const [sipMultiplier, setSipMultiplier] = useState(1);
  const [expenseReduction, setExpenseReduction] = useState(0);

  const adjusted = useMemo(() => ({
    ...financials,
    monthlySIP: financials.monthlySIP * sipMultiplier,
    monthlyExpenses: financials.monthlyExpenses - expenseReduction,
  }), [financials, sipMultiplier, expenseReduction]);

  const fire = useMemo(() => calculateFIRE(adjusted), [adjusted]);
  const baseFire = useMemo(() => calculateFIRE(financials), [financials]);

  const stats = [
    { label: "FIRE Number", value: formatINR(fire.fireNumber), icon: Target, sub: "25× annual expenses" },
    { label: "Current Corpus", value: formatINR(fire.currentCorpus), icon: TrendingUp, sub: `${((fire.currentCorpus / fire.fireNumber) * 100).toFixed(1)}% achieved` },
    { label: "Gap to FIRE", value: formatINR(fire.gap), icon: Flame, sub: "Amount still needed" },
    { label: "Years to FIRE", value: `${fire.yearsToFIRE} yrs`, icon: Clock, sub: `Retire at age ${financials.age + fire.yearsToFIRE}` },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Flame className="w-6 h-6 text-primary" /> FIRE Planner
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Financial Independence, Retire Early</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.08}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="font-display text-lg font-bold text-foreground">{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{s.sub}</p>
          </GlassCard>
        ))}
      </div>

      {/* What-If Sliders */}
      <GlassCard delay={0.3}>
        <h3 className="font-display font-semibold text-foreground mb-4">🎛️ What-If Simulator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">SIP Amount</span>
              <span className="text-foreground font-medium">{formatINR(adjusted.monthlySIP)}/mo</span>
            </div>
            <Slider
              value={[sipMultiplier]} min={0.5} max={3} step={0.1}
              onValueChange={([v]) => setSipMultiplier(v)}
              className="[&_[role=slider]]:bg-primary"
            />
            <p className="text-xs text-muted-foreground">{sipMultiplier > 1 ? `+${((sipMultiplier - 1) * 100).toFixed(0)}% increase` : sipMultiplier < 1 ? `${((1 - sipMultiplier) * 100).toFixed(0)}% decrease` : "Current level"}</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Expense Reduction</span>
              <span className="text-foreground font-medium">{formatINR(expenseReduction)}/mo</span>
            </div>
            <Slider
              value={[expenseReduction]} min={0} max={30000} step={1000}
              onValueChange={([v]) => setExpenseReduction(v)}
              className="[&_[role=slider]]:bg-primary"
            />
            <p className="text-xs text-muted-foreground">
              {expenseReduction > 0
                ? `Saves ${fire.yearsToFIRE < baseFire.yearsToFIRE ? baseFire.yearsToFIRE - fire.yearsToFIRE : 0} years vs baseline`
                : "Drag to simulate cuts"}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Projection Chart */}
      <GlassCard delay={0.4}>
        <h3 className="font-display font-semibold text-foreground mb-4">📈 Wealth Projection</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fire.projections.slice(0, 30)}>
              <defs>
                <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160,84%,44%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160,84%,44%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fill: "hsl(215,12%,52%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215,12%,52%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 10000000).toFixed(0)}Cr`} />
              <Tooltip
                contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(220,14%,18%)", borderRadius: 8, color: "hsl(210,20%,92%)" }}
                formatter={(v: number) => [formatINR(v), ""]}
                labelFormatter={(l) => `Age ${l}`}
              />
              <ReferenceLine y={fire.fireNumber} stroke="hsl(270,60%,58%)" strokeDasharray="5 5" label={{ value: "FIRE Target", fill: "hsl(270,60%,58%)", fontSize: 11 }} />
              <Area type="monotone" dataKey="corpus" stroke="hsl(160,84%,44%)" fill="url(#corpusGrad)" strokeWidth={2} name="Corpus" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}
