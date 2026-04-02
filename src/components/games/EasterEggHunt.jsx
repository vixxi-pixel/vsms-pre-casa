import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameWrapper from "./GameWrapper";
import { CorrectBanner, WrongBanner } from "./CorrectWrong";

// Each egg has a color and a unique pattern
const EGGS = [
  { id: 1, emoji: "🥚", color: "bg-red-400", label: "Red", pattern: "🌸" },
  { id: 2, emoji: "🥚", color: "bg-blue-400", label: "Blue", pattern: "⭐" },
  { id: 3, emoji: "🥚", color: "bg-yellow-400", label: "Yellow", pattern: "🌼" },
  { id: 4, emoji: "🥚", color: "bg-green-400", label: "Green", pattern: "🍀" },
  { id: 5, emoji: "🥚", color: "bg-purple-400", label: "Purple", pattern: "🦋" },
  { id: 6, emoji: "🥚", color: "bg-pink-400", label: "Pink", pattern: "💖" },
];

const HIDING_SPOTS = [
  { label: "Behind the bush 🌿", emoji: "🌿" },
  { label: "Under the flower 🌸", emoji: "🌸" },
  { label: "Near the bunny 🐰", emoji: "🐰" },
  { label: "In the basket 🧺", emoji: "🧺" },
  { label: "By the tree 🌳", emoji: "🌳" },
  { label: "Under the cloud ☁️", emoji: "☁️" },
  { label: "In the grass 🌱", emoji: "🌱" },
  { label: "Next to the chick 🐥", emoji: "🐥" },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateRound() {
  const target = EGGS[Math.floor(Math.random() * EGGS.length)];
  // Only 2 spots so it's easy to find
  const spots = shuffle(HIDING_SPOTS).slice(0, 2);
  const correctSpotIdx = Math.floor(Math.random() * 2);
  return { target, spots, correctSpotIdx };
}

export default function EasterEggHunt({ onBack }) {
  const [round, setRound] = useState(() => generateRound());
  const [revealed, setRevealed] = useState([]); // indices of tapped spots
  const [feedback, setFeedback] = useState(null);
  const [found, setFound] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [hint, setHint] = useState(false); // wiggle hint after wrong guess

  const handleSpotTap = (idx) => {
    if (feedback) return;

    const isCorrect = idx === round.correctSpotIdx;
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setFound(f => f + 1);
      setCelebrating(true);
      setHint(false);
      setTimeout(() => {
        setCelebrating(false);
        setRound(generateRound());
        setRevealed([]);
        setFeedback(null);
      }, 1600);
    } else {
      // Show hint: wiggle the correct spot briefly
      setHint(true);
      setTimeout(() => {
        setFeedback(null);
        setHint(false);
      }, 900);
    }
  };

  return (
    <GameWrapper title="Egg Hunt!" emoji="🐣" gradient="from-green-300 via-lime-200 to-yellow-200" onBack={onBack}>
      <AnimatePresence>
        {feedback === "correct" && <CorrectBanner key="correct" />}
        {feedback === "wrong" && <WrongBanner key="wrong" />}
      </AnimatePresence>

      {/* Score */}
      <div className="text-green-800 font-black text-xl mb-4 bg-white/60 px-6 py-2 rounded-2xl shadow">
        🥚 Eggs found: {found}
      </div>

      {hint && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-orange-500 font-black text-lg mb-2"
        >
          Keep looking! 🔍
        </motion.p>
      )}

      {/* Target egg prompt */}
      <motion.div
        key={round.target.id}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl p-5 flex flex-col items-center gap-3 mb-6 w-full max-w-sm"
      >
        <p className="text-lg font-black text-muted-foreground">Find the egg!</p>
        <div className={`w-24 h-28 ${round.target.color} rounded-full flex items-center justify-center text-4xl shadow-lg`}
          style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}>
          {round.target.pattern}
        </div>
        <p className="text-xl font-black text-foreground">{round.target.label} egg</p>
      </motion.div>

      {/* Hiding spots grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {round.spots.map((spot, idx) => {
          const isCorrectSpot = idx === round.correctSpotIdx;
          const showEgg = feedback === "correct" && isCorrectSpot;

          return (
            <motion.button
              key={`${round.target.id}-${idx}`}
              animate={hint && isCorrectSpot ? { x: [0, -8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSpotTap(idx)}
              className={`rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2 font-black text-base transition-all border-2
                ${showEgg ? "bg-yellow-100 border-yellow-400" : "bg-white border-green-200 hover:border-green-400 cursor-pointer"}
              `}
            >
              <AnimatePresence mode="wait">
                {showEgg ? (
                  <motion.div
                    key="egg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className={`w-14 h-16 ${round.target.color} rounded-full flex items-center justify-center text-3xl shadow`}
                      style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}>
                      {round.target.pattern}
                    </div>
                    <span className="text-green-600">Found it! 🎉</span>
                  </motion.div>
                ) : (
                  <motion.div key="hidden" className="flex flex-col items-center gap-2">
                    <span className="text-5xl">{spot.emoji}</span>
                    <span className="text-green-700 text-base">{spot.label}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Decorative grass */}
      <div className="mt-8 text-3xl select-none opacity-60">
        🌿🌸🐰🌼🌿🐥🌸🌿
      </div>
    </GameWrapper>
  );
}