import { motion } from "framer-motion";

export function CorrectBanner() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <div className="bg-green-400 text-white text-5xl font-black px-12 py-8 rounded-3xl shadow-2xl flex flex-col items-center gap-2">
        <span className="text-7xl">🎉</span>
        <span>Correct!</span>
      </div>
    </motion.div>
  );
}

export function WrongBanner() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <div className="bg-orange-400 text-white text-5xl font-black px-12 py-8 rounded-3xl shadow-2xl flex flex-col items-center gap-2">
        <span className="text-7xl">🙈</span>
        <span>Try again!</span>
      </div>
    </motion.div>
  );
}