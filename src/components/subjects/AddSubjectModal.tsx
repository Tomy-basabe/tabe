import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, X, BookOpen, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Subject, CreateSubjectData } from "@/hooks/useSubjects";

interface AddSubjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubjectData) => Promise<unknown>;
  
  existingSubjects: Subject[];
  years: number[];
}

export function AddSubjectModal({ open, onClose, onSubmit, existingSubjects, years }: AddSubjectModalProps) {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [año, setAño] = useState(1);
  const [requiereRegular, setRequiereRegular] = useState<string[]>([]);
  const [requiereAprobada, setRequiereAprobada] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDependencies, setShowDependencies] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !codigo) return;

    setLoading(true);
    try {
      await onSubmit({
        nombre,
        codigo: codigo.toUpperCase(),
        año,
        requiere_regular: requiereRegular,
        requiere_aprobada: requiereAprobada,
      });
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNombre("");
    setCodigo("");
    setAño(1);
    setRequiereRegular([]);
    setRequiereAprobada([]);
    setShowDependencies(false);
    onClose();
  };

  const toggleRegular = (subjectId: string) => {
    if (requiereRegular.includes(subjectId)) {
      setRequiereRegular(prev => prev.filter(id => id !== subjectId));
    } else {
      setRequiereRegular(prev => [...prev, subjectId]);
      // Remove from aprobada if it was there
      setRequiereAprobada(prev => prev.filter(id => id !== subjectId));
    }
  };

  const toggleAprobada = (subjectId: string) => {
    if (requiereAprobada.includes(subjectId)) {
      setRequiereAprobada(prev => prev.filter(id => id !== subjectId));
    } else {
      setRequiereAprobada(prev => [...prev, subjectId]);
      // Remove from regular if it was there
      setRequiereRegular(prev => prev.filter(id => id !== subjectId));
    }
  };

  const subjectsByYear = years.map(y => ({
    year: y,
    subjects: existingSubjects.filter(s => s.año === y),
  }));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl gradient-text flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Agregar Nueva Materia
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Nombre de la materia</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Análisis Matemático I"
                className="w-full mt-1 px-4 py-3 bg-secondary rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Código</label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  placeholder="Ej: AM1"
                  maxLength={5}
                  className="w-full mt-1 px-4 py-3 bg-secondary rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Año</label>
                <select
                  value={año}
                  onChange={(e) => setAño(parseInt(e.target.value))}
                  className="w-full mt-1 px-4 py-3 bg-secondary rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {[1, 2, 3, 4, 5, 6].map(y => (
                    <option key={y} value={y}>Año {y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dependencies Section */}
          {existingSubjects.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowDependencies(!showDependencies)}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <BookOpen className="w-4 h-4" />
                {showDependencies ? "Ocultar correlativas" : "Agregar correlativas"}
              </button>

              {showDependencies && (
                <div className="mt-4 space-y-4 animate-fade-in">
                  <p className="text-xs text-muted-foreground">
                    Selecciona las materias necesarias para cursar esta materia
                  </p>

                  {subjectsByYear.map(({ year, subjects }) => 
                    subjects.length > 0 && (
                      <div key={year} className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Año {year}</p>
                        <div className="grid grid-cols-1 gap-2">
                          {subjects.map(subject => {
                            const isRegular = requiereRegular.includes(subject.id);
                            const isAprobada = requiereAprobada.includes(subject.id);

                            return (
                              <div 
                                key={subject.id}
                                className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                              >
                                <span className="text-sm font-medium">
                                  {subject.codigo} - {subject.nombre}
                                </span>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleRegular(subject.id)}
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
                                    onClick={() => toggleAprobada(subject.id)}
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
                    )
                  )}

                  {/* Selected dependencies summary */}
                  {(requiereRegular.length > 0 || requiereAprobada.length > 0) && (
                    <div className="p-3 bg-primary/10 rounded-xl space-y-2">
                      <p className="text-xs font-medium text-foreground">Correlativas seleccionadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {requiereRegular.map(id => {
                          const subject = existingSubjects.find(s => s.id === id);
                          return (
                            <span 
                              key={id} 
                              className="px-2 py-1 bg-neon-cyan/20 text-neon-cyan rounded-lg text-xs flex items-center gap-1"
                            >
                              {subject?.codigo} Regular
                              <button type="button" onClick={() => toggleRegular(id)}>
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}
                        {requiereAprobada.map(id => {
                          const subject = existingSubjects.find(s => s.id === id);
                          return (
                            <span 
                              key={id} 
                              className="px-2 py-1 bg-neon-gold/20 text-neon-gold rounded-lg text-xs flex items-center gap-1"
                            >
                              {subject?.codigo} Aprobada
                              <button type="button" onClick={() => toggleAprobada(id)}>
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 rounded-xl font-medium bg-secondary hover:bg-secondary/80 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!nombre || !codigo || loading}
              className={cn(
                "flex-1 py-3 rounded-xl font-medium transition-all",
                nombre && codigo
                  ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-background hover:opacity-90"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              {loading ? "Creando..." : "Crear Materia"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
