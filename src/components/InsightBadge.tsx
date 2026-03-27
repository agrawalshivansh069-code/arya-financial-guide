import { cn } from "@/lib/utils";

const typeStyles = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-info/15 text-info border-info/30",
};

interface InsightBadgeProps {
  type: "success" | "warning" | "danger" | "info";
  text: string;
  tag?: string;
}

export default function InsightBadge({ type, text, tag }: InsightBadgeProps) {
  return (
    <div className={cn("flex items-start gap-3 p-3 rounded-lg border text-sm", typeStyles[type])}>
      <span className="mt-0.5">{type === "success" ? "✅" : type === "warning" ? "⚠️" : type === "danger" ? "🚨" : "💡"}</span>
      <div className="flex-1">
        <p className="leading-relaxed">{text}</p>
        {tag && (
          <span className={cn("inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border", typeStyles[type])}>
            {tag}
          </span>
        )}
      </div>
    </div>
  );
}
