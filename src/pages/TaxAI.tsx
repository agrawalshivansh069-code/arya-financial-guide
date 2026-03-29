import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, IndianRupee, ArrowRight, FileText, TrendingDown, Scale } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import InsightBadge from "@/components/InsightBadge";
import { Input } from "@/components/ui/input";
import { calculateTax, formatINR } from "@/lib/finance";
import { useFinancialProfile } from "@/hooks/useFinancialProfile";

export default function TaxAI() {
  const { financials } = useFinancialProfile();

  const [deductions80C, setDeductions80C] = useState(150000);
  const [deductions80D, setDeductions80D] = useState(25000);
  const [nps80CCD, setNps80CCD] = useState(0);
  const [hra, setHra] = useState(0);

  const tax = useMemo(() => calculateTax(financials.monthlyIncome, deductions80C, deductions80D, nps80CCD, hra), [financials, deductions80C, deductions80D, nps80CCD, hra]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" /> Tax AI
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Intelligent tax regime comparison, deductions & refund estimator</p>
      </motion.div>

      {/* Tax Inputs */}
      <GlassCard delay={0.05}>
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Your Tax Deductions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "80C (ELSS, PPF, EPF)", value: deductions80C, set: setDeductions80C, max: 150000 },
            { label: "80D (Health Insurance)", value: deductions80D, set: setDeductions80D, max: 100000 },
            { label: "80CCD(1B) NPS", value: nps80CCD, set: setNps80CCD, max: 50000 },
            { label: "HRA Exemption", value: hra, set: setHra, max: 500000 },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-xs text-muted-foreground mb-1">{field.label}</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">₹</span>
                <Input
                  type="number"
                  value={field.value || ""}
                  onChange={e => field.set(Math.max(0, Math.min(field.max, Number(e.target.value) || 0)))}
                  className="pl-8"
                  min={0}
                  max={field.max}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Max: {formatINR(field.max)}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Income Summary */}
      <GlassCard delay={0.08}>
        <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-primary" /> Tax Computation Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Gross Income</p>
            <p className="font-display text-lg font-bold text-foreground">{formatINR(tax.grossIncome)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Deductions</p>
            <p className="font-display text-lg font-bold text-success">{formatINR(tax.totalDeductions)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Old Regime Taxable</p>
            <p className="font-display text-lg font-bold text-foreground">{formatINR(tax.oldTaxable)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">New Regime Taxable</p>
            <p className="font-display text-lg font-bold text-foreground">{formatINR(tax.newTaxable)}</p>
          </div>
        </div>
      </GlassCard>

      {/* Regime comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard delay={0.1} className={tax.betterRegime === "Old" ? "border-primary/50 glow-primary" : ""}>
          <p className="text-xs text-muted-foreground mb-1">Old Regime Tax</p>
          <p className="font-display text-2xl font-bold text-foreground">{formatINR(tax.oldTax)}</p>
          <p className="text-xs text-muted-foreground mt-1">Effective rate: {tax.effectiveOldRate.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">With 80C, 80D, HRA, NPS</p>
          {tax.betterRegime === "Old" && <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/20 text-primary border border-primary/30">Recommended</span>}
        </GlassCard>

        <GlassCard delay={0.15} className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mb-2">
            <Scale className="w-5 h-5 text-primary-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">You save</p>
          <p className="font-display text-xl font-bold text-success">{formatINR(tax.savings)}</p>
          <p className="text-xs text-muted-foreground">with {tax.betterRegime} Regime</p>
        </GlassCard>

        <GlassCard delay={0.2} className={tax.betterRegime === "New" ? "border-primary/50 glow-primary" : ""}>
          <p className="text-xs text-muted-foreground mb-1">New Regime Tax</p>
          <p className="font-display text-2xl font-bold text-foreground">{formatINR(tax.newTax)}</p>
          <p className="text-xs text-muted-foreground mt-1">Effective rate: {tax.effectiveNewRate.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Standard deduction ₹75,000 only</p>
          {tax.betterRegime === "New" && <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/20 text-primary border border-primary/30">Recommended</span>}
        </GlassCard>
      </div>

      {/* Tax Saved & Refund Estimate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard delay={0.25} className="border-success/20">
          <p className="text-xs text-muted-foreground mb-1">💰 Estimated Tax Saved via Deductions</p>
          <p className="font-display text-2xl font-bold text-success">{formatINR(tax.taxSaved)}</p>
          <p className="text-xs text-muted-foreground mt-1">Through 80C + 80D + NPS + HRA + Standard Deduction</p>
        </GlassCard>
        <GlassCard delay={0.3} className="border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">📊 Final Tax Payable ({tax.betterRegime} Regime)</p>
          <p className="font-display text-2xl font-bold text-foreground">{formatINR(Math.min(tax.oldTax, tax.newTax))}</p>
          <p className="text-xs text-muted-foreground mt-1">Including 4% Health & Education Cess</p>
        </GlassCard>
      </div>

      {/* Missed Deductions */}
      {tax.missedDeductions.length > 0 && (
        <GlassCard delay={0.35}>
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
          <InsightBadge type="success" text="NPS gives extra ₹50,000 deduction under 80CCD(1B) — on top of the ₹1.5L limit of 80C." tag="Pro Tip" />
        </div>
      </GlassCard>
    </div>
  );
}
