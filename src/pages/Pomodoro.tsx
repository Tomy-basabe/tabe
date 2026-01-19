import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings, Coffee, BookOpen, Target } from "lucide-react";
import { cn } from "@/lib/utils";

type TimerMode = "work" | "shortBreak" | "longBreak";

const defaultSettings = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

const modeConfig = {
  work: {
    label: "Trabajo",
    icon: BookOpen,
    color: "text-neon-cyan",
    bgColor: "bg-neon-cyan/20",
    borderColor: "border-neon-cyan",
  },
  shortBreak: {
    label: "Descanso Corto",
    icon: Coffee,
    color: "text-neon-green",
    bgColor: "bg-neon-green/20",
    borderColor: "border-neon-green",
  },
  longBreak: {
    label: "Descanso Largo",
    icon: Target,
    color: "text-neon-purple",
    bgColor: "bg-neon-purple/20",
    borderColor: "border-neon-purple",
  },
};

export default function Pomodoro() {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(defaultSettings.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const subjects = [
    "Física I",
    "Programación II",
    "Análisis Matemático II",
    "Análisis de Sistemas",
  ];

  const totalTime = defaultSettings[mode] * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === "work") {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      
      // Check if it's time for a long break
      if (newCount % defaultSettings.longBreakInterval === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
    } else {
      switchMode("work");
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(defaultSettings[newMode] * 60);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(defaultSettings[mode] * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const config = modeConfig[mode];
  const Icon = config.icon;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold gradient-text">
            Pomodoro Timer
          </h1>
          <p className="text-muted-foreground mt-1">
            Técnica de productividad para maximizar tu enfoque
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
          <Settings className="w-4 h-4" />
          Configurar
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="lg:col-span-2 card-gamer rounded-xl p-6 lg:p-10">
          {/* Mode Selector */}
          <div className="flex justify-center gap-2 mb-8">
            {(Object.keys(modeConfig) as TimerMode[]).map((m) => {
              const mConfig = modeConfig[m];
              return (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    mode === m
                      ? cn(mConfig.bgColor, mConfig.color, "border", mConfig.borderColor)
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {mConfig.label}
                </button>
              );
            })}
          </div>

          {/* Timer Display */}
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
              {/* Background Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke={`hsl(var(--${mode === "work" ? "neon-cyan" : mode === "shortBreak" ? "neon-green" : "neon-purple"}))`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                  className="transition-all duration-1000"
                  style={{
                    filter: `drop-shadow(0 0 10px hsl(var(--${mode === "work" ? "neon-cyan" : mode === "shortBreak" ? "neon-green" : "neon-purple"})))`,
                  }}
                />
              </svg>

              {/* Timer Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Icon className={cn("w-8 h-8 mb-2", config.color)} />
                <span className={cn(
                  "font-display text-5xl lg:text-6xl font-bold",
                  config.color,
                  "text-glow-cyan"
                )}>
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm text-muted-foreground mt-2">
                  {config.label}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={resetTimer}
                className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
              <button
                onClick={toggleTimer}
                className={cn(
                  "p-6 rounded-2xl transition-all",
                  isRunning
                    ? "bg-neon-red/20 text-neon-red hover:bg-neon-red/30"
                    : cn(config.bgColor, config.color, "hover:opacity-80"),
                  "glow-cyan"
                )}
              >
                {isRunning ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>
              <button className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>

            {/* Pomodoros Counter */}
            <div className="mt-8 flex items-center gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-4 h-4 rounded-full transition-all",
                    i < completedPomodoros % 4
                      ? "bg-neon-gold glow-gold"
                      : "bg-secondary"
                  )}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {completedPomodoros} pomodoros hoy
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subject Selector */}
          <div className="card-gamer rounded-xl p-5">
            <h3 className="font-display font-semibold mb-4">Materia Actual</h3>
            <div className="space-y-2">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={cn(
                    "w-full p-3 rounded-lg text-left text-sm transition-all",
                    selectedSubject === subject
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* Today's Stats */}
          <div className="card-gamer rounded-xl p-5">
            <h3 className="font-display font-semibold mb-4">Hoy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Tiempo estudiado</span>
                <span className="font-display font-bold text-neon-cyan">2h 15m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Pomodoros</span>
                <span className="font-display font-bold text-neon-gold">{completedPomodoros}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Objetivo diario</span>
                <span className="font-display font-bold text-neon-green">4/6</span>
              </div>
              <div className="progress-gamer h-2 mt-2">
                <div className="progress-gamer-bar" style={{ width: "66%" }} />
              </div>
            </div>
          </div>

          {/* Quick Settings */}
          <div className="card-gamer rounded-xl p-5">
            <h3 className="font-display font-semibold mb-4">Configuración Rápida</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Trabajo</span>
                <span>{defaultSettings.work} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Descanso corto</span>
                <span>{defaultSettings.shortBreak} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Descanso largo</span>
                <span>{defaultSettings.longBreak} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
