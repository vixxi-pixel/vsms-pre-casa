import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameWrapper from "./GameWrapper";
import { CorrectBanner, WrongBanner } from "./CorrectWrong";

const EMOJIS = ["🍎", "🐶", "⭐", "🎈", "🦋", "🌸", "🍭", "🐸", "🚀", "🌈"];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateQuestion(mode) {
  if (mode === "count") {
    const count = Math.floor(Math.random() * 9) + 1; // 1–9
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const wrong = shuffle([1,2,3,4,5,6,7,8,9,10].filter(n => n !== count)).slice(0, 3);
    return { count, emoji, choices: shuffle([count, ...wrong]) };
  } else {
    // "which is bigger"
    const a = Math.floor(Math.random() * 9) + 1;
    let b = Math.floor(Math.random() * 9) + 1;
    while (b === a) b = Math.floor(Math.random() * 9) + 1;
    return { a, b, answer: Math.max(a, b) };
  }
}

export default function NumbersGame({ onBack }) {
  const [mode, setMode] = useState("count");
  const [question, setQuestion] = useState(() => generateQuestion("count"));
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const switchMode = (m) => {
    setMode(m);
    setQuestion(generateQuestion(m));
    setFeedback(null);
  };

  const handleCountAnswer = (n) => {
    if (feedback) return;
    const isCorrect = n === question.count;
    setFeedback(isCorrect ? "correct" : "wrong");
    setTotal(t => t + 1);
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      setQuestion(generateQuestion("count"));
      setFeedback(null);
    }, 1200);
  };

  const handleBiggerAnswer = (n) => {
    if (feedback) return;
    const isCorrect = n === question.answer;
    setFeedback(isCorrect ? "correct" : "wrong");
    setTotal(t => t + 1);
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      setQuestion(generateQuestion("bigger"));
      setFeedback(null);
    }, 1200);
  };

  return (
    <GameWrapper title="Numbers" emoji="🔢" gradient="from-cyan-400 via-sky-300 to-blue-400" onBack={onBack}>
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
        {[
          { id: "count", label: "🔢 Count" },
          { id: "bigger", label: "🏆 Which is bigger?" },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id)}
            className={`px-5 py-2 rounded-xl font-black text-base transition-all ${
              mode === m.id ? "bg-white text-blue-500 shadow-md" : "text-white"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "count" ? (
        <>
          <motion.div
            key={`${question.count}-${question.emoji}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center gap-4 mb-8 w-full max-w-sm"
          >
            <div className="flex flex-wrap justify-center gap-2 max-w-xs">
              {Array.from({ length: question.count }).map((_, i) => (
                <span key={i} className="text-4xl">{question.emoji}</span>
              ))}
            </div>
            <p className="text-xl font-black text-muted-foreground">How many {question.emoji}?</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {question.choices.map((n) => (
              <motion.button
                key={n}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCountAnswer(n)}
                className="bg-white rounded-2xl shadow-lg text-5xl font-black text-blue-500 py-6 border-2 border-blue-100 hover:bg-blue-50 transition-colors"
              >
                {n}
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <>
          <motion.div
            key={`${question.a}-${question.b}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4 mb-8 w-full max-w-sm"
          >
            <p className="text-xl font-black text-muted-foreground">Which number is bigger?</p>
            <div className="flex gap-8 items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleBiggerAnswer(question.a)}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-black text-5xl shadow-lg flex items-center justify-center"
              >
                {question.a}
              </motion.button>
              <span className="text-3xl font-black text-muted-foreground">or</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleBiggerAnswer(question.b)}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-black text-5xl shadow-lg flex items-center justify-center"
              >
                {question.b}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </GameWrapper>
  );
}