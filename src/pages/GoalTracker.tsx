import { motion } from "framer-motion";
import { TrendingUp, Target } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { formatINR } from "@/lib/finance";

const goals = [
  { name: "Emergency Fund", target: 400000, current: 500000, icon: "🛡️" },
  { name: "Home Down Payment", target: 2000000, current: 650000, icon: "🏠" },
  { name: "Dream Vacation", target: 300000, current: 120000, icon: "✈️" },
  { name: "Child Education", target: 5000000, current: 1800000, icon: "🎓" },
  { name: "FIRE Corpus", target: 40000000, current: 2300000, icon: "🔥" },
];

export default function GoalTracker() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" /> Goal Tracker
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Track progress towards your financial milestones</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g, i) => {
          const pct = Math.min((g.current / g.target) * 100, 100);
          const color = pct >= 100 ? "hsl(160,84%,44%)" : pct >= 50 ? "hsl(38,92%,50%)" : "hsl(270,60%,58%)";
          return (
            <GlassCard key={g.name} delay={i * 0.08}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{g.icon}</span>
                  <div>
                    <p className="font-medium text-foreground text-sm">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{formatINR(g.current)} of {formatINR(g.target)}</p>
                  </div>
                </div>
                <span className="font-display font-bold text-lg" style={{ color }}>{pct.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                />
              </div>
              {pct >= 100 && <p className="text-xs text-success mt-2">✅ Goal achieved!</p>}
              {pct < 100 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {formatINR(g.target - g.current)} remaining • ~{Math.ceil((g.target - g.current) / 25000)} months at ₹25K/mo
                </p>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
