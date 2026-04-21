import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameWrapper from "./GameWrapper";
import { CorrectBanner, WrongBanner } from "./CorrectWrong";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateQuestion() {
  const count = Math.floor(Math.random() * 8) + 1; // 1–8 sheep
  const wrongs = shuffle([1,2,3,4,5,6,7,8,9,10].filter(n => n !== count)).slice(0, 3);
  return { count, choices: shuffle([count, ...wrongs]) };
}

const SHEEP_POSITIONS = [
  { left: "5%", top: "15%" }, { left: "25%", top: "10%" }, { left: "50%", top: "8%" },
  { left: "70%", top: "14%" }, { right: "3%", top: "18%" },
  { left: "12%", top: "45%" }, { left: "35%", top: "42%" }, { left: "58%", top: "40%" },
];

export default function SheepCountGame({ onBack }) {
  const [question, setQuestion] = useState(() => generateQuestion());
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [mode, setMode] = useState("count"); // "count" | "match"

  function nextQuestion() {
    setQuestion(generateQuestion());
    setFeedback(null);
  }

  const handleAnswer = (n) => {
    if (feedback) return;
    const correct = n === question.count;
    setFeedback(correct ? "correct" : "wrong");
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
    setTimeout(() => nextQuestion(), 1200);
  };

  // For match mode: show a number, pick the field with that many sheep
  const [matchQ, setMatchQ] = useState(() => generateMatchQuestion());

  function generateMatchQuestion() {
    const target = Math.floor(Math.random() * 5) + 1;
    const options = [target];
    while (options.length < 3) {
      const n = Math.floor(Math.random() * 7) + 1;
      if (!options.includes(n)) options.push(n);
    }
    return { target, options: shuffle(options) };
  }

  const handleMatchAnswer = (n) => {
    if (feedback) return;
    const correct = n === matchQ.target;
    setFeedback(correct ? "correct" : "wrong");
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setMatchQ(generateMatchQuestion());
      setFeedback(null);
    }, 1200);
  };

  const switchMode = (m) => {
    setMode(m);
    setFeedback(null);
    if (m === "count") setQuestion(generateQuestion());
    else setMatchQ(generateMatchQuestion());
  };

  return (
    <GameWrapper title="Sheep Count!" emoji="🐑" gradient="from-white via-sky-100 to-green-200" onBack={onBack}>
      <AnimatePresence>
        {feedback === "correct" && <CorrectBanner key="correct" />}
        {feedback === "wrong" && <WrongBanner key="wrong" />}
      </AnimatePresence>

      {/* Score */}
      <div className="text-green-800 font-black text-xl mb-4 bg-white/70 px-6 py-2 rounded-2xl shadow">
        ⭐ {score} / {total}
      </div>

      {/* Mode switch */}
      <div className="flex gap-3 mb-5 bg-white/40 rounded-2xl p-1">
        {[{ id: "count", label: "🔢 Count" }, { id: "match", label: "🎯 Match" }].map(m => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id)}
            className={`px-5 py-2 rounded-xl font-black text-base transition-all ${mode === m.id ? "bg-white text-green-600 shadow-md" : "text-green-800"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "count" ? (
        <>
          {/* Sheep field */}
          <motion.div
            key={question.count}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-gradient-to-b from-sky-100 to-green-200 rounded-3xl border-4 border-white shadow-2xl mb-6 w-full max-w-sm overflow-hidden"
            style={{ height: "200px" }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-green-400/50 rounded-b-3xl" />
            {SHEEP_POSITIONS.slice(0, question.count).map((pos, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1, y: [0, -4, 0] }}
                transition={{ delay: i * 0.08, y: { repeat: Infinity, duration: 1.5 + i * 0.2, delay: i * 0.1 } }}
                className="absolute text-4xl select-none"
                style={{ left: pos.left, top: pos.top, right: pos.right }}
              >
                🐑
              </motion.span>
            ))}
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 font-black text-green-800 text-sm">How many sheep? 🐑</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {question.choices.map(n => (
              <motion.button
                key={n}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(n)}
                className="bg-white rounded-2xl shadow-lg text-5xl font-black text-green-600 py-6 border-2 border-green-100 hover:bg-green-50"
              >
                {n}
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <>
          <motion.div
            key={matchQ.target}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl px-10 py-6 flex flex-col items-center gap-3 mb-6 w-full max-w-sm"
          >
            <p className="text-lg font-black text-muted-foreground">Find the field with</p>
            <div className="text-8xl font-black text-green-600">{matchQ.target}</div>
            <p className="text-lg font-black text-muted-foreground">sheep 🐑</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            {matchQ.options.map((n, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => handleMatchAnswer(n)}
                className="bg-gradient-to-b from-sky-100 to-green-200 rounded-2xl border-2 border-white shadow-lg flex flex-col items-center py-4 gap-1"
                style={{ minHeight: "110px" }}
              >
                <div className="flex flex-wrap justify-center gap-0.5 px-1">
                  {Array.from({ length: n }).map((_, j) => (
                    <span key={j} className="text-2xl">🐑</span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </>
      )}
    </GameWrapper>
  );
}