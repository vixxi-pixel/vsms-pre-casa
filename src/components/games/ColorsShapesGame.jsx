import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameWrapper from "./GameWrapper";
import { CorrectBanner, WrongBanner } from "./CorrectWrong";

const COLORS = [
  { name: "Red", bg: "bg-red-400", hex: "#f87171" },
  { name: "Blue", bg: "bg-blue-400", hex: "#60a5fa" },
  { name: "Green", bg: "bg-green-500", hex: "#22c55e" },
  { name: "Yellow", bg: "bg-yellow-400", hex: "#facc15" },
  { name: "Orange", bg: "bg-orange-400", hex: "#fb923c" },
  { name: "Purple", bg: "bg-purple-500", hex: "#a855f7" },
  { name: "Pink", bg: "bg-pink-400", hex: "#f472b6" },
];

const SHAPES = [
  { name: "Circle", emoji: "⭕" },
  { name: "Square", emoji: "🟦" },
  { name: "Triangle", emoji: "🔺" },
  { name: "Star", emoji: "⭐" },
  { name: "Heart", emoji: "❤️" },
  { name: "Diamond", emoji: "💎" },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function ColorQuestion({ onAnswer }) {
  const correct = COLORS[Math.floor(Math.random() * COLORS.length)];
  const choices = shuffle(COLORS.filter(c => c.name !== correct.name)).slice(0, 3);
  const allChoices = shuffle([correct, ...choices]);
  return { correct, allChoices };
}

export default function ColorsShapesGame({ onBack }) {
  const [mode, setMode] = useState("colors"); // "colors" | "shapes"
  const [question, setQuestion] = useState(() => generateColorQ());
  const [shapeQ, setShapeQ] = useState(() => generateShapeQ());
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  function generateColorQ() {
    const correct = COLORS[Math.floor(Math.random() * COLORS.length)];
    const choices = shuffle(COLORS.filter(c => c.name !== correct.name)).slice(0, 3);
    return { correct, choices: shuffle([correct, ...choices]) };
  }

  function generateShapeQ() {
    const correct = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const choices = shuffle(SHAPES.filter(s => s.name !== correct.name)).slice(0, 3);
    return { correct, choices: shuffle([correct, ...choices]) };
  }

  const handleColorAnswer = (color) => {
    if (feedback) return;
    const isCorrect = color.name === question.correct.name;
    setFeedback(isCorrect ? "correct" : "wrong");
    setTotal(t => t + 1);
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      setQuestion(generateColorQ());
      setFeedback(null);
    }, 1200);
  };

  const handleShapeAnswer = (shape) => {
    if (feedback) return;
    const isCorrect = shape.name === shapeQ.correct.name;
    setFeedback(isCorrect ? "correct" : "wrong");
    setTotal(t => t + 1);
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      setShapeQ(generateShapeQ());
      setFeedback(null);
    }, 1200);
  };

  return (
    <GameWrapper title="Colors & Shapes" emoji="🎨" gradient="from-pink-400 via-rose-300 to-orange-300" onBack={onBack}>
      <AnimatePresence>
        {feedback === "correct" && <CorrectBanner key="correct" />}
        {feedback === "wrong" && <WrongBanner key="wrong" />}
      </AnimatePresence>

      {/* Score */}
      <div className="text-white font-black text-xl mb-4 bg-white/20 px-6 py-2 rounded-2xl">
        ⭐ {score} / {total}
      </div>

      {/* Mode Switch */}
      <div className="flex gap-3 mb-6 bg-white/30 rounded-2xl p-1">
        {["colors", "shapes"].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-2 rounded-xl font-black text-lg transition-all capitalize ${
              mode === m ? "bg-white text-pink-500 shadow-md" : "text-white"
            }`}
          >
            {m === "colors" ? "🎨 Colors" : "🔷 Shapes"}
          </button>
        ))}
      </div>

      {mode === "colors" ? (
        <>
          <motion.div
            key={question.correct.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4 mb-8 w-full max-w-sm"
          >
            <div className={`w-32 h-32 rounded-3xl ${question.correct.bg} shadow-lg`} />
            <p className="text-xl font-black text-muted-foreground">What color is this?</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {question.choices.map((c) => (
              <motion.button
                key={c.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleColorAnswer(c)}
                className={`${c.bg} rounded-2xl shadow-lg text-white font-black text-xl py-5 transition-all`}
              >
                {c.name}
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <>
          <motion.div
            key={shapeQ.correct.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4 mb-8 w-full max-w-sm"
          >
            <span className="text-9xl">{shapeQ.correct.emoji}</span>
            <p className="text-xl font-black text-muted-foreground">What shape is this?</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {shapeQ.choices.map((s) => (
              <motion.button
                key={s.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShapeAnswer(s)}
                className="bg-white rounded-2xl shadow-lg text-3xl font-black text-pink-500 py-5 flex flex-col items-center gap-1 border-2 border-pink-100"
              >
                <span className="text-4xl">{s.emoji}</span>
                <span className="text-lg">{s.name}</span>
              </motion.button>
            ))}
          </div>
        </>
      )}
    </GameWrapper>
  );
}