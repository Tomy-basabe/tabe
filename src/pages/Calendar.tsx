import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "P1" | "P2" | "Global" | "Recuperatorio" | "Final" | "Estudio";
  subject?: string;
}

const eventTypeColors = {
  P1: "bg-neon-cyan/20 border-neon-cyan text-neon-cyan",
  P2: "bg-neon-purple/20 border-neon-purple text-neon-purple",
  Global: "bg-neon-gold/20 border-neon-gold text-neon-gold",
  Recuperatorio: "bg-neon-red/20 border-neon-red text-neon-red",
  Final: "bg-neon-green/20 border-neon-green text-neon-green",
  Estudio: "bg-secondary border-muted-foreground text-muted-foreground",
};

// Mock events
const mockEvents: CalendarEvent[] = [
  { id: "1", title: "Parcial 2 - Física I", date: new Date(2025, 0, 22), type: "P2", subject: "Física I" },
  { id: "2", title: "Parcial 1 - Programación II", date: new Date(2025, 0, 24), type: "P1", subject: "Programación II" },
  { id: "3", title: "Final - Análisis Matemático I", date: new Date(2025, 0, 28), type: "Final", subject: "Análisis Matemático I" },
  { id: "4", title: "Sesión de estudio", date: new Date(2025, 0, 20), type: "Estudio" },
  { id: "5", title: "Global - Álgebra", date: new Date(2025, 0, 30), type: "Global", subject: "Álgebra" },
];

const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 lg:h-32" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const events = getEventsForDate(date);
      const today = isToday(date);
      const selected = isSelected(date);

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={cn(
            "h-24 lg:h-32 p-2 border border-border rounded-lg transition-all text-left relative",
            today && "border-primary",
            selected && "bg-primary/10 border-primary",
            !today && !selected && "hover:bg-secondary/50"
          )}
        >
          <span
            className={cn(
              "text-sm font-medium",
              today && "text-primary font-bold",
              !today && "text-foreground"
            )}
          >
            {day}
          </span>
          {today && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
          )}
          <div className="mt-1 space-y-1 overflow-hidden">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded border truncate",
                  eventTypeColors[event.type]
                )}
              >
                {event.title}
              </div>
            ))}
            {events.length > 2 && (
              <p className="text-xs text-muted-foreground">+{events.length - 2} más</p>
            )}
          </div>
        </button>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold gradient-text">
            Calendario Académico
          </h1>
          <p className="text-muted-foreground mt-1">
            Planifica y visualiza tus exámenes y sesiones de estudio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Hoy
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Evento
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 card-gamer rounded-xl p-4 lg:p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl">
              {months[month]} {year}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Sidebar - Selected Date Events */}
        <div className="card-gamer rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold">
              {selectedDate
                ? selectedDate.toLocaleDateString("es-AR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                : "Selecciona un día"}
            </h3>
          </div>

          {selectedDate && selectedDateEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No hay eventos para este día</p>
              <button className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                Agregar evento
              </button>
            </div>
          )}

          {selectedDateEvents.length > 0 && (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "p-3 rounded-lg border",
                    eventTypeColors[event.type]
                  )}
                >
                  <p className="font-medium text-sm">{event.title}</p>
                  {event.subject && (
                    <p className="text-xs opacity-80 mt-1">{event.subject}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-medium mb-3">Tipos de evento</h4>
            <div className="space-y-2">
              {Object.entries(eventTypeColors).map(([type, colors]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full border", colors)} />
                  <span className="text-xs text-muted-foreground">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
