import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameWrapper from "./GameWrapper";

// Bunny hops across the screen — tap it before it disappears!
const POSITIONS = [
  { left: "5%", bottom: "15%" },
  { left: "20%", bottom: "20%" },
  { left: "38%", bottom: "12%" },
  { left: "55%", bottom: "18%" },
  { left: "70%", bottom: "14%" },
  { left: "82%", bottom: "20%" },
  { left: "10%", bottom: "40%" },
  { left: "30%", bottom: "45%" },
  { left: "55%", bottom: "38%" },
  { left: "75%", bottom: "42%" },
];

function randomPos(exclude) {
  const others = POSITIONS.filter((_, i) => i !== exclude);
  return Math.floor(Math.random() * others.length);
}

export default function BunnyHopGame({ onBack }) {
  const [posIdx, setPosIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [missed, setMissed] = useState(false);
  const [speed, setSpeed] = useState(2000); // ms per hop

  // Bunny hops on its own even if not tapped
  useEffect(() => {
    if (!started || finished) return;
    const hop = setInterval(() => {
      setPosIdx(p => (p + 1) % POSITIONS.length);
      setMissed(true);
      setTimeout(() => setMissed(false), 400);
    }, speed);
    return () => clearInterval(hop);
  }, [started, finished, speed]);

  // Speed up over time
  useEffect(() => {
    if (!started || finished) return;
    const s = setInterval(() => {
      setSpeed(prev => Math.max(800, prev - 150));
    }, 6000);
    return () => clearInterval(s);
  }, [started, finished]);

  // Countdown
  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setFinished(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, finished]);

  const handleTap = () => {
    if (!started || finished) return;
    setScore(s => s + 1);
    setPosIdx(p => (p + 1) % POSITIONS.length);
  };

  const handleStart = () => {
    setScore(0);
    setTimeLeft(30);
    setFinished(false);
    setSpeed(2000);
    setPosIdx(0);
    setStarted(true);
  };

  const pos = POSITIONS[posIdx];

  return (
    <GameWrapper title="Bunny Hop!" emoji="🐰" gradient="from-sky-300 via-blue-200 to-indigo-200" onBack={onBack}>
      {!started ? (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6">
          <div className="text-8xl">🐰</div>
          <p className="text-2xl font-black text-blue-800 text-center">Tap the bunny before it hops away!</p>
          <p className="text-lg font-bold text-blue-600 text-center">You have 30 seconds. The bunny gets faster!</p>
          <motion.button
            whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}
            onClick={handleStart}
            className="bg-blue-500 text-white font-black text-2xl px-10 py-5 rounded-3xl shadow-xl"
          >
            Start! 🐰
          </motion.button>
        </motion.div>
      ) : finished ? (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6">
          <div className="text-7xl">🎉</div>
          <p className="text-3xl font-black text-blue-800">Time's up!</p>
          <div className="bg-white rounded-3xl shadow-xl px-10 py-6 flex flex-col items-center gap-2">
            <p className="text-xl font-bold text-muted-foreground">You tapped</p>
            <p className="text-6xl font-black text-blue-500">{score}</p>
            <p className="text-xl font-bold text-muted-foreground">bunnies! 🐰</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}
            onClick={handleStart}
            className="bg-blue-500 text-white font-black text-xl px-8 py-4 rounded-3xl shadow-xl"
          >
            Play Again! 🔄
          </motion.button>
        </motion.div>
      ) : (
        <div className="relative w-full max-w-sm" style={{ height: "420px" }}>
          {/* HUD */}
          <div className="flex justify-between items-center mb-3">
            <div className="bg-white/70 rounded-2xl px-4 py-2 font-black text-blue-800 text-lg">🐰 {score}</div>
            <div className={`bg-white/70 rounded-2xl px-4 py-2 font-black text-lg ${timeLeft <= 5 ? "text-red-500" : "text-blue-800"}`}>
              ⏱ {timeLeft}s
            </div>
          </div>

          {/* Game area */}
          <div className="relative bg-gradient-to-b from-sky-200/40 to-green-200/60 rounded-3xl border-2 border-white/60" style={{ height: "370px" }}>
            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-green-400/40 rounded-b-3xl" />
            {/* Decorations */}
            <span className="absolute text-4xl select-none pointer-events-none" style={{ left: "5%", bottom: "10%" }}>🌿</span>
            <span className="absolute text-4xl select-none pointer-events-none" style={{ right: "10%", bottom: "10%" }}>🌸</span>
            <span className="absolute text-3xl select-none pointer-events-none" style={{ left: "40%", bottom: "8%" }}>🌼</span>
            <span className="absolute text-3xl select-none pointer-events-none" style={{ left: "20%", top: "10%" }}>☁️</span>
            <span className="absolute text-3xl select-none pointer-events-none" style={{ right: "15%", top: "8%" }}>☁️</span>

            {/* Bunny */}
            <AnimatePresence mode="wait">
              <motion.button
                key={posIdx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: [0, -18, 0] }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, y: { duration: 0.4, repeat: Infinity } }}
                onClick={handleTap}
                className="absolute text-6xl select-none cursor-pointer"
                style={{ left: pos.left, bottom: pos.bottom }}
              >
                🐰
              </motion.button>
            </AnimatePresence>

            {missed && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 text-orange-500 font-black text-lg pointer-events-none"
              >
                Missed! 😅
              </motion.div>
            )}
          </div>
        </div>
      )}
    </GameWrapper>
  );
}