import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, CheckCircle2, Clock, X, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Subject, SubjectWithStatus, Dependency } from "@/hooks/useSubjects";

interface EditDependenciesModalProps {
  subject: SubjectWithStatus | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (subjectId: string, requiere_regular: string[], requiere_aprobada: string[]) => Promise<void>;
  allSubjects: Subject[];
}

export function EditDependenciesModal({ 
  subject, 
  open, 
  onClose, 
  onUpdate, 
  allSubjects 
}: EditDependenciesModalProps) {
  const [requiereRegular, setRequiereRegular] = useState<string[]>([]);
  const [requiereAprobada, setRequiereAprobada] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subject) {
      const regularIds = subject.dependencies
        .filter(d => d.requiere_regular)
        .map(d => d.requiere_regular as string);
      const aprobadaIds = subject.dependencies
        .filter(d => d.requiere_aprobada)
        .map(d => d.requiere_aprobada as string);
      
      setRequiereRegular(regularIds);
      setRequiereAprobada(aprobadaIds);
    }
  }, [subject]);

  if (!subject) return null;

  // Filter subjects that can be dependencies (earlier years or same year with lower numero)
  const availableSubjects = allSubjects.filter(s => 
    s.id !== subject.id && 
    (s.año < subject.año || (s.año === subject.año && s.numero_materia < subject.numero_materia))
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(subject.id, requiereRegular, requiereAprobada);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const toggleRegular = (subjectId: string) => {
    if (requiereRegular.includes(subjectId)) {
      setRequiereRegular(prev => prev.filter(id => id !== subjectId));
    } else {
      setRequiereRegular(prev => [...prev, subjectId]);
      setRequiereAprobada(prev => prev.filter(id => id !== subjectId));
    }
  };

  const toggleAprobada = (subjectId: string) => {
    if (requiereAprobada.includes(subjectId)) {
      setRequiereAprobada(prev => prev.filter(id => id !== subjectId));
    } else {
      setRequiereAprobada(prev => [...prev, subjectId]);
      setRequiereRegular(prev => prev.filter(id => id !== subjectId));
    }
  };

  const subjectsByYear = [...new Set(availableSubjects.map(s => s.año))]
    .sort((a, b) => a - b)
    .map(year => ({
      year,
      subjects: availableSubjects.filter(s => s.año === year),
    }));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl gradient-text flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Editar Correlativas
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {subject.codigo} - {subject.nombre}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {availableSubjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                No hay materias anteriores disponibles para agregar como correlativas
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                Selecciona las materias necesarias para cursar esta materia
              </p>

              {subjectsByYear.map(({ year, subjects }) => (
                <div key={year} className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Año {year}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {subjects.map(s => {
                      const isRegular = requiereRegular.includes(s.id);
                      const isAprobada = requiereAprobada.includes(s.id);

                      return (
                        <div 
                          key={s.id}
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                        >
                          <span className="text-sm font-medium">
                            {s.codigo} - {s.nombre}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => toggleRegular(s.id)}
                              className={cn(
                                "px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1",
                                isRegular 
                                  ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan" 
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              )}
                            >
                              <Clock className="w-3 h-3" />
                              Regular
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleAprobada(s.id)}
                              className={cn(
                                "px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1",
                                isAprobada 
                                  ? "bg-neon-gold/20 text-neon-gold border border-neon-gold" 
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              )}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Aprobada
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Selected dependencies summary */}
              {(requiereRegular.length > 0 || requiereAprobada.length > 0) && (
                <div className="p-3 bg-primary/10 rounded-xl space-y-2">
                  <p className="text-xs font-medium text-foreground">Correlativas actuales:</p>
                  <div className="flex flex-wrap gap-2">
                    {requiereRegular.map(id => {
                      const s = allSubjects.find(sub => sub.id === id);
                      return (
                        <span 
                          key={id} 
                          className="px-2 py-1 bg-neon-cyan/20 text-neon-cyan rounded-lg text-xs flex items-center gap-1"
                        >
                          {s?.codigo} Regular
                          <button type="button" onClick={() => toggleRegular(id)}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                    {requiereAprobada.map(id => {
                      const s = allSubjects.find(sub => sub.id === id);
                      return (
                        <span 
                          key={id} 
                          className="px-2 py-1 bg-neon-gold/20 text-neon-gold rounded-lg text-xs flex items-center gap-1"
                        >
                          {s?.codigo} Aprobada
                          <button type="button" onClick={() => toggleAprobada(id)}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-medium bg-secondary hover:bg-secondary/80 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-neon-cyan to-neon-purple text-background hover:opacity-90 transition-all"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
