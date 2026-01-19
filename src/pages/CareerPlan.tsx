import { useState } from "react";
import { Filter, GraduationCap, Search } from "lucide-react";
import { SubjectCard, SubjectStatus } from "@/components/dashboard/SubjectCard";
import { cn } from "@/lib/utils";

// Mock data completo del plan de carrera
const allSubjects = [
  // Año 1
  { id: "1", nombre: "Análisis Matemático I", codigo: "AM1", status: "aprobada" as SubjectStatus, nota: 8, año: 1 },
  { id: "2", nombre: "Álgebra y Geometría Analítica", codigo: "AGA", status: "aprobada" as SubjectStatus, nota: 7, año: 1 },
  { id: "3", nombre: "Física I", codigo: "FI1", status: "regular" as SubjectStatus, año: 1 },
  { id: "4", nombre: "Programación I", codigo: "PR1", status: "aprobada" as SubjectStatus, nota: 9, año: 1 },
  { id: "5", nombre: "Sistemas y Organizaciones", codigo: "SYO", status: "aprobada" as SubjectStatus, nota: 8, año: 1 },
  { id: "6", nombre: "Arquitectura de Computadoras", codigo: "ARQ", status: "aprobada" as SubjectStatus, nota: 7, año: 1 },
  { id: "7", nombre: "Química General", codigo: "QUI", status: "aprobada" as SubjectStatus, nota: 6, año: 1 },
  { id: "8", nombre: "Inglés I", codigo: "IN1", status: "aprobada" as SubjectStatus, nota: 10, año: 1 },
  // Año 2
  { id: "9", nombre: "Análisis Matemático II", codigo: "AM2", status: "regular" as SubjectStatus, año: 2 },
  { id: "10", nombre: "Física II", codigo: "FI2", status: "cursable" as SubjectStatus, año: 2 },
  { id: "11", nombre: "Programación II", codigo: "PR2", status: "regular" as SubjectStatus, año: 2 },
  { id: "12", nombre: "Análisis de Sistemas", codigo: "ADS", status: "cursable" as SubjectStatus, año: 2 },
  { id: "13", nombre: "Probabilidad y Estadística", codigo: "PYE", status: "cursable" as SubjectStatus, año: 2 },
  { id: "14", nombre: "Paradigmas de Programación", codigo: "PDP", status: "bloqueada" as SubjectStatus, año: 2 },
  { id: "15", nombre: "Sistemas Operativos", codigo: "SOP", status: "bloqueada" as SubjectStatus, año: 2 },
  { id: "16", nombre: "Inglés II", codigo: "IN2", status: "cursable" as SubjectStatus, año: 2 },
  // Año 3
  { id: "17", nombre: "Base de Datos", codigo: "BDD", status: "bloqueada" as SubjectStatus, año: 3 },
  { id: "18", nombre: "Diseño de Sistemas", codigo: "DDS", status: "bloqueada" as SubjectStatus, año: 3 },
  { id: "19", nombre: "Redes de Computadoras", codigo: "RED", status: "bloqueada" as SubjectStatus, año: 3 },
  { id: "20", nombre: "Matemática Discreta", codigo: "MAD", status: "bloqueada" as SubjectStatus, año: 3 },
  { id: "21", nombre: "Ingeniería de Software I", codigo: "IS1", status: "bloqueada" as SubjectStatus, año: 3 },
  { id: "22", nombre: "Sintaxis y Semántica de Lenguajes", codigo: "SSL", status: "bloqueada" as SubjectStatus, año: 3 },
  // Año 4
  { id: "23", nombre: "Ingeniería de Software II", codigo: "IS2", status: "bloqueada" as SubjectStatus, año: 4 },
  { id: "24", nombre: "Gestión de Datos", codigo: "GDD", status: "bloqueada" as SubjectStatus, año: 4 },
  { id: "25", nombre: "Simulación", codigo: "SIM", status: "bloqueada" as SubjectStatus, año: 4 },
  { id: "26", nombre: "Administración de Recursos", codigo: "ADR", status: "bloqueada" as SubjectStatus, año: 4 },
  { id: "27", nombre: "Inteligencia Artificial", codigo: "IAR", status: "bloqueada" as SubjectStatus, año: 4 },
  { id: "28", nombre: "Comunicaciones", codigo: "COM", status: "bloqueada" as SubjectStatus, año: 4 },
];

const statusFilters = [
  { value: "all", label: "Todas", color: "bg-secondary text-foreground" },
  { value: "aprobada", label: "Aprobadas", color: "bg-neon-gold/20 text-neon-gold" },
  { value: "regular", label: "Regulares", color: "bg-neon-cyan/20 text-neon-cyan" },
  { value: "cursable", label: "Cursables", color: "bg-neon-green/20 text-neon-green" },
  { value: "bloqueada", label: "Bloqueadas", color: "bg-muted text-muted-foreground" },
];

export default function CareerPlan() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubjects = allSubjects.filter((subject) => {
    const matchesYear = selectedYear === null || subject.año === selectedYear;
    const matchesStatus = selectedStatus === "all" || subject.status === selectedStatus;
    const matchesSearch = subject.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          subject.codigo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesStatus && matchesSearch;
  });

  const subjectsByYear = [1, 2, 3, 4].map((year) => ({
    year,
    subjects: filteredSubjects.filter((s) => s.año === year),
  }));

  const stats = {
    total: allSubjects.length,
    aprobadas: allSubjects.filter((s) => s.status === "aprobada").length,
    regulares: allSubjects.filter((s) => s.status === "regular").length,
    cursables: allSubjects.filter((s) => s.status === "cursable").length,
    bloqueadas: allSubjects.filter((s) => s.status === "bloqueada").length,
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold gradient-text">
            Plan de Carrera
          </h1>
          <p className="text-muted-foreground mt-1">
            Ingeniería en Sistemas de Información
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="card-gamer rounded-lg px-3 py-1.5 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-neon-gold" />
            <span className="text-sm font-medium">{stats.aprobadas}/{stats.total}</span>
            <span className="text-xs text-muted-foreground">materias</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="card-gamer rounded-xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-neon-gold">{stats.aprobadas}</p>
            <p className="text-xs text-muted-foreground">Aprobadas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-neon-cyan">{stats.regulares}</p>
            <p className="text-xs text-muted-foreground">Regulares</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-neon-green">{stats.cursables}</p>
            <p className="text-xs text-muted-foreground">Cursables</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-muted-foreground">{stats.bloqueadas}</p>
            <p className="text-xs text-muted-foreground">Bloqueadas</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar materia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1">
            <button
              onClick={() => setSelectedYear(null)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                selectedYear === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              Todos
            </button>
            {[1, 2, 3, 4].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  selectedYear === year
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                Año {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedStatus(filter.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all border",
              selectedStatus === filter.value
                ? cn(filter.color, "border-current")
                : "bg-secondary border-transparent hover:bg-secondary/80"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Subjects Grid by Year */}
      <div className="space-y-8">
        {subjectsByYear.map(({ year, subjects }) => (
          subjects.length > 0 && (
            <div key={year}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <span className="font-display font-bold text-background">{year}</span>
                </div>
                <div>
                  <h2 className="font-display font-semibold text-lg">Año {year}</h2>
                  <p className="text-xs text-muted-foreground">
                    {subjects.filter(s => s.status === "aprobada").length}/{subjects.length} completadas
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    nombre={subject.nombre}
                    codigo={subject.codigo}
                    status={subject.status}
                    nota={subject.nota}
                    año={subject.año}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No se encontraron materias con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
}
