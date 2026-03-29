import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { useToast } from "@/hooks/use-toast";
import type { UserFinancials } from "@/lib/finance";

const fields: { key: keyof UserFinancials; label: string; prefix?: string; suffix?: string }[] = [
  { key: "monthlyIncome", label: "Monthly Income", prefix: "₹" },
  { key: "monthlyExpenses", label: "Monthly Expenses", prefix: "₹" },
  { key: "totalSavings", label: "Total Savings", prefix: "₹" },
  { key: "totalInvestments", label: "Total Investments", prefix: "₹" },
  { key: "totalDebt", label: "Total Debt", prefix: "₹" },
  { key: "monthlyEMI", label: "Monthly EMI", prefix: "₹" },
  { key: "monthlyRent", label: "Monthly Rent", prefix: "₹" },
  { key: "monthlySIP", label: "Monthly SIP", prefix: "₹" },
  { key: "age", label: "Your Age", suffix: "years" },
  { key: "retirementAge", label: "Target Retirement Age", suffix: "years" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { saveProfile } = useFinancialProfile();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, number>>({
    monthlyIncome: 0, monthlyExpenses: 0, totalSavings: 0, totalInvestments: 0,
    totalDebt: 0, monthlyEMI: 0, monthlyRent: 0, monthlySIP: 0, age: 25,
    retirementAge: 60, expectedReturn: 12, inflationRate: 6,
  });

  const steps = [
    { title: "Income & Expenses", keys: ["monthlyIncome", "monthlyExpenses", "monthlyRent"] },
    { title: "Savings & Investments", keys: ["totalSavings", "totalInvestments", "monthlySIP"] },
    { title: "Debt & EMIs", keys: ["totalDebt", "monthlyEMI"] },
    { title: "About You", keys: ["age", "retirementAge"] },
  ];

  const currentStep = steps[step];

  const handleSave = async () => {
    setSaving(true);
    const { error } = await saveProfile(values as unknown as UserFinancials);
    setSaving(false);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
        className="w-full max-w-lg glass-card rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Step {step + 1} of {steps.length}</p>
            <h2 className="font-display font-bold text-foreground text-lg">{currentStep.title}</h2>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <div className="space-y-4">
          {currentStep.keys.map(key => {
            const f = fields.find(f => f.key === key)!;
            return (
              <div key={key}>
                <label className="block text-sm text-muted-foreground mb-1.5">{f.label}</label>
                <div className="relative">
                  {f.prefix && <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">{f.prefix}</span>}
                  <Input
                    type="number"
                    value={values[key] || ""}
                    onChange={e => setValues(v => ({ ...v, [key]: Math.max(0, Number(e.target.value) || 0) }))}
                    className={f.prefix ? "pl-8" : ""}
                    min={0}
                  />
                  {f.suffix && <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">{f.suffix}</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 0}>Back</Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} className="gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? "Saving..." : "Launch Dashboard"} <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
