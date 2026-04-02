import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AlphabetGame from "../components/games/AlphabetGame";
import ColorsShapesGame from "../components/games/ColorsShapesGame";
import NumbersGame from "../components/games/NumbersGame";
import EasterEggHunt from "../components/games/EasterEggHunt";

const topics = [
  { id: "alphabet", emoji: "🔤", label: "Letters", color: "from-violet-400 to-purple-500", shadow: "shadow-purple-200" },
  { id: "colors", emoji: "🎨", label: "Colors & Shapes", color: "from-pink-400 to-rose-500", shadow: "shadow-pink-200" },
  { id: "numbers", emoji: "🔢", label: "Numbers", color: "from-cyan-400 to-blue-500", shadow: "shadow-blue-200" },
];

// Floating decorative eggs for the background
const floatingEggs = [
  { emoji: "🥚", top: "8%", left: "5%", delay: 0 },
  { emoji: "🌸", top: "15%", right: "6%", delay: 0.3 },
  { emoji: "🐰", top: "75%", left: "4%", delay: 0.6 },
  { emoji: "🌼", top: "80%", right: "5%", delay: 0.2 },
  { emoji: "🐣", top: "45%", left: "2%", delay: 0.5 },
  { emoji: "🌿", top: "50%", right: "3%", delay: 0.4 },
];

export default function Home() {
  const [activeTopic, setActiveTopic] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-pink-50 to-yellow-50 font-nunito relative overflow-hidden">
      {/* Floating Easter decorations */}
      {floatingEggs.map((d, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl select-none pointer-events-none"
          style={{ top: d.top, left: d.left, right: d.right }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 + i * 0.3, delay: d.delay, ease: "easeInOut" }}
        >
          {d.emoji}
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        {!activeTopic ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center min-h-screen px-6 py-10"
          >
            {/* Easter Header */}
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-10"
            >
              <div className="flex justify-center gap-2 text-5xl mb-3">
                <motion.span animate={{ rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 2 }}>🐣</motion.span>
                <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.2 }}>🌸</motion.span>
                <motion.span animate={{ rotate: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}>🐰</motion.span>
              </div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-pink-500 to-yellow-500 leading-tight">
                Happy Easter!
              </h1>
              <p className="text-xl font-bold text-muted-foreground mt-2">
                Pick a game to play 👇
              </p>
            </motion.div>

            {/* Easter Egg Hunt — featured */}
            <motion.button
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTopic("easter")}
              className="bg-gradient-to-br from-green-400 to-lime-500 shadow-xl shadow-green-200 rounded-3xl p-6 flex items-center gap-5 text-white font-black text-2xl cursor-pointer border-0 transition-all w-full max-w-md mb-6"
            >
              <span className="text-6xl">🐣</span>
              <div className="text-left">
                <div className="text-3xl">Easter Egg Hunt!</div>
                <div className="text-base font-bold opacity-90">Find the hidden eggs 🥚🌸</div>
              </div>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="ml-auto text-4xl"
              >→</motion.span>
            </motion.button>

            {/* Other Topic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
              {topics.map((topic, i) => (
                <motion.button
                  key={topic.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.07, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTopic(topic.id)}
                  className={`bg-gradient-to-br ${topic.color} ${topic.shadow} shadow-xl rounded-3xl p-6 flex flex-col items-center gap-3 text-white font-black text-xl cursor-pointer border-0 transition-all`}
                >
                  <span className="text-5xl">{topic.emoji}</span>
                  <span>{topic.label}</span>
                </motion.button>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-10 text-muted-foreground font-semibold text-sm"
            >
              🌷 Spring is here — let's learn! 🌷
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key={activeTopic}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen"
          >
            {activeTopic === "alphabet" && <AlphabetGame onBack={() => setActiveTopic(null)} />}
            {activeTopic === "colors" && <ColorsShapesGame onBack={() => setActiveTopic(null)} />}
            {activeTopic === "numbers" && <NumbersGame onBack={() => setActiveTopic(null)} />}
            {activeTopic === "easter" && <EasterEggHunt onBack={() => setActiveTopic(null)} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}