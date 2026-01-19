import { BarChart3, TrendingUp, Clock, Target, Trophy, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const weeklyData = [
  { day: "Lun", hours: 2.5, subjects: ["Física I", "Programación"] },
  { day: "Mar", hours: 3.0, subjects: ["Análisis", "Física I"] },
  { day: "Mié", hours: 1.5, subjects: ["Programación"] },
  { day: "Jue", hours: 4.0, subjects: ["Física I", "Análisis", "Sistemas"] },
  { day: "Vie", hours: 2.0, subjects: ["Programación"] },
  { day: "Sáb", hours: 5.0, subjects: ["Física I", "Análisis"] },
  { day: "Dom", hours: 1.0, subjects: ["Repaso general"] },
];

const subjectProgress = [
  { name: "Física I", hours: 15, progress: 75, color: "neon-cyan" },
  { name: "Programación II", hours: 12, progress: 60, color: "neon-green" },
  { name: "Análisis Matemático II", hours: 10, progress: 50, color: "neon-purple" },
  { name: "Análisis de Sistemas", hours: 8, progress: 40, color: "neon-gold" },
];

const achievements = [
  { id: 1, name: "Primera Semana", description: "Completaste tu primera semana de estudio", unlocked: true, icon: Trophy },
  { id: 2, name: "Madrugador", description: "Estudiaste antes de las 8am", unlocked: true, icon: Clock },
  { id: 3, name: "Maratón", description: "4+ horas de estudio en un día", unlocked: true, icon: Target },
  { id: 4, name: "Consistente", description: "7 días seguidos estudiando", unlocked: false, icon: TrendingUp },
];

export default function Metrics() {
  const maxHours = Math.max(...weeklyData.map((d) => d.hours));
  const totalHours = weeklyData.reduce((acc, d) => acc + d.hours, 0);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold gradient-text">
            Métricas y Rendimiento
          </h1>
          <p className="text-muted-foreground mt-1">
            Analiza tu progreso y optimiza tu estudio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium border-none focus:ring-2 focus:ring-primary">
            <option>Esta semana</option>
            <option>Este mes</option>
            <option>Último trimestre</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-gamer rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-neon-cyan" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-neon-cyan">{totalHours}h</p>
          <p className="text-xs text-muted-foreground">Horas esta semana</p>
        </div>
        <div className="card-gamer rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-neon-gold/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-neon-gold" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-neon-gold">32</p>
          <p className="text-xs text-muted-foreground">Pomodoros completados</p>
        </div>
        <div className="card-gamer rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-neon-green/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-neon-green" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-neon-green">4</p>
          <p className="text-xs text-muted-foreground">Materias estudiadas</p>
        </div>
        <div className="card-gamer rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-neon-purple" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-neon-purple">+15%</p>
          <p className="text-xs text-muted-foreground">vs semana anterior</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 card-gamer rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-lg">Horas de Estudio Semanal</h2>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg transition-all duration-500 relative group"
                  style={{
                    height: `${(day.hours / maxHours) * 100}%`,
                    background: `linear-gradient(180deg, hsl(var(--neon-cyan)) 0%, hsl(var(--neon-purple)) 100%)`,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card px-2 py-1 rounded text-xs whitespace-nowrap">
                    {day.hours}h
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Promedio diario</p>
            <p className="text-2xl font-display font-bold gradient-text">
              {(totalHours / 7).toFixed(1)}h
            </p>
          </div>
        </div>

        {/* Subject Progress */}
        <div className="card-gamer rounded-xl p-5">
          <h3 className="font-display font-semibold mb-4">Por Materia</h3>
          <div className="space-y-4">
            {subjectProgress.map((subject) => (
              <div key={subject.name}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="truncate">{subject.name}</span>
                  <span className={`font-medium text-${subject.color}`}>{subject.hours}h</span>
                </div>
                <div className="progress-gamer h-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${subject.progress}%`,
                      background: `linear-gradient(90deg, hsl(var(--${subject.color})) 0%, hsl(var(--${subject.color}) / 0.7) 100%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card-gamer rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-lg">Logros</h2>
          <span className="text-sm text-muted-foreground">
            {achievements.filter((a) => a.unlocked).length}/{achievements.length} desbloqueados
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={cn(
                  "p-4 rounded-xl border transition-all",
                  achievement.unlocked
                    ? "bg-neon-gold/10 border-neon-gold/30"
                    : "bg-secondary/50 border-border opacity-50"
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                    achievement.unlocked
                      ? "bg-neon-gold/20 glow-gold"
                      : "bg-secondary"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6",
                      achievement.unlocked ? "text-neon-gold" : "text-muted-foreground"
                    )}
                  />
                </div>
                <h3 className={cn(
                  "font-medium text-sm",
                  achievement.unlocked ? "text-neon-gold" : "text-muted-foreground"
                )}>
                  {achievement.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
