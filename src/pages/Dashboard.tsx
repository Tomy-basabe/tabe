import { BookOpen, CheckCircle2, Clock, GraduationCap, Target, Zap } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { SubjectCard, SubjectStatus } from "@/components/dashboard/SubjectCard";
import { UpcomingExams } from "@/components/dashboard/UpcomingExams";
import { StudyStreak } from "@/components/dashboard/StudyStreak";

// Mock data - será reemplazado por datos de Supabase
const mockSubjects = [
  { id: "1", nombre: "Análisis Matemático I", codigo: "AM1", status: "aprobada" as SubjectStatus, nota: 8, año: 1 },
  { id: "2", nombre: "Álgebra y Geometría Analítica", codigo: "AGA", status: "aprobada" as SubjectStatus, nota: 7, año: 1 },
  { id: "3", nombre: "Física I", codigo: "FI1", status: "regular" as SubjectStatus, año: 1 },
  { id: "4", nombre: "Programación I", codigo: "PR1", status: "cursable" as SubjectStatus, año: 1 },
  { id: "5", nombre: "Sistemas y Organizaciones", codigo: "SYO", status: "cursable" as SubjectStatus, año: 1 },
  { id: "6", nombre: "Análisis Matemático II", codigo: "AM2", status: "bloqueada" as SubjectStatus, año: 2 },
];

const mockExams = [
  { id: "1", subject: "Física I", type: "P2" as const, date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), daysLeft: 3 },
  { id: "2", subject: "Programación I", type: "P1" as const, date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), daysLeft: 7 },
  { id: "3", subject: "Análisis Matemático I", type: "Final" as const, date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), daysLeft: 14 },
];

const mockWeekData = [
  { day: "L", studied: true, minutes: 90 },
  { day: "M", studied: true, minutes: 60 },
  { day: "X", studied: true, minutes: 120 },
  { day: "J", studied: false, minutes: 0 },
  { day: "V", studied: true, minutes: 45 },
  { day: "S", studied: true, minutes: 180 },
  { day: "D", studied: false, minutes: 0 },
];

export default function Dashboard() {
  const totalMaterias = 45;
  const aprobadas = 12;
  const regulares = 8;
  const progreso = Math.round((aprobadas / totalMaterias) * 100);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold gradient-text">
            Dashboard Académico
          </h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido de vuelta, Tomás. Tu progreso te espera.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card-gamer rounded-xl px-4 py-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon-gold" />
            <span className="text-sm font-medium">1,250 XP</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Materias Aprobadas"
          value={aprobadas}
          subtitle={`de ${totalMaterias} totales`}
          icon={CheckCircle2}
          variant="gold"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Regularidades"
          value={regulares}
          subtitle="activas"
          icon={Clock}
          variant="cyan"
        />
        <StatsCard
          title="Horas de Estudio"
          value="32h"
          subtitle="este mes"
          icon={BookOpen}
          variant="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Promedio General"
          value="7.5"
          subtitle="con aplazos"
          icon={Target}
          variant="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <div className="lg:col-span-2 card-gamer rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-lg">Progreso de la Carrera</h2>
            <GraduationCap className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Progress Ring */}
            <ProgressRing progress={progreso} size={160} strokeWidth={12}>
              <div className="text-center">
                <p className="text-3xl font-display font-bold gradient-text">{progreso}%</p>
                <p className="text-xs text-muted-foreground">Completado</p>
              </div>
            </ProgressRing>

            {/* Progress Details */}
            <div className="flex-1 w-full space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Año 1</span>
                  <span className="font-medium text-neon-gold">100%</span>
                </div>
                <div className="progress-gamer h-2">
                  <div className="progress-gamer-bar" style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Año 2</span>
                  <span className="font-medium text-neon-cyan">60%</span>
                </div>
                <div className="progress-gamer h-2">
                  <div className="progress-gamer-bar" style={{ width: "60%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Año 3</span>
                  <span className="font-medium text-neon-green">20%</span>
                </div>
                <div className="progress-gamer h-2">
                  <div className="progress-gamer-bar" style={{ width: "20%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Año 4</span>
                  <span className="font-medium text-muted-foreground">0%</span>
                </div>
                <div className="progress-gamer h-2">
                  <div className="progress-gamer-bar" style={{ width: "0%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Study Streak */}
        <StudyStreak
          currentStreak={5}
          bestStreak={14}
          weekData={mockWeekData}
        />
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Subjects */}
        <div className="lg:col-span-2 card-gamer rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Materias Recientes</h2>
            <a href="/carrera" className="text-sm text-primary hover:underline">Ver todo</a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mockSubjects.slice(0, 6).map((subject) => (
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

        {/* Upcoming Exams */}
        <UpcomingExams exams={mockExams} />
      </div>
    </div>
  );
}
