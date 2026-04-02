import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AlphabetGame from "../components/games/AlphabetGame";
import ColorsShapesGame from "../components/games/ColorsShapesGame";
import NumbersGame from "../components/games/NumbersGame";

const topics = [
  { id: "alphabet", emoji: "🔤", label: "Letters", color: "from-violet-400 to-purple-500", shadow: "shadow-purple-200" },
  { id: "colors", emoji: "🎨", label: "Colors & Shapes", color: "from-pink-400 to-rose-500", shadow: "shadow-pink-200" },
  { id: "numbers", emoji: "🔢", label: "Numbers", color: "from-cyan-400 to-blue-500", shadow: "shadow-blue-200" },
];

export default function Home() {
  const [activeTopic, setActiveTopic] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-cyan-50 font-nunito">
      <AnimatePresence mode="wait">
        {!activeTopic ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center min-h-screen px-6 py-10"
          >
            {/* Header */}
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-12"
            >
              <div className="text-6xl mb-4 animate-bounce-slow">🌟</div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 leading-tight">
                Let's Learn!
              </h1>
              <p className="text-xl font-bold text-muted-foreground mt-3">
                Pick a game to play 👇
              </p>
            </motion.div>

            {/* Topic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
              {topics.map((topic, i) => (
                <motion.button
                  key={topic.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ scale: 1.07, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTopic(topic.id)}
                  className={`bg-gradient-to-br ${topic.color} ${topic.shadow} shadow-xl rounded-3xl p-8 flex flex-col items-center gap-4 text-white font-black text-2xl cursor-pointer border-0 transition-all`}
                >
                  <span className="text-6xl">{topic.emoji}</span>
                  <span>{topic.label}</span>
                </motion.button>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 text-muted-foreground font-semibold text-sm"
            >
              🎓 Learning is fun! 🎓
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}