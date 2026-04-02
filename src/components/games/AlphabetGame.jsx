import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameWrapper from "./GameWrapper";
import { CorrectBanner, WrongBanner } from "./CorrectWrong";

const LETTERS = [
  { letter: "A", emoji: "🍎", word: "Apple" },
  { letter: "B", emoji: "🐻", word: "Bear" },
  { letter: "C", emoji: "🐱", word: "Cat" },
  { letter: "D", emoji: "🐶", word: "Dog" },
  { letter: "E", emoji: "🐘", word: "Elephant" },
  { letter: "F", emoji: "🐸", word: "Frog" },
  { letter: "G", emoji: "🍇", word: "Grapes" },
  { letter: "H", emoji: "🏠", word: "House" },
  { letter: "I", emoji: "🍦", word: "Ice cream" },
  { letter: "J", emoji: "🤹", word: "Juggler" },
  { letter: "K", emoji: "🪁", word: "Kite" },
  { letter: "L", emoji: "🦁", word: "Lion" },
  { letter: "M", emoji: "🌙", word: "Moon" },
  { letter: "N", emoji: "🌰", word: "Nut" },
  { letter: "O", emoji: "🦉", word: "Owl" },
  { letter: "P", emoji: "🐧", word: "Penguin" },
  { letter: "Q", emoji: "👸", word: "Queen" },
  { letter: "R", emoji: "🌈", word: "Rainbow" },
  { letter: "S", emoji: "⭐", word: "Star" },
  { letter: "T", emoji: "🐢", word: "Turtle" },
  { letter: "U", emoji: "☂️", word: "Umbrella" },
  { letter: "V", emoji: "🌋", word: "Volcano" },
  { letter: "W", emoji: "🐋", word: "Whale" },
  { letter: "X", emoji: "🎸", word: "Xylophone" },
  { letter: "Y", emoji: "🪀", word: "Yo-yo" },
  { letter: "Z", emoji: "🦓", word: "Zebra" },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getChoices(correct, all) {
  const others = shuffle(all.filter(l => l.letter !== correct.letter)).slice(0, 3);
  return shuffle([correct, ...others]);
}

export default function AlphabetGame({ onBack }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * LETTERS.length));
  const [choices, setChoices] = useState(() => getChoices(LETTERS[0], LETTERS));
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const current = LETTERS[index];

  const nextQuestion = useCallback(() => {
    const newIdx = Math.floor(Math.random() * LETTERS.length);
    setIndex(newIdx);
    setChoices(getChoices(LETTERS[newIdx], LETTERS));
    setFeedback(null);
  }, []);

  const handleChoice = (letter) => {
    if (feedback) return;
    const correct = letter === current.letter;
    setFeedback(correct ? "correct" : "wrong");
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
    setTimeout(() => nextQuestion(), 1200);
  };

  return (
    <GameWrapper title="Letters" emoji="🔤" gradient="from-violet-400 via-purple-300 to-indigo-400" onBack={onBack}>
      <AnimatePresence>
        {feedback === "correct" && <CorrectBanner key="correct" />}
        {feedback === "wrong" && <WrongBanner key="wrong" />}
      </AnimatePresence>

      {/* Score */}
      <div className="text-white font-black text-xl mb-6 bg-white/20 px-6 py-2 rounded-2xl">
        ⭐ {score} / {total}
      </div>

      {/* Question card */}
      <motion.div
        key={current.letter}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-3 mb-8 w-full max-w-sm"
      >
        <span className="text-8xl">{current.emoji}</span>
        <p className="text-2xl font-black text-foreground">{current.word}</p>
        <p className="text-lg font-bold text-muted-foreground">Which letter does this start with?</p>
      </motion.div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {choices.map((choice) => (
          <motion.button
            key={choice.letter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChoice(choice.letter)}
            className="bg-white rounded-2xl shadow-lg text-5xl font-black text-purple-600 py-6 hover:bg-purple-50 transition-colors border-2 border-purple-100 active:border-purple-400"
          >
            {choice.letter}
          </motion.button>
        ))}
      </div>
    </GameWrapper>
  );
}