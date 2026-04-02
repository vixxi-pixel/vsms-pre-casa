import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameWrapper from "./GameWrapper";

const EGG_COLORS = [
  { bg: "bg-red-400", pattern: "🌸" },
  { bg: "bg-blue-400", pattern: "⭐" },
  { bg: "bg-yellow-400", pattern: "🌼" },
  { bg: "bg-green-400", pattern: "🍀" },
  { bg: "bg-purple-400", pattern: "🦋" },
  { bg: "bg-pink-400", pattern: "💖" },
  { bg: "bg-orange-400", pattern: "🌟" },
];

function randomEgg(id) {
  const color = EGG_COLORS[Math.floor(Math.random() * EGG_COLORS.length)];
  return {
    id,
    ...color,
    x: Math.random() * 75 + 5, // 5–80% from left
    y: Math.random() * 65 + 10, // 10–75% from top
    scale: 0.8 + Math.random() * 0.5,
  };
}

export default function EggTapGame({ onBack }) {
  const [eggs, setEggs] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [pops, setPops] = useState([]); // burst animations
  const [nextId, setNextId] = useState(1);

  // Spawn eggs periodically
  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(() => {
      setNextId(id => {
        setEggs(prev => {
          if (prev.length >= 6) return prev; // max 6 on screen
          return [...prev, randomEgg(id)];
        });
        return id + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [started, finished]);

  // Countdown timer
  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setFinished(true);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  // Spawn initial eggs on start
  const handleStart = () => {
    setEggs([randomEgg(1), randomEgg(2), randomEgg(3)]);
    setNextId(4);
    setStarted(true);
  };

  const handleTap = (egg) => {
    setEggs(prev => prev.filter(e => e.id !== egg.id));
    setScore(s => s + 1);
    setPops(prev => [...prev, { id: egg.id, x: egg.x, y: egg.y }]);
    setTimeout(() => setPops(prev => prev.filter(p => p.id !== egg.id)), 600);
  };

  const handleRestart = () => {
    setScore(0);
    setTimeLeft(30);
    setFinished(false);
    setEggs([randomEgg(1), randomEgg(2), randomEgg(3)]);
    setNextId(4);
    setStarted(true);
  };

  return (
    <GameWrapper title="Tap the Eggs!" emoji="🥚" gradient="from-yellow-300 via-lime-200 to-green-300" onBack={onBack}>
      {!started ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="text-8xl">🥚</div>
          <p className="text-2xl font-black text-green-800 text-center">Tap all the Easter eggs!</p>
          <p className="text-lg font-bold text-green-700 text-center">You have 30 seconds. Go!</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleStart}
            className="bg-green-500 text-white font-black text-2xl px-10 py-5 rounded-3xl shadow-xl"
          >
            Start! 🐣
          </motion.button>
        </motion.div>
      ) : finished ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="text-7xl">🎉</div>
          <p className="text-3xl font-black text-green-800">Time's up!</p>
          <div className="bg-white rounded-3xl shadow-xl px-10 py-6 flex flex-col items-center gap-2">
            <p className="text-xl font-bold text-muted-foreground">You tapped</p>
            <p className="text-6xl font-black text-green-500">{score}</p>
            <p className="text-xl font-bold text-muted-foreground">eggs! 🥚</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleRestart}
            className="bg-green-500 text-white font-black text-xl px-8 py-4 rounded-3xl shadow-xl"
          >
            Play Again! 🔄
          </motion.button>
        </motion.div>
      ) : (
        <div className="relative w-full max-w-sm" style={{ height: "420px" }}>
          {/* HUD */}
          <div className="flex justify-between items-center mb-3">
            <div className="bg-white/70 rounded-2xl px-4 py-2 font-black text-green-800 text-lg">
              🥚 {score}
            </div>
            <div className={`bg-white/70 rounded-2xl px-4 py-2 font-black text-lg ${timeLeft <= 5 ? "text-red-500" : "text-green-800"}`}>
              ⏱ {timeLeft}s
            </div>
          </div>

          {/* Game area */}
          <div className="relative bg-white/30 rounded-3xl overflow-hidden" style={{ height: "370px" }}>
            <AnimatePresence>
              {eggs.map(egg => (
                <motion.button
                  key={egg.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: egg.scale, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => handleTap(egg)}
                  className={`absolute ${egg.bg} rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-white/50`}
                  style={{
                    left: `${egg.x}%`,
                    top: `${egg.y}%`,
                    width: "72px",
                    height: "84px",
                    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {egg.pattern}
                </motion.button>
              ))}
            </AnimatePresence>

            {/* Pop burst effects */}
            <AnimatePresence>
              {pops.map(pop => (
                <motion.div
                  key={`pop-${pop.id}`}
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute pointer-events-none text-3xl"
                  style={{ left: `${pop.x}%`, top: `${pop.y}%`, transform: "translate(-50%,-50%)" }}
                >
                  ✨
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </GameWrapper>
  );
}