import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameWrapper from "./GameWrapper";
import { CorrectBanner } from "./CorrectWrong";

// Eggs hidden at specific positions on the scene (percentage-based)
const SCENES = [
  {
    id: 1,
    label: "The Garden 🌸",
    bg: "from-green-300 via-lime-200 to-sky-200",
    decorations: [
      { emoji: "🌳", style: { left: "5%", bottom: "10%", fontSize: "80px" } },
      { emoji: "🌳", style: { right: "8%", bottom: "12%", fontSize: "64px" } },
      { emoji: "🌷", style: { left: "20%", bottom: "8%", fontSize: "40px" } },
      { emoji: "🌻", style: { right: "25%", bottom: "9%", fontSize: "44px" } },
      { emoji: "🌿", style: { left: "38%", bottom: "7%", fontSize: "36px" } },
      { emoji: "🐰", style: { left: "50%", bottom: "10%", fontSize: "48px" } },
      { emoji: "🌼", style: { left: "70%", bottom: "8%", fontSize: "36px" } },
      { emoji: "☁️", style: { left: "15%", top: "10%", fontSize: "50px" } },
      { emoji: "☁️", style: { right: "20%", top: "8%", fontSize: "40px" } },
      { emoji: "🌞", style: { right: "5%", top: "5%", fontSize: "52px" } },
      { emoji: "🐦", style: { left: "40%", top: "15%", fontSize: "32px" } },
    ],
    eggs: [
      { id: "e1", left: "12%", bottom: "16%", hint: "near the big tree 🌳" },
      { id: "e2", right: "15%", bottom: "20%", hint: "by the right tree 🌳" },
      { id: "e3", left: "45%", bottom: "14%", hint: "in the grass 🌿" },
      { id: "e4", left: "68%", bottom: "17%", hint: "near the flower 🌼" },
      { id: "e5", left: "28%", bottom: "13%", hint: "by the tulip 🌷" },
    ],
  },
  {
    id: 2,
    label: "The Farm 🐔",
    bg: "from-yellow-200 via-orange-100 to-lime-200",
    decorations: [
      { emoji: "🏠", style: { left: "5%", bottom: "12%", fontSize: "80px" } },
      { emoji: "🐄", style: { right: "10%", bottom: "10%", fontSize: "64px" } },
      { emoji: "🐔", style: { left: "30%", bottom: "9%", fontSize: "44px" } },
      { emoji: "🌾", style: { left: "55%", bottom: "8%", fontSize: "48px" } },
      { emoji: "🌾", style: { right: "28%", bottom: "8%", fontSize: "44px" } },
      { emoji: "🐑", style: { left: "70%", bottom: "11%", fontSize: "48px" } },
      { emoji: "🌻", style: { left: "18%", bottom: "8%", fontSize: "40px" } },
      { emoji: "☁️", style: { left: "25%", top: "8%", fontSize: "50px" } },
      { emoji: "☁️", style: { right: "15%", top: "6%", fontSize: "44px" } },
      { emoji: "🌞", style: { left: "8%", top: "5%", fontSize: "52px" } },
    ],
    eggs: [
      { id: "e1", left: "10%", bottom: "18%", hint: "near the house 🏠" },
      { id: "e2", left: "40%", bottom: "15%", hint: "by the chicken 🐔" },
      { id: "e3", left: "62%", bottom: "14%", hint: "in the wheat 🌾" },
      { id: "e4", right: "18%", bottom: "18%", hint: "near the cow 🐄" },
      { id: "e5", left: "78%", bottom: "17%", hint: "by the sheep 🐑" },
    ],
  },
  {
    id: 3,
    label: "The Forest 🌲",
    bg: "from-emerald-300 via-green-200 to-teal-200",
    decorations: [
      { emoji: "🌲", style: { left: "2%", bottom: "10%", fontSize: "90px" } },
      { emoji: "🌲", style: { left: "20%", bottom: "10%", fontSize: "80px" } },
      { emoji: "🌲", style: { right: "5%", bottom: "10%", fontSize: "85px" } },
      { emoji: "🌲", style: { right: "22%", bottom: "10%", fontSize: "70px" } },
      { emoji: "🍄", style: { left: "35%", bottom: "9%", fontSize: "40px" } },
      { emoji: "🦔", style: { left: "50%", bottom: "9%", fontSize: "44px" } },
      { emoji: "🦋", style: { left: "60%", top: "25%", fontSize: "36px" } },
      { emoji: "🐿️", style: { right: "38%", bottom: "10%", fontSize: "40px" } },
      { emoji: "🌙", style: { right: "8%", top: "5%", fontSize: "48px" } },
      { emoji: "⭐", style: { left: "42%", top: "7%", fontSize: "36px" } },
    ],
    eggs: [
      { id: "e1", left: "8%", bottom: "20%", hint: "by the tall tree 🌲" },
      { id: "e2", left: "27%", bottom: "18%", hint: "near the second tree 🌲" },
      { id: "e3", left: "42%", bottom: "15%", hint: "by the mushroom 🍄" },
      { id: "e4", right: "30%", bottom: "18%", hint: "near the squirrel 🐿️" },
      { id: "e5", right: "12%", bottom: "20%", hint: "by the right tree 🌲" },
    ],
  },
];

