import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { EventType, CreateEventData } from "@/hooks/useCalendarEvents";
import { Subject } from "@/hooks/useSubjects";

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventData) => Promise<void>;
  subjects: Subject[];
  initialDate?: Date;
}

const eventTypes: { value: EventType; label: string; color: string }[] = [
  { value: "P1", label: "Parcial 1", color: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan" },
  { value: "P2", label: "Parcial 2", color: "bg-neon-purple/20 text-neon-purple border-neon-purple" },
  { value: "Global", label: "Global", color: "bg-neon-gold/20 text-neon-gold border-neon-gold" },
  { value: "Recuperatorio", label: "Recuperatorio", color: "bg-neon-red/20 text-neon-red border-neon-red" },
  { value: "Final", label: "Final", color: "bg-neon-green/20 text-neon-green border-neon-green" },
  { value: "Estudio", label: "Sesión de Estudio", color: "bg-muted text-muted-foreground border-muted-foreground" },
];

export function AddEventModal({ open, onClose, onSubmit, subjects, initialDate }: AddEventModalProps) {
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState<Date | undefined>(initialDate || new Date());
  const [hora, setHora] = useState("");
  const [tipoExamen, setTipoExamen] = useState<EventType>("P1");
  const [subjectId, setSubjectId] = useState<string>("");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const handleClose = () => {
    setTitulo("");
    setFecha(new Date());
    setHora("");
    setTipoExamen("P1");
    setSubjectId("");
    setNotas("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !fecha) return;

    setLoading(true);
    try {
      await onSubmit({
        titulo: titulo.trim(),
        fecha: fecha.toISOString().split('T')[0],
        hora: hora || undefined,
        tipo_examen: tipoExamen,
        subject_id: subjectId || undefined,
        notas: notas || undefined,
      });
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  // Generate title based on type and subject
  const generateTitle = (type: EventType, subId: string) => {
    const subject = subjects.find(s => s.id === subId);
    if (!subject) return "";
    
    const typeLabel = eventTypes.find(t => t.value === type)?.label || type;
    return `${typeLabel} - ${subject.nombre}`;
  };

  const handleTypeChange = (type: EventType) => {
    setTipoExamen(type);
    if (subjectId && type !== "Estudio") {
      setTitulo(generateTitle(type, subjectId));
    }
  };

  const handleSubjectChange = (subId: string) => {
    setSubjectId(subId);
    if (subId && tipoExamen !== "Estudio") {
      setTitulo(generateTitle(tipoExamen, subId));
    }
  };

  // Group subjects by year
  const subjectsByYear = [...new Set(subjects.map(s => s.año))]
    .sort((a, b) => a - b)
    .map(year => ({
      year,
      subjects: subjects.filter(s => s.año === year),
    }));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl gradient-text flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Nuevo Evento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de evento</label>
            <div className="grid grid-cols-3 gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleTypeChange(type.value)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                    tipoExamen === type.value
                      ? type.color
                      : "bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Selection */}
          {tipoExamen !== "Estudio" && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Materia
              </label>
              <select
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              >
                <option value="">Seleccionar materia...</option>
                {subjectsByYear.map(({ year, subjects: yearSubjects }) => (
                  <optgroup key={year} label={`Año ${year}`}>
                    {yearSubjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        #{subject.numero_materia} - {subject.nombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Título del evento</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Parcial 1 - Análisis Matemático"
              className="w-full px-4 py-2.5 bg-secondary rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Fecha
            </label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full px-4 py-2.5 bg-secondary rounded-xl border border-border text-left text-sm",
                    !fecha && "text-muted-foreground"
                  )}
                >
                  {fecha ? format(fecha, "PPP", { locale: es }) : "Seleccionar fecha"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fecha}
                  onSelect={(date) => {
                    setFecha(date);
                    setDateOpen(false);
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hora (opcional)
            </label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notas (opcional)</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Agregar notas adicionales..."
              rows={2}
              className="w-full px-4 py-2.5 bg-secondary rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 rounded-xl font-medium bg-secondary hover:bg-secondary/80 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !titulo.trim() || !fecha}
              className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-neon-cyan to-neon-purple text-background hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Crear Evento"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
