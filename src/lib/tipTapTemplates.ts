import { JSONContent } from "@tiptap/core";

export interface TipTapTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  content: JSONContent;
}

export const tipTapTemplates: TipTapTemplate[] = [
  {
    id: "blank",
    name: "En blanco",
    emoji: "📝",
    description: "Comienza desde cero",
    content: {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
  },
  {
    id: "class-summary",
    name: "Resumen de Clase",
    emoji: "📚",
    description: "Perfecto para apuntes de clase",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Resumen de Clase" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Fecha: ", marks: [{ type: "bold" }] },
            { type: "text", text: new Date().toLocaleDateString("es-AR") },
          ],
        },
        { type: "horizontalRule" },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "📌 Temas Principales" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Tema 1" }] }],
            },
            {
              type: "listItem",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Tema 2" }] }],
            },
            {
              type: "listItem",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Tema 3" }] }],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "📝 Notas" }],
        },
        { type: "paragraph" },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "✅ Tareas Pendientes" }],
        },
        {
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [{ type: "paragraph", content: [{ type: "text", text: "Repasar conceptos" }] }],
            },
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [{ type: "paragraph", content: [{ type: "text", text: "Hacer ejercicios" }] }],
            },
          ],
        },
      ],
    },
  },
  {
    id: "exam-prep",
    name: "Preparación de Examen",
    emoji: "📖",
    description: "Organiza tu estudio para exámenes",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "📖 Preparación de Examen" }],
        },
        {
          type: "callout",
          attrs: { type: "info" },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Fecha del examen: [Completar]" }],
            },
          ],
        },
        { type: "horizontalRule" },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "📋 Temas a Estudiar" }],
        },
        {
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [{ type: "paragraph", content: [{ type: "text", text: "Unidad 1" }] }],
            },
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [{ type: "paragraph", content: [{ type: "text", text: "Unidad 2" }] }],
            },
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [{ type: "paragraph", content: [{ type: "text", text: "Unidad 3" }] }],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "🔑 Conceptos Clave" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Concepto 1: definición" }] }],
            },
            {
              type: "listItem",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Concepto 2: definición" }] }],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "❓ Preguntas Frecuentes" }],
        },
        { type: "paragraph" },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "💡 Tips de Estudio" }],
        },
        {
          type: "callout",
          attrs: { type: "tip" },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Usa técnica Pomodoro: 25 min estudio, 5 min descanso" }],
            },
          ],
        },
      ],
    },
  },
  {
    id: "lab-notes",
    name: "Notas de Laboratorio",
    emoji: "🔬",
    description: "Para prácticas y experimentos",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "🔬 Práctica de Laboratorio" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Fecha: ", marks: [{ type: "bold" }] },
            { type: "text", text: new Date().toLocaleDateString("es-AR") },
          ],
        },
        { type: "horizontalRule" },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "🎯 Objetivo" }],
        },
        { type: "paragraph" },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "🧪 Materiales" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Material 1" }] }],
            },
            {
              type: "listItem",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Material 2" }] }],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "📝 Procedimiento" }],
        },
        {
          type: "orderedList",
          content: [
            {
              type: "listItem",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Paso 1" }] }],
            },
            {
              type: "listItem",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Paso 2" }] }],
            },
            {
              type: "listItem",
              content: [{ type: "paragraph", content: [{ type: "text", text: "Paso 3" }] }],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "📊 Resultados" }],
        },
        { type: "paragraph" },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "💬 Conclusiones" }],
        },
        { type: "paragraph" },
      ],
    },
  },
  {
    id: "cornell",
    name: "Método Cornell",
    emoji: "🎓",
    description: "Sistema de notas efectivo",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "🎓 Notas - Método Cornell" }],
        },
        {
          type: "callout",
          attrs: { type: "info" },
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Tema: ", marks: [{ type: "bold" }] },
                { type: "text", text: "[Completar]" },
              ],
            },
          ],
        },
        { type: "horizontalRule" },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "❓ Preguntas Clave" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [{ type: "paragraph", content: [{ type: "text", text: "¿Qué es...?" }] }],
            },
            {
              type: "listItem",
              content: [{ type: "paragraph", content: [{ type: "text", text: "¿Cómo funciona...?" }] }],
            },
            {
              type: "listItem",
              content: [{ type: "paragraph", content: [{ type: "text", text: "¿Por qué es importante...?" }] }],
            },
          ],
        },
        { type: "horizontalRule" },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "📝 Notas Principales" }],
        },
        { type: "paragraph" },
        { type: "horizontalRule" },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "📌 Resumen" }],
        },
        {
          type: "callout",
          attrs: { type: "success" },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Escribe aquí un resumen de 2-3 oraciones de los puntos más importantes." }],
            },
          ],
        },
      ],
    },
  },
];
