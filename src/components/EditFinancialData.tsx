import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
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
  { key: "retirementAge", label: "Retirement Age", suffix: "years" },
];

interface Props {
  financials: UserFinancials;
  onSave: (f: UserFinancials) => Promise<{ error: any } | undefined>;
}

export default function EditFinancialData({ financials, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setValues({ ...financials } as unknown as Record<string, number>);
    }
    setOpen(isOpen);
  };

  const handleSave = async () => {
    setSaving(true);
    const updated: UserFinancials = {
      ...financials,
      ...Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, Number(v)])
      ),
    } as UserFinancials;
    const result = await onSave(updated);
    setSaving(false);
    if (result?.error) {
      toast({ title: "Update failed", description: result.error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Financial data updated", description: "All metrics and insights have been recalculated." });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary">
          <Pencil className="w-3.5 h-3.5" /> Edit Financial Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Update Your Finances</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            You can update your financial details anytime as your situation changes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs text-muted-foreground mb-1">{f.label}</label>
              <div className="relative">
                {f.prefix && <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">{f.prefix}</span>}
                <Input
                  type="number"
                  value={values[f.key] ?? ""}
                  onChange={e => setValues(v => ({ ...v, [f.key]: Number(e.target.value) }))}
                  className={f.prefix ? "pl-8" : ""}
                  min={0}
                />
                {f.suffix && <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">{f.suffix}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save & Recalculate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
