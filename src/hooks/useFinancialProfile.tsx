import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { UserFinancials } from "@/lib/finance";
import { defaultFinancials } from "@/lib/finance";

export function useFinancialProfile() {
  const { user } = useAuth();
  const [financials, setFinancials] = useState<UserFinancials>(defaultFinancials);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("financial_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setFinancials({
        monthlyIncome: data.monthly_income,
        monthlyExpenses: data.monthly_expenses,
        totalSavings: data.total_savings,
        totalInvestments: data.total_investments,
        totalDebt: data.total_debt,
        monthlyEMI: data.monthly_emi,
        monthlyRent: data.monthly_rent,
        monthlySIP: data.monthly_sip,
        age: data.age,
        retirementAge: data.retirement_age,
        expectedReturn: Number(data.expected_return),
        inflationRate: Number(data.inflation_rate),
      });
      setHasProfile(true);
    } else {
      setHasProfile(false);
    }
    setLoading(false);
  };

  const saveProfile = async (f: UserFinancials) => {
    if (!user) return;
    const payload = {
      user_id: user.id,
      monthly_income: f.monthlyIncome,
      monthly_expenses: f.monthlyExpenses,
      total_savings: f.totalSavings,
      total_investments: f.totalInvestments,
      total_debt: f.totalDebt,
      monthly_emi: f.monthlyEMI,
      monthly_rent: f.monthlyRent,
      monthly_sip: f.monthlySIP,
      age: f.age,
      retirement_age: f.retirementAge,
      expected_return: f.expectedReturn,
      inflation_rate: f.inflationRate,
      updated_at: new Date().toISOString(),
    };

    const { error } = hasProfile
      ? await supabase.from("financial_profiles").update(payload).eq("user_id", user.id)
      : await supabase.from("financial_profiles").insert(payload);

    if (!error) {
      setFinancials(f);
      setHasProfile(true);
    }
    return { error };
  };

  return { financials, hasProfile, loading, saveProfile, reload: loadProfile };
}
