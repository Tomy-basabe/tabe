import { useState } from "react";
import { 
  Layers, Target, Clock, TrendingUp, Brain, 
  CheckCircle2, XCircle, Sparkles, ChevronRight,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFlashcardStats } from "@/hooks/useFlashcardStats";

export function FlashcardStats() {
  const {
    deckStats,
    totalCardsStudied,
    totalCorrect,
    totalIncorrect,
    overallAccuracy,
    totalStudyTime,
    averageTimePerCard,
    sessionsThisWeek,
    studyStreak,
    loading,
  } = useFlashcardStats();

  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card-gamer rounded-xl p-5 animate-pulse">
              <div className="w-10 h-10 bg-secondary rounded-xl mb-3" />
              <div className="h-6 bg-secondary rounded w-16 mb-2" />
              <div className="h-4 bg-secondary rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const selectedDeckData = deckStats.find(d => d.id === selectedDeck);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
          <Layers className="w-6 h-6 text-background" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">Estadísticas de Flashcards</h2>
          <p className="text-sm text-muted-foreground">Análisis detallado de tu aprendizaje</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-gamer rounded-xl p-5">
          <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center mb-3">
            <Brain className="w-5 h-5 text-neon-cyan" />
          </div>
          <p className="text-2xl font-display font-bold text-neon-cyan">{totalCardsStudied}</p>
          <p className="text-xs text-muted-foreground">Respuestas totales</p>
        </div>

        <div className="card-gamer rounded-xl p-5">
          <div className="w-10 h-10 rounded-xl bg-neon-green/20 flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-neon-green" />
          </div>
          <p className="text-2xl font-display font-bold text-neon-green">{overallAccuracy.toFixed(0)}%</p>
          <p className="text-xs text-muted-foreground">Precisión global</p>
        </div>

        <div className="card-gamer rounded-xl p-5">
          <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-neon-purple" />
          </div>
          <p className="text-2xl font-display font-bold text-neon-purple">{formatTime(averageTimePerCard)}</p>
          <p className="text-xs text-muted-foreground">Promedio por tarjeta</p>
        </div>

        <div className="card-gamer rounded-xl p-5">
          <div className="w-10 h-10 rounded-xl bg-neon-gold/20 flex items-center justify-center mb-3">
            <Flame className="w-5 h-5 text-neon-gold" />
          </div>
          <p className="text-2xl font-display font-bold text-neon-gold">{studyStreak}</p>
          <p className="text-xs text-muted-foreground">Días de racha</p>
        </div>
      </div>

      {/* Weekly Evolution Chart */}
      <div className="card-gamer rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold">Evolución Semanal</h3>
          <span className="text-sm text-muted-foreground">
            Tiempo total: {formatDuration(totalStudyTime)}
          </span>
        </div>

        {sessionsThisWeek.length > 0 ? (
          <div className="flex items-end justify-between gap-2 h-32">
            {(() => {
              // Group sessions by day
              const dayMap: Record<string, number> = {};
              const today = new Date();
              
              for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const key = date.toISOString().split('T')[0];
                dayMap[key] = 0;
              }
              
              sessionsThisWeek.forEach(s => {
                if (dayMap[s.date] !== undefined) {
                  dayMap[s.date] += s.duration_seconds;
                }
              });

              const values = Object.values(dayMap);
              const maxVal = Math.max(...values, 1);
              const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

              return Object.entries(dayMap).map(([date, seconds], i) => {
                const d = new Date(date);
                const dayName = days[d.getDay()];
                const height = (seconds / maxVal) * 100;
                
                return (
                  <div key={date} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full h-full flex items-end">
                      <div
                        className={cn(
                          "w-full rounded-t-lg transition-all duration-500",
                          seconds > 0 
                            ? "bg-gradient-to-t from-neon-purple to-neon-cyan" 
                            : "bg-secondary/50"
                        )}
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{dayName}</span>
                  </div>
                );
              });
            })()}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
            No hay sesiones esta semana
          </div>
        )}
      </div>

      {/* Deck Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Deck List */}
        <div className="card-gamer rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Rendimiento por Mazo</h3>
          
          {deckStats.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No hay mazos creados aún
            </p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {deckStats.map(deck => {
                const isSelected = selectedDeck === deck.id;
                return (
                  <button
                    key={deck.id}
                    onClick={() => setSelectedDeck(isSelected ? null : deck.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl transition-all",
                      isSelected 
                        ? "bg-primary/10 border border-primary/30" 
                        : "bg-secondary/50 hover:bg-secondary"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{deck.nombre}</p>
                        <p className="text-xs text-muted-foreground truncate">{deck.subject_nombre}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-lg font-display font-bold",
                          deck.accuracy >= 70 ? "text-neon-green" :
                          deck.accuracy >= 40 ? "text-neon-gold" :
                          deck.accuracy > 0 ? "text-neon-red" : "text-muted-foreground"
                        )}>
                          {deck.accuracy > 0 ? `${deck.accuracy.toFixed(0)}%` : "-"}
                        </span>
                        <ChevronRight className={cn(
                          "w-4 h-4 transition-transform",
                          isSelected && "rotate-90"
                        )} />
                      </div>
                    </div>
                    
                    {/* Mini progress bar */}
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-neon-cyan to-neon-green transition-all"
                        style={{ width: `${deck.accuracy}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Deck Detail */}
        <div className="card-gamer rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">
            {selectedDeckData ? selectedDeckData.nombre : "Selecciona un mazo"}
          </h3>
          
          {selectedDeckData ? (
            <div className="space-y-6">
              {/* Accuracy Stats */}
              <div className="flex items-center gap-4">
                <div className="flex-1 text-center p-4 bg-neon-green/10 rounded-xl border border-neon-green/30">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-neon-green" />
                  <p className="text-xl font-display font-bold text-neon-green">
                    {selectedDeckData.total_correct}
                  </p>
                  <p className="text-xs text-muted-foreground">Correctas</p>
                </div>
                <div className="flex-1 text-center p-4 bg-neon-red/10 rounded-xl border border-neon-red/30">
                  <XCircle className="w-6 h-6 mx-auto mb-2 text-neon-red" />
                  <p className="text-xl font-display font-bold text-neon-red">
                    {selectedDeckData.total_incorrect}
                  </p>
                  <p className="text-xs text-muted-foreground">Incorrectas</p>
                </div>
              </div>

              {/* Card Categories */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Estado de las tarjetas</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-neon-green" />
                      <span className="text-sm">Dominadas (&gt;70%)</span>
                    </div>
                    <span className="font-bold text-neon-green">{selectedDeckData.mastered_cards}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-neon-gold" />
                      <span className="text-sm">Aprendiendo (30-70%)</span>
                    </div>
                    <span className="font-bold text-neon-gold">{selectedDeckData.learning_cards}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-neon-red" />
                      <span className="text-sm">Difíciles (&lt;30%)</span>
                    </div>
                    <span className="font-bold text-neon-red">{selectedDeckData.difficult_cards}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                      <span className="text-sm">Sin estudiar</span>
                    </div>
                    <span className="font-bold text-muted-foreground">{selectedDeckData.new_cards}</span>
                  </div>
                </div>
              </div>

              {/* Visual breakdown */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Distribución</p>
                <div className="h-4 rounded-full overflow-hidden flex bg-secondary">
                  {selectedDeckData.mastered_cards > 0 && (
                    <div 
                      className="bg-neon-green h-full" 
                      style={{ width: `${(selectedDeckData.mastered_cards / selectedDeckData.total_cards) * 100}%` }}
                    />
                  )}
                  {selectedDeckData.learning_cards > 0 && (
                    <div 
                      className="bg-neon-gold h-full" 
                      style={{ width: `${(selectedDeckData.learning_cards / selectedDeckData.total_cards) * 100}%` }}
                    />
                  )}
                  {selectedDeckData.difficult_cards > 0 && (
                    <div 
                      className="bg-neon-red h-full" 
                      style={{ width: `${(selectedDeckData.difficult_cards / selectedDeckData.total_cards) * 100}%` }}
                    />
                  )}
                  {selectedDeckData.new_cards > 0 && (
                    <div 
                      className="bg-muted-foreground/30 h-full" 
                      style={{ width: `${(selectedDeckData.new_cards / selectedDeckData.total_cards) * 100}%` }}
                    />
                  )}
                </div>
              </div>

              {/* Recommendation */}
              {selectedDeckData.difficult_cards > 0 && (
                <div className="p-4 bg-neon-purple/10 rounded-xl border border-neon-purple/30">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-neon-purple flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-neon-purple">Recomendación</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tienes {selectedDeckData.difficult_cards} tarjeta{selectedDeckData.difficult_cards > 1 ? 's' : ''} difícil{selectedDeckData.difficult_cards > 1 ? 'es' : ''}. 
                        El sistema de repetición espaciada las priorizará en tu próxima sesión.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
              <div className="text-center">
                <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Selecciona un mazo para ver detalles</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
