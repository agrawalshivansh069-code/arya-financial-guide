import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DetailedInsight } from "@/lib/finance";

const typeStyles = {
  success: "border-success/30 bg-success/5",
  warning: "border-warning/30 bg-warning/5",
  danger: "border-destructive/30 bg-destructive/5",
  info: "border-info/30 bg-info/5",
};

const tagStyles = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-info/15 text-info border-info/30",
};

const icons = {
  success: "✅",
  warning: "⚠️",
  danger: "🚨",
  info: "💡",
};

interface Props {
  insight: DetailedInsight;
  index: number;
}

export default function DetailedInsightCard({ insight, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn("rounded-xl border p-5 space-y-3", typeStyles[insight.type])}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icons[insight.type]}</span>
          <h4 className="font-display font-semibold text-foreground">{insight.title}</h4>
        </div>
        {insight.tag && (
          <span className={cn("shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", tagStyles[insight.type])}>
            {insight.tag}
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <p className="text-foreground/80 leading-relaxed">{insight.explanation}</p>
        <div className="pl-3 border-l-2 border-muted-foreground/20">
          <p className="text-muted-foreground leading-relaxed">{insight.impact}</p>
        </div>
      </div>

      {insight.actions.length > 0 && (
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Action Plan</p>
          <ol className="space-y-1.5">
            {insight.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </motion.div>
  );
}
