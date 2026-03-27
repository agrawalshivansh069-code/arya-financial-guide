import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Shield, Wallet, PiggyBank, CreditCard, AlertTriangle, Zap } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import ScoreRing from "@/components/ScoreRing";
import InsightBadge from "@/components/InsightBadge";
import { defaultFinancials, analyzeFinancials, formatINR } from "@/lib/finance";

const riskColors = { Low: "text-success", Medium: "text-warning", High: "text-destructive" };

export default function Dashboard() {
  const analysis = useMemo(() => analyzeFinancials(defaultFinancials), []);
  const f = defaultFinancials;

  const metrics = [
    { label: "Net Worth", value: formatINR(analysis.netWorth), icon: Wallet, trend: "+12.4%", up: true },
    { label: "Savings Rate", value: `${analysis.savingsRate.toFixed(1)}%`, icon: PiggyBank, trend: analysis.savingsRate >= 30 ? "Healthy" : "Low", up: analysis.savingsRate >= 30 },
    { label: "Burn Rate", value: `${formatINR(analysis.burnRate)}/mo`, icon: CreditCard, trend: "Monthly", up: false },
    { label: "Monthly SIP", value: formatINR(f.monthlySIP), icon: TrendingUp, trend: `${((f.monthlySIP / f.monthlyIncome) * 100).toFixed(0)}% of income`, up: true },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground">Smart Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Your financial command center</p>
      </motion.div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <GlassCard key={m.label} delay={i * 0.08} className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
              <p className="font-display text-xl font-bold text-foreground">{m.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs ${m.up ? "text-success" : "text-muted-foreground"}`}>
                {m.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {m.trend}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-primary/10">
              <m.icon className="w-5 h-5 text-primary" />
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score + Risk */}
        <GlassCard delay={0.3} className="flex flex-col items-center justify-center">
          <ScoreRing score={Math.round(analysis.score)} />
          <div className="mt-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Risk Level:</span>
            <span className={`font-semibold text-sm ${riskColors[analysis.riskLevel]}`}>{analysis.riskLevel}</span>
          </div>
        </GlassCard>

        {/* Insights */}
        <GlassCard delay={0.4} className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="font-display font-semibold text-foreground">AI Insights</h3>
          </div>
          {analysis.insights.slice(0, 4).map((ins, i) => (
            <InsightBadge key={i} type={ins.type} text={ins.text} tag={ins.tag} />
          ))}
        </GlassCard>
      </div>

      {/* Red Flags + Top Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analysis.redFlags.length > 0 && (
          <GlassCard delay={0.5}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <h3 className="font-display font-semibold text-foreground">Red Flags</h3>
            </div>
            <ul className="space-y-2">
              {analysis.redFlags.map((flag, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-destructive/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  {flag}
                </li>
              ))}
            </ul>
          </GlassCard>
        )}

        <GlassCard delay={0.55}>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="font-display font-semibold text-foreground">Top 3 Actions</h3>
          </div>
          <ul className="space-y-2">
            {analysis.topActions.slice(0, 3).map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="gradient-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                {action}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
