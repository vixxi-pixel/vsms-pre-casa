import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AlphabetGame from "../components/games/AlphabetGame";
import ColorsShapesGame from "../components/games/ColorsShapesGame";
import NumbersGame from "../components/games/NumbersGame";
import EasterEggHunt from "../components/games/EasterEggHunt";
import EggTapGame from "../components/games/EggTapGame";
import BunnyHopGame from "../components/games/BunnyHopGame";
import SheepCountGame from "../components/games/SheepCountGame";

const floatingAnimals = [
  { emoji: "🐰", top: "8%", left: "5%", delay: 0 },
  { emoji: "🐑", top: "15%", right: "6%", delay: 0.3 },
  { emoji: "🐰", top: "75%", left: "4%", delay: 0.6 },
  { emoji: "🐑", top: "80%", right: "5%", delay: 0.2 },
  { emoji: "🌿", top: "45%", left: "2%", delay: 0.5 },
  { emoji: "🌸", top: "50%", right: "3%", delay: 0.4 },
];

const featuredGames = [
  {
    id: "bunny",
    emoji: "🐰",
    title: "Bunny Hop!",
    sub: "Tap the bunny before it hops away!",
    color: "from-sky-400 to-blue-500",
    shadow: "shadow-blue-200",
  },
  {
    id: "sheep",
    emoji: "🐑",
    title: "Sheep Count!",
    sub: "Count and match the fluffy sheep!",
    color: "from-green-400 to-emerald-500",
    shadow: "shadow-green-200",
  },
  {
    id: "easter",
    emoji: "🔍",
    title: "Egg Hunt!",
    sub: "Find hidden eggs in the scene!",
    color: "from-lime-400 to-green-500",
    shadow: "shadow-lime-200",
  },
  {
    id: "eggtap",
    emoji: "🥚",
    title: "Egg Tap!",
    sub: "Tap as many eggs as you can!",
    color: "from-yellow-400 to-orange-400",
    shadow: "shadow-yellow-200",
  },
];

const subjectGames = [
  { id: "alphabet", emoji: "🔤", label: "Letters", color: "from-violet-400 to-purple-500", shadow: "shadow-purple-200" },
  { id: "colors", emoji: "🎨", label: "Colors & Shapes", color: "from-pink-400 to-rose-500", shadow: "shadow-pink-200" },
  { id: "numbers", emoji: "🔢", label: "Numbers", color: "from-cyan-400 to-blue-500", shadow: "shadow-blue-200" },
];

export default function Home() {
  const [activeTopic, setActiveTopic] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-green-50 font-nunito relative overflow-hidden">
      {/* Floating animals */}
      {floatingAnimals.map((d, i) => (
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
            {/* Header */}
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-10"
            >
              <div className="flex justify-center gap-2 text-5xl mb-3">
                <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>🐰</motion.span>
                <motion.span animate={{ rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 2 }}>🌸</motion.span>
                <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}>🐑</motion.span>
              </div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 leading-tight">
                VSMS - PRE CASA
              </h1>
              <p className="text-xl font-bold text-muted-foreground mt-2">
                Pick a game to play 👇
              </p>
            </motion.div>

            {/* Featured Games — 2x2 grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
              {featuredGames.map((game, i) => (
                <motion.button
                  key={game.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTopic(game.id)}
                  className={`bg-gradient-to-br ${game.color} ${game.shadow} shadow-xl rounded-3xl p-5 flex flex-col items-center gap-2 text-white font-black cursor-pointer border-0 transition-all`}
                >
                  <span className="text-5xl">{game.emoji}</span>
                  <span className="text-lg text-center leading-tight">{game.title}</span>
                  <span className="text-xs font-bold opacity-80 text-center">{game.sub}</span>
                </motion.button>
              ))}
            </div>

            {/* Subject Games */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              {subjectGames.map((topic, i) => (
                <motion.button
                  key={topic.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.07, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTopic(topic.id)}
                  className={`bg-gradient-to-br ${topic.color} ${topic.shadow} shadow-xl rounded-3xl p-5 flex flex-col items-center gap-2 text-white font-black text-base cursor-pointer border-0 transition-all`}
                >
                  <span className="text-4xl">{topic.emoji}</span>
                  <span className="text-sm text-center leading-tight">{topic.label}</span>
                </motion.button>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8 text-muted-foreground font-semibold text-sm"
            >
              🐰 Have fun learning! 🐑
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
            {activeTopic === "eggtap" && <EggTapGame onBack={() => setActiveTopic(null)} />}
            {activeTopic === "bunny" && <BunnyHopGame onBack={() => setActiveTopic(null)} />}
            {activeTopic === "sheep" && <SheepCountGame onBack={() => setActiveTopic(null)} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}