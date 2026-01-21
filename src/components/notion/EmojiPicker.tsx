import { useState } from "react";
import { cn } from "@/lib/utils";

const emojiCategories = {
  frecuentes: ["📝", "📚", "📖", "✏️", "📐", "🎯", "💡", "🔬", "💻", "🧮"],
  estudio: ["📚", "📖", "📕", "📗", "📘", "📙", "📓", "📒", "📃", "📄"],
  ciencia: ["🔬", "🧪", "🧫", "🧬", "⚗️", "🔭", "🌡️", "⚛️", "🧲", "💎"],
  tecnología: ["💻", "🖥️", "📱", "⌨️", "🖱️", "💾", "📀", "🔌", "🔋", "📡"],
  matemáticas: ["🧮", "📐", "📏", "➕", "➖", "✖️", "➗", "🔢", "📊", "📈"],
  objetos: ["✏️", "🖊️", "🖋️", "📌", "📍", "🔎", "🔍", "🗂️", "📁", "📂"],
  símbolos: ["⭐", "🌟", "✨", "💫", "🎯", "🎪", "🎨", "🎭", "🎬", "🎤"],
  naturaleza: ["🌱", "🌿", "🍀", "🌺", "🌻", "🌸", "🌷", "🌹", "🍃", "🌾"],
};

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof emojiCategories>("frecuentes");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-4xl hover:scale-110 transition-transform"
      >
        {value}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full left-0 mt-2 z-50 bg-card border border-border rounded-xl shadow-xl p-3 w-72">
            {/* Category tabs */}
            <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
              {Object.keys(emojiCategories).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as keyof typeof emojiCategories)}
                  className={cn(
                    "px-2 py-1 text-xs rounded-lg whitespace-nowrap transition-colors",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  )}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Emoji grid */}
            <div className="grid grid-cols-8 gap-1">
              {emojiCategories[selectedCategory].map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onChange(emoji);
                    setIsOpen(false);
                  }}
                  className="text-xl p-1 rounded hover:bg-secondary transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
