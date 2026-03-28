import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroInsightProps {
  score: number;
  riskLevel: "Low" | "Medium" | "High";
  headline: string;
  subtext: string;
}

const riskConfig = {
  High: {
    icon: AlertTriangle,
    gradient: "from-destructive/20 via-destructive/5 to-transparent",
    border: "border-destructive/40",
    badge: "bg-destructive/20 text-destructive border-destructive/40",
    glow: "shadow-[0_0_60px_hsla(348,83%,65%,0.1)]",
  },
  Medium: {
    icon: Shield,
    gradient: "from-warning/20 via-warning/5 to-transparent",
    border: "border-warning/40",
    badge: "bg-warning/20 text-warning border-warning/40",
    glow: "shadow-[0_0_60px_hsla(38,92%,50%,0.1)]",
  },
  Low: {
    icon: TrendingUp,
    gradient: "from-success/20 via-success/5 to-transparent",
    border: "border-success/40",
    badge: "bg-success/20 text-success border-success/40",
    glow: "shadow-[0_0_60px_hsla(163,72%,40%,0.1)]",
  },
};

export default function HeroInsight({ score, riskLevel, headline, subtext }: HeroInsightProps) {
  const cfg = riskConfig[riskLevel];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 bg-gradient-to-r",
        cfg.gradient,
        cfg.border,
        cfg.glow,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border", cfg.badge)}>
              {riskLevel} Risk
            </span>
            <span className="text-xs text-muted-foreground font-medium">Score: {score}/100</span>
          </div>
          <h2 className="font-display text-lg md:text-xl font-bold text-foreground">{headline}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{subtext}</p>
        </div>
        <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary text-primary-foreground font-display font-bold text-2xl shrink-0">
          {score}
        </div>
      </div>
    </motion.div>
  );
}
