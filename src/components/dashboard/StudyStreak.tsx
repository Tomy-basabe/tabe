import { Flame, Trophy } from "lucide-react";

interface StudyStreakProps {
  currentStreak: number;
  bestStreak: number;
  weekData: { day: string; studied: boolean; minutes: number }[];
}

export function StudyStreak({ currentStreak, bestStreak, weekData }: StudyStreakProps) {
  return (
    <div className="card-gamer rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg">Racha de Estudio</h3>
        <Flame className="w-5 h-5 text-neon-gold" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="text-center p-3 rounded-lg bg-neon-gold/10 border border-neon-gold/30">
          <Flame className="w-6 h-6 mx-auto mb-1 text-neon-gold" />
          <p className="text-2xl font-display font-bold text-neon-gold">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">Días seguidos</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-neon-purple/10 border border-neon-purple/30">
          <Trophy className="w-6 h-6 mx-auto mb-1 text-neon-purple" />
          <p className="text-2xl font-display font-bold text-neon-purple">{bestStreak}</p>
          <p className="text-xs text-muted-foreground">Mejor racha</p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-1">
        {weekData.map((day) => (
          <div key={day.day} className="flex-1 flex flex-col items-center">
            <div
              className={`w-full rounded-t transition-all duration-300 ${
                day.studied
                  ? "bg-gradient-to-t from-neon-cyan to-neon-purple"
                  : "bg-secondary"
              }`}
              style={{
                height: day.studied ? `${Math.max(20, (day.minutes / 120) * 60)}px` : "8px",
              }}
            />
            <span className={`text-xs mt-1 ${day.studied ? "text-foreground" : "text-muted-foreground"}`}>
              {day.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