const EGG_COLORS = [
  { bg: "#f87171", pattern: "🌸" },
  { bg: "#60a5fa", pattern: "⭐" },
  { bg: "#facc15", pattern: "🌼" },
  { bg: "#4ade80", pattern: "🍀" },
  { bg: "#c084fc", pattern: "🦋" },
];

export default function EasterEggHunt({ onBack }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [found, setFound] = useState(new Set());
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [totalFound, setTotalFound] = useState(0);

  const scene = SCENES[sceneIdx];
  const allFound = found.size === scene.eggs.length;

  const handleEggTap = (eggId) => {
    if (found.has(eggId)) return;
    setFound(prev => new Set([...prev, eggId]));
    setTotalFound(t => t + 1);
    setFeedback("correct");
    setTimeout(() => setFeedback(null), 1200);
  };

  const handleNextScene = () => {
    setSceneIdx(i => (i + 1) % SCENES.length);
    setFound(new Set());
    setShowHint(false);
    setFeedback(null);
  };

  return (
    <GameWrapper
      title="Egg Hunt!"
      emoji="🐣"
      gradient={`bg-gradient-to-br ${scene.bg}`}
      onBack={onBack}
    >
      <AnimatePresence>
        {feedback === "correct" && <CorrectBanner key="correct" />}
      </AnimatePresence>

      {/* HUD */}
      <div className="flex gap-4 items-center mb-3">
        <div className="bg-white/70 rounded-2xl px-4 py-2 font-black text-green-800 text-lg shadow">
          🥚 {found.size} / {scene.eggs.length}
        </div>
        <div className="bg-white/70 rounded-2xl px-4 py-2 font-black text-purple-700 text-base shadow">
          {scene.label}
        </div>
        <button
          onClick={() => setShowHint(h => !h)}
          className="bg-yellow-300 hover:bg-yellow-400 rounded-2xl px-3 py-2 font-black text-yellow-900 text-sm shadow transition-all"
        >
          💡 Hint
        </button>
      </div>

      {/* Hint list */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white/80 rounded-2xl px-4 py-3 mb-3 w-full max-w-md shadow"
          >
            <p className="font-black text-green-800 mb-1 text-sm">Look for eggs:</p>
            <ul className="flex flex-wrap gap-2">
              {scene.eggs.map((egg, i) => (
                <li key={egg.id} className={`text-sm font-bold px-2 py-1 rounded-xl ${found.has(egg.id) ? "line-through text-muted-foreground bg-gray-100" : "bg-yellow-100 text-yellow-800"}`}>
                  {found.has(egg.id) ? "✅" : "🔍"} {egg.hint}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene area */}
      <div
        className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 bg-gradient-to-b ${scene.bg}`}
        style={{ height: "340px" }}
      >
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200/60 to-transparent pointer-events-none" />

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-green-500/40 rounded-b-3xl" />

        {/* Decorations */}
        {scene.decorations.map((d, i) => (
          <span key={i} className="absolute select-none pointer-events-none" style={d.style}>
            {d.emoji}
          </span>
        ))}

        {/* Eggs */}
        {scene.eggs.map((egg, i) => {
          const color = EGG_COLORS[i % EGG_COLORS.length];
          const isFound = found.has(egg.id);
          return (
            <motion.button
              key={egg.id}
              onClick={() => handleEggTap(egg.id)}
              whileTap={{ scale: 0.9 }}
              animate={isFound ? { scale: [1, 1.4, 0], opacity: [1, 1, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="absolute flex items-center justify-center text-xl shadow-lg border-2 border-white/60"
              style={{
                left: egg.left,
                right: egg.right,
                bottom: egg.bottom,
                width: "44px",
                height: "52px",
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                backgroundColor: color.bg,
                zIndex: 10,
                cursor: isFound ? "default" : "pointer",
                opacity: isFound ? 0 : 1,
              }}
            >
              {color.pattern}
            </motion.button>
          );
        })}

        {/* All found overlay */}
        <AnimatePresence>
          {allFound && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-3xl gap-3 z-20"
            >
              <div className="text-6xl">🎉</div>
              <p className="text-white font-black text-2xl drop-shadow-lg">All eggs found!</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleNextScene}
                className="bg-yellow-400 text-yellow-900 font-black text-xl px-8 py-3 rounded-2xl shadow-xl mt-2"
              >
                Next Scene →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scene dots */}
      <div className="flex gap-2 mt-4">
        {SCENES.map((s, i) => (
          <div key={s.id} className={`w-3 h-3 rounded-full ${i === sceneIdx ? "bg-green-600" : "bg-white/60"}`} />
        ))}
      </div>
    </GameWrapper>
  );
}