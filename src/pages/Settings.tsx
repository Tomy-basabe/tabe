import { User, Bell, Calendar, Link, LogOut, Moon, Sun, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSections = [
  {
    title: "Cuenta",
    items: [
      { icon: User, label: "Perfil", description: "Nombre, email y foto de perfil" },
      { icon: Bell, label: "Notificaciones", description: "Alertas de exámenes y recordatorios" },
    ],
  },
  {
    title: "Integraciones",
    items: [
      { icon: Calendar, label: "Google Calendar", description: "Sincronizar eventos", connected: true },
      { icon: Link, label: "Otras integraciones", description: "Conectar más servicios" },
    ],
  },
];

export default function Settings() {
  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold gradient-text">
          Configuración
        </h1>
        <p className="text-muted-foreground mt-1">
          Administra tu cuenta y preferencias
        </p>
      </div>

      {/* Profile Card */}
      <div className="card-gamer rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-gold to-neon-cyan flex items-center justify-center text-background font-display font-bold text-xl">
            TL
          </div>
          <div className="flex-1">
            <h2 className="font-display font-semibold text-lg">Tomás López</h2>
            <p className="text-muted-foreground text-sm">tomas.lopez@email.com</p>
            <p className="text-xs text-neon-gold mt-1">Nivel 12 • 1,250 XP</p>
          </div>
          <button className="px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors">
            Editar
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <div key={section.title} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground px-1">
            {section.title}
          </h3>
          <div className="card-gamer rounded-xl overflow-hidden divide-y divide-border">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  {"connected" in item && item.connected ? (
                    <span className="text-xs text-neon-green bg-neon-green/20 px-2 py-1 rounded-full">
                      Conectado
                    </span>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Appearance */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground px-1">Apariencia</h3>
        <div className="card-gamer rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Moon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">Tema oscuro</p>
                <p className="text-xs text-muted-foreground">Activo por defecto</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-primary-foreground rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Pomodoro Settings */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground px-1">Pomodoro</h3>
        <div className="card-gamer rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Tiempo de trabajo</span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80">-</button>
              <span className="font-display font-bold w-12 text-center">25</span>
              <button className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80">+</button>
              <span className="text-sm text-muted-foreground">min</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Descanso corto</span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80">-</button>
              <span className="font-display font-bold w-12 text-center">5</span>
              <button className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80">+</button>
              <span className="text-sm text-muted-foreground">min</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Descanso largo</span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80">-</button>
              <span className="font-display font-bold w-12 text-center">15</span>
              <button className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80">+</button>
              <span className="text-sm text-muted-foreground">min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button className="w-full card-gamer rounded-xl p-4 flex items-center gap-4 text-neon-red hover:bg-neon-red/10 transition-colors">
        <div className="w-10 h-10 rounded-xl bg-neon-red/20 flex items-center justify-center">
          <LogOut className="w-5 h-5 text-neon-red" />
        </div>
        <span className="font-medium">Cerrar sesión</span>
      </button>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground">
        T.A.B.E. v1.0.0 • Sistema TOMÁS A BASE DE EXPERIENCIAS
      </p>
    </div>
  );
}
