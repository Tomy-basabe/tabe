import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import CareerPlan from "@/pages/CareerPlan";
import Calendar from "@/pages/Calendar";
import Pomodoro from "@/pages/Pomodoro";
import Metrics from "@/pages/Metrics";
import AIAssistant from "@/pages/AIAssistant";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/carrera" element={<CareerPlan />} />
            <Route path="/calendario" element={<Calendar />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/metricas" element={<Metrics />} />
            <Route path="/asistente" element={<AIAssistant />} />
            <Route path="/configuracion" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
