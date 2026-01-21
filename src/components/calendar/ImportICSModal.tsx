import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Upload, FileUp, Check, AlertCircle, Calendar } from "lucide-react";
import { parseICSFile, validateICSFile, ICSEvent } from "@/lib/icsParser";
import { cn } from "@/lib/utils";
import { EventType, CreateEventData } from "@/hooks/useCalendarEvents";
import { toast } from "sonner";

interface ImportICSModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (events: CreateEventData[]) => Promise<void>;
}

export function ImportICSModal({ open, onClose, onImport }: ImportICSModalProps) {
  const [parsedEvents, setParsedEvents] = useState<ICSEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<"upload" | "select" | "importing">("upload");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setParsedEvents([]);
    setSelectedEvents(new Set());
    setStep("upload");
    onClose();
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".ics")) {
      toast.error("Por favor selecciona un archivo .ics");
      return;
    }

    try {
      const content = await file.text();
      
      if (!validateICSFile(content)) {
        toast.error("El archivo no es un calendario válido");
        return;
      }

      const events = parseICSFile(content);
      
      if (events.length === 0) {
        toast.error("No se encontraron eventos en el archivo");
        return;
      }

      setParsedEvents(events);
      setSelectedEvents(new Set(events.map(e => e.uid)));
      setStep("select");
      toast.success(`Se encontraron ${events.length} eventos`);
    } catch (error) {
      console.error("Error parsing ICS:", error);
      toast.error("Error al leer el archivo");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const toggleEvent = (uid: string) => {
    const newSelected = new Set(selectedEvents);
    if (newSelected.has(uid)) {
      newSelected.delete(uid);
    } else {
      newSelected.add(uid);
    }
    setSelectedEvents(newSelected);
  };

  const selectAll = () => {
    setSelectedEvents(new Set(parsedEvents.map(e => e.uid)));
  };

  const deselectAll = () => {
    setSelectedEvents(new Set());
  };

  const handleImport = async () => {
    if (selectedEvents.size === 0) {
      toast.error("Selecciona al menos un evento");
      return;
    }

    setStep("importing");

    try {
      const eventsToImport: CreateEventData[] = parsedEvents
        .filter(e => selectedEvents.has(e.uid))
        .map(e => ({
          titulo: e.title,
          fecha: e.date,
          hora: e.time,
          tipo_examen: "Estudio" as EventType, // Default to study session
          notas: e.description || e.location ? 
            [e.description, e.location ? `📍 ${e.location}` : ""].filter(Boolean).join("\n") : 
            undefined,
        }));

      await onImport(eventsToImport);
      toast.success(`${eventsToImport.length} eventos importados correctamente`);
      handleClose();
    } catch (error) {
      console.error("Error importing events:", error);
      toast.error("Error al importar los eventos");
      setStep("select");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-xl gradient-text flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar desde Google Calendar
          </DialogTitle>
          <DialogDescription>
            Sube un archivo .ics exportado desde Google Calendar
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4 py-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                dragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              )}
            >
              <FileUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="font-medium mb-1">Arrastra tu archivo .ics aquí</p>
              <p className="text-sm text-muted-foreground">o haz clic para seleccionarlo</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".ics"
              onChange={handleFileInput}
              className="hidden"
            />

            <div className="bg-secondary/50 rounded-lg p-4 text-sm">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                ¿Cómo exportar desde Google Calendar?
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-xs">
                <li>Abre Google Calendar en tu navegador</li>
                <li>Ve a Configuración → Importar y exportar</li>
                <li>Haz clic en "Exportar"</li>
                <li>Descomprime el archivo descargado</li>
                <li>Sube el archivo .ics aquí</li>
              </ol>
            </div>
          </div>
        )}

        {step === "select" && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">
                {selectedEvents.size} de {parsedEvents.length} seleccionados
              </p>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs text-primary hover:underline"
                >
                  Seleccionar todos
                </button>
                <button
                  onClick={deselectAll}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Deseleccionar
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] pr-2">
              {parsedEvents.map((event) => (
                <button
                  key={event.uid}
                  onClick={() => toggleEvent(event.uid)}
                  className={cn(
                    "w-full p-3 rounded-lg border text-left transition-all",
                    selectedEvents.has(event.uid)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-secondary/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                      selectedEvents.has(event.uid) 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground"
                    )}>
                      {selectedEvents.has(event.uid) && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date + "T12:00:00").toLocaleDateString("es-AR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {event.time && ` a las ${event.time}`}
                      </p>
                      {event.location && (
                        <p className="text-xs text-muted-foreground truncate">
                          📍 {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4 mt-4 border-t border-border">
              <button
                onClick={() => setStep("upload")}
                className="flex-1 py-3 rounded-xl font-medium bg-secondary hover:bg-secondary/80 transition-all"
              >
                Atrás
              </button>
              <button
                onClick={handleImport}
                disabled={selectedEvents.size === 0}
                className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-neon-cyan to-neon-purple text-background hover:opacity-90 transition-all disabled:opacity-50"
              >
                Importar {selectedEvents.size} eventos
              </button>
            </div>
          </div>
        )}

        {step === "importing" && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center animate-pulse mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="font-medium">Importando eventos...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Por favor espera mientras se crean los eventos
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
