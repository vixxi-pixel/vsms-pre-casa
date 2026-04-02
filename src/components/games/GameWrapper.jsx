import { motion } from "framer-motion";

export default function GameWrapper({ title, emoji, gradient, onBack, children }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} flex flex-col`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <button
          onClick={onBack}
          className="bg-white/80 backdrop-blur-sm text-foreground font-black text-lg px-5 py-2 rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-black text-white drop-shadow-md flex items-center gap-2">
          <span>{emoji}</span> {title}
        </h2>
        <div className="w-24" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        {children}
      </div>
    </div>
  );
}