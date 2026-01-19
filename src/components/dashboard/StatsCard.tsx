import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "gold" | "green" | "cyan" | "purple";
}

const variantStyles = {
  default: {
    iconBg: "bg-secondary",
    iconColor: "text-foreground",
    glow: "",
  },
  gold: {
    iconBg: "bg-neon-gold/20",
    iconColor: "text-neon-gold",
    glow: "glow-gold",
  },
  green: {
    iconBg: "bg-neon-green/20",
    iconColor: "text-neon-green",
    glow: "glow-green",
  },
  cyan: {
    iconBg: "bg-neon-cyan/20",
    iconColor: "text-neon-cyan",
    glow: "glow-cyan",
  },
  purple: {
    iconBg: "bg-neon-purple/20",
    iconColor: "text-neon-purple",
    glow: "glow-purple",
  },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="card-gamer rounded-xl p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={cn(
            "text-3xl font-display font-bold",
            variant !== "default" && `text-neon-${variant}`
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            styles.iconBg,
            styles.glow
          )}
        >
          <Icon className={cn("w-6 h-6", styles.iconColor)} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive
                ? "bg-neon-green/20 text-neon-green"
                : "bg-neon-red/20 text-neon-red"
            )}
          >
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-xs text-muted-foreground">vs mes anterior</span>
        </div>
      )}
    </div>
  );
}
