import { cn } from "@/lib/utils";
import { BookOpen, Lock, CheckCircle2, Clock, RotateCcw } from "lucide-react";

export type SubjectStatus = "aprobada" | "regular" | "cursable" | "bloqueada" | "recursar";

interface SubjectCardProps {
  nombre: string;
  codigo: string;
  status: SubjectStatus;
  nota?: number | null;
  año: number;
  onClick?: () => void;
  compact?: boolean;
}

const statusConfig = {
  aprobada: {
    label: "Aprobada",
    icon: CheckCircle2,
    className: "subject-approved animate-pulse-gold",
    iconColor: "text-neon-gold",
    textColor: "text-neon-gold",
  },
  regular: {
    label: "Regular",
    icon: Clock,
    className: "subject-regular",
    iconColor: "text-neon-cyan",
    textColor: "text-neon-cyan",
  },
  cursable: {
    label: "Cursable",
    icon: BookOpen,
    className: "subject-available",
    iconColor: "text-neon-green",
    textColor: "text-neon-green",
  },
  bloqueada: {
    label: "Bloqueada",
    icon: Lock,
    className: "subject-blocked opacity-60",
    iconColor: "text-muted-foreground",
    textColor: "text-muted-foreground",
  },
  recursar: {
    label: "Recursar",
    icon: RotateCcw,
    className: "bg-neon-red/10 border border-neon-red/50",
    iconColor: "text-neon-red",
    textColor: "text-neon-red",
  },
};

export function SubjectCard({
  nombre,
  codigo,
  status,
  nota,
  año,
  onClick,
  compact = false,
}: SubjectCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-xl transition-all duration-300 text-left",
        config.className,
        "hover:scale-[1.02] hover:shadow-lg cursor-pointer",
        compact ? "p-3" : "p-4"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", config.iconColor)} />
          <span className={cn("text-xs font-medium", config.textColor)}>
            {config.label}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">Año {año}</span>
      </div>

      <h3 className={cn(
        "font-medium mb-1 line-clamp-2",
        compact ? "text-xs" : "text-sm",
        status === "bloqueada" ? "text-muted-foreground" : "text-foreground"
      )}>
        {nombre}
      </h3>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-muted-foreground">{codigo}</span>
        {nota !== undefined && nota !== null && (
          <span className={cn(
            "text-sm font-display font-bold",
            nota >= 7 ? "text-neon-gold" : nota >= 4 ? "text-neon-cyan" : "text-neon-red"
          )}>
            {nota}
          </span>
        )}
      </div>
    </button>
  );
}
