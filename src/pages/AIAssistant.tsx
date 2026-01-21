import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, BookOpen, FileQuestion, Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickActions = [
  { id: "explain", label: "Explicar tema", icon: BookOpen, prompt: "Explícame el concepto de " },
  { id: "quiz", label: "Simulacro de final", icon: FileQuestion, prompt: "Hazme un simulacro de final de " },
  { id: "plan", label: "Plan de estudio", icon: Calendar, prompt: "Genera un plan de estudio para " },
  { id: "schedule", label: "Agendar evento", icon: Calendar, prompt: "Agendame " },
  { id: "summary", label: "Resumen", icon: Sparkles, prompt: "Resume los puntos clave de " },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "¡Hola! 👋 Soy **T.A.B.E. IA**, tu asistente académico. Puedo ayudarte con:\n\n• **Explicaciones** de temas complejos\n• **Simulacros** de exámenes finales\n• **Planes de estudio** personalizados\n• **Agendar eventos** en tu calendario 📅\n\nPor ejemplo, podés decirme: *\"Agendame el parcial de Análisis para el viernes a las 14:00\"*\n\n¿En qué puedo ayudarte hoy?",
    timestamp: new Date(),
  },
];

export default function AIAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare conversation history for AI
      const conversationHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: { 
          messages: conversationHistory.slice(1), // Skip initial greeting
          userId: user.id 
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Show toast if event was created
      if (data.event_created) {
        toast.success("Evento agregado al calendario", {
          action: {
            label: "Ver calendario",
            onClick: () => window.location.href = "/calendario",
          },
        });
      }

    } catch (error) {
      console.error("AI error:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      
      toast.error(errorMessage);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Lo siento, hubo un error al procesar tu mensaje. ${errorMessage}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt);
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        // Bold text
        let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic text
        processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Bullet points
        if (processed.startsWith("• ")) {
          processed = `<span class="flex gap-2"><span>•</span><span>${processed.slice(2)}</span></span>`;
        }
        return <div key={i} dangerouslySetInnerHTML={{ __html: processed }} />;
      });
  };

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen flex flex-col p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold gradient-text">
            Asistente IA
          </h1>
          <p className="text-muted-foreground mt-1">
            Tu tutor académico personal impulsado por IA
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-neon-green/20 text-neon-green rounded-full text-xs font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action.prompt)}
              className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors"
            >
              <Icon className="w-4 h-4 text-primary" />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* Chat Container */}
      <div className="flex-1 card-gamer rounded-xl flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-background" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary rounded-bl-sm"
                )}
              >
                <div className="text-sm space-y-1">
                  {renderContent(message.content)}
                </div>
                <p className="text-xs opacity-50 mt-2">
                  {message.timestamp.toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-neon-gold/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-neon-gold" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                <Bot className="w-5 h-5 text-background" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Pensando...
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe tu pregunta o pedido..."
              className="flex-1 px-4 py-3 bg-secondary rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                "px-4 py-3 rounded-xl transition-all flex items-center gap-2",
                inputValue.trim() && !isLoading
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Podés pedirme que agende eventos en tu calendario. Ej: "Agendame el final de Física para el 15 de febrero"
          </p>
        </div>
      </div>
    </div>
  );
}
