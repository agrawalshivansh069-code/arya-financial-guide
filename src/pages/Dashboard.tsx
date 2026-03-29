import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Shield, Wallet, PiggyBank, CreditCard, Zap, ArrowRight, AlertTriangle, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import ScoreRing from "@/components/ScoreRing";
import HeroInsight from "@/components/HeroInsight";
import InsightBadge from "@/components/InsightBadge";
import DetailedInsightCard from "@/components/DetailedInsightCard";
import EditFinancialData from "@/components/EditFinancialData";
import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { useAuth } from "@/hooks/useAuth";
import { analyzeFinancials, formatINR } from "@/lib/finance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { financials, hasProfile, loading, saveProfile } = useFinancialProfile();
  const { user } = useAuth();
  const navigate = useNavigate();

  const analysis = useMemo(() => analyzeFinancials(financials), [financials]);
  const f = financials;

  if (!loading && hasProfile === false) {
    navigate("/onboarding", { replace: true });
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const score = Math.round(analysis.score);
  const overspend = f.monthlyExpenses - f.monthlyIncome * 0.5;
  const potentialSIPGain = (f.monthlyIncome * 0.3 - f.monthlySIP) * 12;

  const metrics = [
    { label: "Net Worth", value: formatINR(analysis.netWorth), icon: Wallet, trend: "+12.4%", up: true },
    { label: "Savings Rate", value: `${analysis.savingsRate.toFixed(1)}%`, icon: PiggyBank, trend: analysis.savingsRate >= 30 ? "Healthy" : "Low", up: analysis.savingsRate >= 30 },
    { label: "Burn Rate", value: `${formatINR(analysis.burnRate)}/mo`, icon: CreditCard, trend: "Monthly", up: false },
    { label: "Monthly SIP", value: formatINR(f.monthlySIP), icon: TrendingUp, trend: `${((f.monthlySIP / f.monthlyIncome) * 100).toFixed(0)}% of income`, up: true },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""} 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Your financial command center</p>
        </div>
        <EditFinancialData financials={financials} onSave={saveProfile} />
      </motion.div>

      {/* Summary Line */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground italic border-l-2 border-primary/40 pl-3"
      >
        {analysis.summaryLine}
      </motion.p>

      {/* Hero Insight Card */}
      <HeroInsight score={score} riskLevel={analysis.riskLevel} headline={analysis.heroHeadline} subtext={analysis.heroSubtext} />

      {/* Alert Banners */}
      {overspend > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl border border-warning/30 bg-warning/10 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-warning">⚠️ Overspending by {formatINR(overspend * 12)}/year</p>
            <p className="text-xs text-warning/70 mt-0.5">Expenses exceed the 50% benchmark — reduce discretionary spending</p>
          </div>
          <Badge className="bg-warning/20 text-warning border-warning/30">Action Needed</Badge>
        </motion.div>
      )}
      {potentialSIPGain > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
          className="p-4 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-primary">🚀 Increase SIP by {formatINR(potentialSIPGain / 12)}/mo → retire earlier</p>
            <p className="text-xs text-primary/70 mt-0.5">You could invest {formatINR(potentialSIPGain)} more per year</p>
          </div>
          <Button size="sm" variant="outline" className="border-primary/30 text-primary" onClick={() => navigate("/fire")}>
            Plan <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </motion.div>
      )}

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

      {/* Best Move / Worst Mistake */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard delay={0.25} className="border-success/20">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-success" />
            <h3 className="font-display font-semibold text-foreground">✅ Best Move Right Now</h3>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{analysis.bestMove}</p>
        </GlassCard>
        <GlassCard delay={0.3} className="border-destructive/20">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-destructive" />
            <h3 className="font-display font-semibold text-foreground">❌ Worst Mistake to Make</h3>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{analysis.worstMistake}</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score + Risk */}
        <GlassCard delay={0.35} className="flex flex-col items-center justify-center">
          <ScoreRing score={score} />
          <div className="mt-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Risk Level:</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
              analysis.riskLevel === "Low" ? "bg-success/15 text-success border-success/30" :
              analysis.riskLevel === "Medium" ? "bg-warning/15 text-warning border-warning/30" :
              "bg-destructive/15 text-destructive border-destructive/30"
            }`}>
              {analysis.riskLevel}
            </span>
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

      {/* Detailed Insights & Action Plans */}
      {analysis.detailedInsights.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg font-semibold text-foreground">Detailed Insights & Action Plans</h3>
          </div>
          {analysis.detailedInsights.map((insight, i) => (
            <DetailedInsightCard key={i} insight={insight} index={i} />
          ))}
        </div>
      )}

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
            <h3 className="font-display font-semibold text-foreground">🏆 Top 3 Actions</h3>
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
