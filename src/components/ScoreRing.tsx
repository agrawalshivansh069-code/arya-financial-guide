import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  size?: number;
  label?: string;
}

export default function ScoreRing({ score, size = 140, label = "Health Score" }: ScoreRingProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "hsl(160, 84%, 44%)" : score >= 45 ? "hsl(38, 92%, 50%)" : "hsl(0, 72%, 55%)";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(220, 14%, 18%)" strokeWidth={8} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={8}
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-display text-3xl font-bold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">/ 100</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
