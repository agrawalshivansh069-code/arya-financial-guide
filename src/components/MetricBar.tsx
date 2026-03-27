import { motion } from "framer-motion";

interface MetricBarProps {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  color?: string;
  delay?: number;
}

export default function MetricBar({ label, value, max, suffix = "%", color, delay = 0 }: MetricBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor = color || (pct >= 70 ? "hsl(160,84%,44%)" : pct >= 40 ? "hsl(38,92%,50%)" : "hsl(0,72%,55%)");

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value.toFixed(1)}{suffix}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
