import { useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, IndianRupee, ArrowRight } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import InsightBadge from "@/components/InsightBadge";
import { defaultFinancials, calculateTax, formatINR } from "@/lib/finance";

export default function TaxAI() {
  const tax = useMemo(() => calculateTax(defaultFinancials.monthlyIncome, 150000, 25000, 0, 0), []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" /> Tax AI
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Intelligent tax regime comparison & missed deductions</p>
      </motion.div>

      {/* Regime comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard delay={0.1} className={tax.betterRegime === "Old" ? "border-primary/50 glow-primary" : ""}>
          <p className="text-xs text-muted-foreground mb-1">Old Regime</p>
          <p className="font-display text-2xl font-bold text-foreground">{formatINR(tax.oldTax)}</p>
          <p className="text-xs text-muted-foreground mt-1">With deductions: 80C, 80D, HRA</p>
          {tax.betterRegime === "Old" && <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/20 text-primary border border-primary/30">Recommended</span>}
        </GlassCard>

        <GlassCard delay={0.15} className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mb-2">
            <IndianRupee className="w-5 h-5 text-primary-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">You save</p>
          <p className="font-display text-xl font-bold text-success">{formatINR(tax.savings)}</p>
          <p className="text-xs text-muted-foreground">with {tax.betterRegime} Regime</p>
        </GlassCard>

        <GlassCard delay={0.2} className={tax.betterRegime === "New" ? "border-primary/50 glow-primary" : ""}>
          <p className="text-xs text-muted-foreground mb-1">New Regime</p>
          <p className="font-display text-2xl font-bold text-foreground">{formatINR(tax.newTax)}</p>
          <p className="text-xs text-muted-foreground mt-1">Standard deduction ₹75,000 only</p>
          {tax.betterRegime === "New" && <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/20 text-primary border border-primary/30">Recommended</span>}
        </GlassCard>
      </div>

      {/* Missed Deductions */}
      {tax.missedDeductions.length > 0 && (
        <GlassCard delay={0.3}>
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            🔍 Missed Deductions Detector
          </h3>
          <div className="space-y-3">
            {tax.missedDeductions.map((d, i) => (
              <InsightBadge key={i} type="warning" text={d} tag="Tax Inefficient" />
            ))}
          </div>
        </GlassCard>
      )}

      <GlassCard delay={0.4}>
        <h3 className="font-display font-semibold text-foreground mb-3">💡 Smart Tax Tips</h3>
        <div className="space-y-3">
          <InsightBadge type="info" text={`Gross Income: ${formatINR(tax.grossIncome)}. Effective tax rate: ${((Math.min(tax.oldTax, tax.newTax) / tax.grossIncome) * 100).toFixed(1)}%`} />
          <InsightBadge type="success" text="Maximize ELSS investments for both tax saving (80C) and wealth creation via equity exposure." tag="Recommended" />
          <InsightBadge type="info" text="Consider PPF for risk-free guaranteed returns with sovereign guarantee + tax-free maturity." />
        </div>
      </GlassCard>
    </div>
  );
}
