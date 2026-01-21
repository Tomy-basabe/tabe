import { useState, useEffect, useRef } from "react";
import { Play, Pause, Clock, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentTimerProps {
  onSaveTime: (seconds: number) => void;
  autoStart?: boolean;
}

export function DocumentTimer({ onSaveTime, autoStart = true }: DocumentTimerProps) {
  const [isRunning, setIsRunning] = useState(autoStart);
  const [seconds, setSeconds] = useState(0);
  const [savedSeconds, setSavedSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (seconds > 0 && seconds - lastSaveRef.current >= 30) {
      const toSave = seconds - savedSeconds;
      if (toSave > 0) {
        onSaveTime(toSave);
        setSavedSeconds(seconds);
        lastSaveRef.current = seconds;
      }
    }
  }, [seconds, savedSeconds, onSaveTime]);

  // Save on unmount
  useEffect(() => {
    return () => {
      const unsavedSeconds = seconds - savedSeconds;
      if (unsavedSeconds > 0) {
        onSaveTime(unsavedSeconds);
      }
    };
  }, []);

  const handleSaveNow = () => {
    const toSave = seconds - savedSeconds;
    if (toSave > 0) {
      onSaveTime(toSave);
      setSavedSeconds(seconds);
      lastSaveRef.current = seconds;
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
        isRunning ? "bg-neon-green/20 text-neon-green" : "bg-secondary text-muted-foreground"
      )}>
        <Clock className="w-4 h-4" />
        <span className="font-mono font-medium tabular-nums">
          {formatTime(seconds)}
        </span>
      </div>
      
      <button
        onClick={() => setIsRunning(!isRunning)}
        className={cn(
          "p-2 rounded-lg transition-colors",
          isRunning 
            ? "bg-neon-red/20 text-neon-red hover:bg-neon-red/30" 
            : "bg-neon-green/20 text-neon-green hover:bg-neon-green/30"
        )}
        title={isRunning ? "Pausar" : "Reanudar"}
      >
        {isRunning ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </button>

      {seconds - savedSeconds > 0 && (
        <button
          onClick={handleSaveNow}
          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          title="Guardar tiempo ahora"
        >
          <Save className="w-4 h-4" />
        </button>
      )}

      {isRunning && (
        <span className="text-xs text-muted-foreground animate-pulse">
          Grabando...
        </span>
      )}
    </div>
  );
}
