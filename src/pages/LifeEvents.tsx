import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Milestone, ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { lifeEvents, analyzeFinancials, formatINR, type LifeEvent } from "@/lib/finance";
import { useFinancialProfile } from "@/hooks/useFinancialProfile";

export default function LifeEvents() {
  const { financials } = useFinancialProfile();
  const [selected, setSelected] = useState<LifeEvent | null>(null);

  const before = useMemo(() => analyzeFinancials(financials), [financials]);

  const after = useMemo(() => {
    if (!selected) return null;
    return analyzeFinancials({
      ...financials,
      totalSavings: financials.totalSavings - selected.cost,
      monthlyExpenses: financials.monthlyExpenses + selected.monthlyImpact,
    });
  }, [selected, financials]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Milestone className="w-6 h-6 text-primary" /> Life Event Simulator
        </h2>
        <p className="text-sm text-muted-foreground mt-1">See how life changes impact your finances</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {lifeEvents.map((ev) => (
          <motion.button
            key={ev.name}
            onClick={() => setSelected(ev)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`glass-card rounded-xl p-4 text-left transition-colors ${selected?.name === ev.name ? "border-primary/60 glow-primary" : "hover:border-primary/30"}`}
          >
            <span className="text-2xl">{ev.icon}</span>
            <p className="font-medium text-foreground text-sm mt-2">{ev.name}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{formatINR(ev.cost)} one-time</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selected && after && (
          <motion.div
            key={selected.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <GlassCard>
              <p className="text-sm text-muted-foreground mb-4">{selected.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Before */}
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Before</p>
                  <p className="text-sm text-foreground">Net Worth: <strong>{formatINR(before.netWorth)}</strong></p>
                  <p className="text-sm text-foreground">Savings Rate: <strong>{before.savingsRate.toFixed(1)}%</strong></p>
                  <p className="text-sm text-foreground">Score: <strong>{Math.round(before.score)}/100</strong></p>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>

                {/* After */}
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">After</p>
                  <p className="text-sm text-foreground flex items-center gap-1">
                    Net Worth: <strong>{formatINR(after.netWorth)}</strong>
                    {after.netWorth < before.netWorth ? <TrendingDown className="w-3 h-3 text-destructive" /> : <TrendingUp className="w-3 h-3 text-success" />}
                  </p>
                  <p className="text-sm text-foreground">Savings Rate: <strong>{after.savingsRate.toFixed(1)}%</strong></p>
                  <p className="text-sm text-foreground">Score: <strong>{Math.round(after.score)}/100</strong></p>
                </div>
              </div>
            </GlassCard>

            {/* Best vs Worst */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard className="border-success/30">
                <p className="text-xs font-semibold text-success uppercase tracking-wider mb-2">✅ Best Move</p>
                <p className="text-sm text-foreground/80">
                  {selected.name === "Marriage" && "Plan 18 months ahead, set a budget cap, invest gifts in SIPs immediately."}
                  {selected.name === "First Child" && "Start a child SIP of ₹5,000/mo now. Opt for maternity insurance early."}
                  {selected.name === "Home Purchase" && "Use max home loan tax benefits (80C + 24b). Keep EMI under 30% of income."}
                  {selected.name === "Car Purchase" && "Buy a 1-2 year old car. Avoid car loans — save for 6 months instead."}
                  {selected.name === "Job Loss" && "Use emergency fund. Upskill immediately. Don't touch investments."}
                  {selected.name === "Child Education" && "Start education SIP 15+ years early. Consider Sukanya Samriddhi for girls."}
                  {selected.name === "Health Emergency" && "Super top-up health insurance (₹500/yr for ₹50L cover). Critical illness rider."}
                  {selected.name === "Startup" && "Keep 12 months runway. Start as side project first. Don't liquidate all investments."}
                </p>
              </GlassCard>
              <GlassCard className="border-destructive/30">
                <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">❌ Worst Move</p>
                <p className="text-sm text-foreground/80">
                  {selected.name === "Marriage" && "Taking a personal loan for wedding. Breaking FDs. Zero budget planning."}
                  {selected.name === "First Child" && "Stopping SIPs entirely. No health insurance for child. Lifestyle inflation."}
                  {selected.name === "Home Purchase" && "Buying at peak prices with 90% LTV. EMI exceeding 50% of income."}
                  {selected.name === "Car Purchase" && "Brand new luxury car on 7-year loan. Ignoring depreciation math."}
                  {selected.name === "Job Loss" && "Panic-selling investments. Taking personal loans. Not cutting expenses."}
                  {selected.name === "Child Education" && "Education loan at 12%+ interest. Not exploring scholarships. Starting late."}
                  {selected.name === "Health Emergency" && "No insurance. Using credit cards for bills. Breaking all investments."}
                  {selected.name === "Startup" && "Quitting without runway. Borrowing from family. All-in with no fallback."}
                </p>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
