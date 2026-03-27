import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export default function GlassCard({ children, className, hover = true, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn(
        "glass-card rounded-xl p-5 transition-all duration-300",
        hover && "hover:border-primary/30 hover:shadow-[0_0_30px_hsla(160,84%,44%,0.08)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
