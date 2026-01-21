import { OutputData } from "@editorjs/editorjs";

export interface NotionTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  content: OutputData;
}

export const notionTemplates: NotionTemplate[] = [
  {
    id: "blank",
    name: "En blanco",
    emoji: "📄",
    description: "Comienza desde cero",
    content: {
      time: Date.now(),
      blocks: [],
      version: "2.28.0"
    }
  },
  {
    id: "class-summary",
    name: "Resumen de Clase",
    emoji: "📚",
    description: "Estructura para resumir una clase",
    content: {
      time: Date.now(),
      blocks: [
        {
          id: "header1",
          type: "header",
          data: { text: "📅 Fecha y Tema", level: 2 }
        },
        {
          id: "p1",
          type: "paragraph",
          data: { text: "Escribe el tema de la clase aquí..." }
        },
        {
          id: "header2",
          type: "header",
          data: { text: "📝 Conceptos Clave", level: 2 }
        },
        {
          id: "list1",
          type: "list",
          data: {
            style: "unordered",
            items: [
              "Concepto 1",
              "Concepto 2",
              "Concepto 3"
            ]
          }
        },
        {
          id: "header3",
          type: "header",
          data: { text: "💡 Ideas Principales", level: 2 }
        },
        {
          id: "p2",
          type: "paragraph",
          data: { text: "Desarrolla las ideas principales de la clase..." }
        },
        {
          id: "header4",
          type: "header",
          data: { text: "📌 Ejemplos", level: 2 }
        },
        {
          id: "p3",
          type: "paragraph",
          data: { text: "Anota los ejemplos dados en clase..." }
        },
        {
          id: "header5",
          type: "header",
          data: { text: "❓ Dudas y Preguntas", level: 2 }
        },
        {
          id: "checklist1",
          type: "checklist",
          data: {
            items: [
              { text: "Pregunta para el profesor", checked: false },
              { text: "Tema para investigar", checked: false }
            ]
          }
        }
      ],
      version: "2.28.0"
    }
  },
  {
    id: "exam-prep",
    name: "Preparación de Examen",
    emoji: "📋",
    description: "Organiza tu estudio para un examen",
    content: {
      time: Date.now(),
      blocks: [
        {
          id: "header1",
          type: "header",
          data: { text: "🎯 Información del Examen", level: 2 }
        },
        {
          id: "table1",
          type: "table",
          data: {
            withHeadings: false,
            content: [
              ["Fecha del examen", ""],
              ["Temas incluidos", ""],
              ["Tipo de examen", ""],
              ["Materiales permitidos", ""]
            ]
          }
        },
        {
          id: "header2",
          type: "header",
          data: { text: "📚 Temas a Estudiar", level: 2 }
        },
        {
          id: "checklist1",
          type: "checklist",
          data: {
            items: [
              { text: "Tema 1 - [Descripción]", checked: false },
              { text: "Tema 2 - [Descripción]", checked: false },
              { text: "Tema 3 - [Descripción]", checked: false },
              { text: "Tema 4 - [Descripción]", checked: false }
            ]
          }
        },
        {
          id: "header3",
          type: "header",
          data: { text: "📖 Fórmulas / Definiciones Clave", level: 2 }
        },
        {
          id: "p1",
          type: "paragraph",
          data: { text: "Lista las fórmulas o definiciones importantes..." }
        },
        {
          id: "header4",
          type: "header",
          data: { text: "🔄 Ejercicios de Práctica", level: 2 }
        },
        {
          id: "list1",
          type: "list",
          data: {
            style: "ordered",
            items: [
              "Ejercicio tipo 1",
              "Ejercicio tipo 2",
              "Ejercicio tipo 3"
            ]
          }
        },
        {
          id: "header5",
          type: "header",
          data: { text: "⚠️ Puntos Difíciles", level: 2 }
        },
        {
          id: "p2",
          type: "paragraph",
          data: { text: "Anota los conceptos que te cuestan más..." }
        }
      ],
      version: "2.28.0"
    }
  },
  {
    id: "lab-notes",
    name: "Notas de Laboratorio",
    emoji: "🔬",
    description: "Documenta experimentos y prácticas",
    content: {
      time: Date.now(),
      blocks: [
        {
          id: "header1",
          type: "header",
          data: { text: "🧪 Práctica de Laboratorio", level: 1 }
        },
        {
          id: "header2",
          type: "header",
          data: { text: "📋 Información General", level: 2 }
        },
        {
          id: "table1",
          type: "table",
          data: {
            withHeadings: false,
            content: [
              ["Fecha", ""],
              ["Práctica N°", ""],
              ["Grupo", ""]
            ]
          }
        },
        {
          id: "header3",
          type: "header",
          data: { text: "🎯 Objetivo", level: 2 }
        },
        {
          id: "p1",
          type: "paragraph",
          data: { text: "Describe el objetivo de la práctica..." }
        },
        {
          id: "header4",
          type: "header",
          data: { text: "🔧 Materiales y Equipos", level: 2 }
        },
        {
          id: "list1",
          type: "list",
          data: {
            style: "unordered",
            items: [
              "Material 1",
              "Material 2",
              "Equipo 1"
            ]
          }
        },
        {
          id: "header5",
          type: "header",
          data: { text: "📝 Procedimiento", level: 2 }
        },
        {
          id: "list2",
          type: "list",
          data: {
            style: "ordered",
            items: [
              "Paso 1",
              "Paso 2",
              "Paso 3"
            ]
          }
        },
        {
          id: "header6",
          type: "header",
          data: { text: "📊 Resultados y Observaciones", level: 2 }
        },
        {
          id: "p2",
          type: "paragraph",
          data: { text: "Registra los resultados obtenidos..." }
        },
        {
          id: "header7",
          type: "header",
          data: { text: "💡 Conclusiones", level: 2 }
        },
        {
          id: "p3",
          type: "paragraph",
          data: { text: "Escribe las conclusiones de la práctica..." }
        }
      ],
      version: "2.28.0"
    }
  },
  {
    id: "cornell",
    name: "Método Cornell",
    emoji: "🎓",
    description: "Sistema de toma de apuntes Cornell",
    content: {
      time: Date.now(),
      blocks: [
        {
          id: "header1",
          type: "header",
          data: { text: "📚 Tema de la Clase", level: 1 }
        },
        {
          id: "delimiter1",
          type: "delimiter",
          data: {}
        },
        {
          id: "header2",
          type: "header",
          data: { text: "❓ Preguntas Clave", level: 2 }
        },
        {
          id: "p1",
          type: "paragraph",
          data: { text: "• ¿Qué es...?" }
        },
        {
          id: "p2",
          type: "paragraph",
          data: { text: "• ¿Cómo funciona...?" }
        },
        {
          id: "p3",
          type: "paragraph",
          data: { text: "• ¿Por qué es importante...?" }
        },
        {
          id: "delimiter2",
          type: "delimiter",
          data: {}
        },
        {
          id: "header3",
          type: "header",
          data: { text: "📝 Notas de Clase", level: 2 }
        },
        {
          id: "p4",
          type: "paragraph",
          data: { text: "Escribe aquí los apuntes principales de la clase. Incluye definiciones, ejemplos, diagramas y cualquier información relevante que el profesor mencione." }
        },
        {
          id: "list1",
          type: "list",
          data: {
            style: "unordered",
            items: [
              "Punto importante 1",
              "Punto importante 2",
              "Punto importante 3"
            ]
          }
        },
        {
          id: "delimiter3",
          type: "delimiter",
          data: {}
        },
        {
          id: "header4",
          type: "header",
          data: { text: "📌 Resumen", level: 2 }
        },
        {
          id: "p5",
          type: "paragraph",
          data: { text: "Resume los puntos principales en 2-3 oraciones. Este resumen te ayudará a repasar rápidamente el contenido." }
        }
      ],
      version: "2.28.0"
    }
  }
];
