import { useMemo } from "react";
import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import ScoreRing from "@/components/ScoreRing";
import MetricBar from "@/components/MetricBar";
import InsightBadge from "@/components/InsightBadge";
import { defaultFinancials, analyzeFinancials } from "@/lib/finance";

export default function MoneyHealth() {
  const analysis = useMemo(() => analyzeFinancials(defaultFinancials), []);

  const dimensions = [
    { label: "Savings Rate", value: analysis.savingsRate, max: 50, suffix: "%" },
    { label: "Emergency Fund", value: analysis.emergencyMonths, max: 12, suffix: " months" },
    { label: "Debt Ratio", value: 50 - analysis.debtRatio, max: 50, suffix: "%" },
    { label: "Investment Rate", value: analysis.investmentRate, max: 30, suffix: "%" },
  ];

  // Find weakest
  const weakest = dimensions.reduce((a, b) => (a.value / a.max < b.value / b.max ? a : b));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-primary" /> Money Health Engine
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive financial fitness score</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard delay={0.1} className="flex flex-col items-center justify-center">
          <ScoreRing score={Math.round(analysis.score)} size={180} label="Overall Health" />
          <p className="text-xs text-muted-foreground mt-4 text-center">
            {analysis.score >= 70 ? "Your finances are in great shape! 🎉" : analysis.score >= 45 ? "Room for improvement — follow the actions below." : "Urgent attention needed on your finances."}
          </p>
        </GlassCard>

        <GlassCard delay={0.2} className="lg:col-span-2 space-y-5">
          <h3 className="font-display font-semibold text-foreground">Dimension Breakdown</h3>
          {dimensions.map((d, i) => (
            <MetricBar key={d.label} label={d.label} value={d.value} max={d.max} suffix={d.suffix} delay={i * 0.15} />
          ))}
          <div className="mt-4 p-3 rounded-lg border border-warning/30 bg-warning/10">
            <p className="text-sm text-warning">
              🎯 <strong>Weakest area:</strong> {weakest.label} — Focus improvements here for maximum impact.
            </p>
          </div>
        </GlassCard>
      </div>

      <GlassCard delay={0.4}>
        <h3 className="font-display font-semibold text-foreground mb-3">Detailed Insights</h3>
        <div className="space-y-3">
          {analysis.insights.map((ins, i) => (
            <InsightBadge key={i} type={ins.type} text={ins.text} tag={ins.tag} />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
