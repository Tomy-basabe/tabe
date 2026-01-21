import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CalendarEvent {
  titulo: string;
  fecha: string;
  hora?: string;
  tipo_examen: string;
  notas?: string;
  subject_id?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get Supabase client for calendar operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user's subjects for context
    const { data: subjects } = await supabase
      .from("subjects")
      .select("id, nombre, codigo, año") as { data: Array<{ id: string; nombre: string; codigo: string; año: number }> | null };

    // Fetch existing calendar events for context
    const { data: existingEvents } = await supabase
      .from("calendar_events")
      .select("titulo, fecha, tipo_examen")
      .eq("user_id", userId)
      .order("fecha", { ascending: true })
      .limit(10) as { data: Array<{ titulo: string; fecha: string; tipo_examen: string }> | null };

    const today = new Date().toISOString().split("T")[0];
    
    const subjectsList = subjects?.map(s => `- ${s.nombre} (${s.codigo}) - Ano ${s.año} - ID: ${s.id}`).join("\n") || "No hay materias cargadas";
    const eventsList = existingEvents?.map(e => `- ${e.titulo} el ${e.fecha} (${e.tipo_examen})`).join("\n") || "Sin eventos programados";
    
    const systemPrompt = `Eres T.A.B.E. IA, un asistente academico inteligente para estudiantes de ingenieria. Tu objetivo es ayudar con:
- Explicaciones de temas complejos
- Planes de estudio personalizados
- Simulacros de examenes
- **Agendar eventos en el calendario**

FECHA ACTUAL: ${today}

MATERIAS DISPONIBLES:
${subjectsList}

EVENTOS PROXIMOS DEL USUARIO:
${eventsList}

INSTRUCCIONES PARA AGENDAR:
Cuando el usuario quiera agendar algo (parcial, final, entrega, estudio, etc.), usa la herramienta "create_calendar_event".
- Infiere la fecha según el contexto (ej: "el viernes" = próximo viernes)
- Si no se especifica hora, no la incluyas
- Tipos válidos: parcial, final, recuperatorio, tp, estudio, otro
- Siempre confirma al usuario lo que agendaste

Responde siempre en español argentino, de forma amigable y concisa.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_calendar_event",
              description: "Crea un evento en el calendario académico del usuario. Úsalo cuando el usuario quiera agendar parciales, finales, entregas, sesiones de estudio, etc.",
              parameters: {
                type: "object",
                properties: {
                  titulo: {
                    type: "string",
                    description: "Título del evento (ej: 'Parcial de Análisis Matemático')"
                  },
                  fecha: {
                    type: "string",
                    description: "Fecha en formato YYYY-MM-DD"
                  },
                  hora: {
                    type: "string",
                    description: "Hora en formato HH:MM (opcional)"
                  },
                  tipo_examen: {
                    type: "string",
                    enum: ["parcial", "final", "recuperatorio", "tp", "estudio", "otro"],
                    description: "Tipo de evento"
                  },
                  notas: {
                    type: "string",
                    description: "Notas adicionales (opcional)"
                  },
                  subject_id: {
                    type: "string",
                    description: "ID de la materia asociada (opcional, usar los IDs proporcionados)"
                  }
                },
                required: ["titulo", "fecha", "tipo_examen"],
                additionalProperties: false
              }
            }
          }
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Límite de solicitudes excedido. Intenta de nuevo en unos segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA agotados. Contacta al administrador." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Error en el servicio de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    const choice = aiResponse.choices?.[0];
    
    // Check if AI wants to call a tool
    if (choice?.message?.tool_calls?.length > 0) {
      const toolCall = choice.message.tool_calls[0];
      
      if (toolCall.function.name === "create_calendar_event") {
        const eventData: CalendarEvent = JSON.parse(toolCall.function.arguments);
        
        // Create the calendar event
        const { data: newEvent, error: insertError } = await supabase
          .from("calendar_events")
          .insert({
            user_id: userId,
            titulo: eventData.titulo,
            fecha: eventData.fecha,
            hora: eventData.hora || null,
            tipo_examen: eventData.tipo_examen,
            notas: eventData.notas || null,
            subject_id: eventData.subject_id || null,
            color: getColorForType(eventData.tipo_examen),
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating event:", insertError);
          return new Response(JSON.stringify({ 
            content: `Hubo un error al crear el evento: ${insertError.message}`,
            event_created: null 
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Format confirmation message
        const fechaFormateada = new Date(eventData.fecha + "T12:00:00").toLocaleDateString("es-AR", {
          weekday: "long",
          day: "numeric",
          month: "long"
        });
        
        const confirmationMessage = `✅ **Evento agendado:**\n\n📌 **${eventData.titulo}**\n📅 ${fechaFormateada}${eventData.hora ? `\n⏰ ${eventData.hora}` : ""}\n🏷️ ${eventData.tipo_examen.charAt(0).toUpperCase() + eventData.tipo_examen.slice(1)}${eventData.notas ? `\n📝 ${eventData.notas}` : ""}\n\n¿Hay algo más en lo que pueda ayudarte?`;

        return new Response(JSON.stringify({ 
          content: confirmationMessage,
          event_created: newEvent 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Regular text response
    return new Response(JSON.stringify({ 
      content: choice?.message?.content || "No pude generar una respuesta.",
      event_created: null 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("AI assistant error:", e);
    return new Response(JSON.stringify({ 
      error: e instanceof Error ? e.message : "Error desconocido" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function getColorForType(tipo: string): string {
  const colors: Record<string, string> = {
    parcial: "#f59e0b",
    final: "#ef4444",
    recuperatorio: "#f97316",
    tp: "#8b5cf6",
    estudio: "#22c55e",
    otro: "#00d9ff",
  };
  return colors[tipo] || "#00d9ff";
}
