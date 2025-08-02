'use client';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewPanel({ isOpen, onClose, questions, userAnswers, onQuestionSelect, currentQuestionIndex }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-40"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-xs bg-slate-800/80 backdrop-blur-xl border-l border-white/20 shadow-2xl z-50 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Review Questions</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><FiX size={28} /></button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {questions.map((_, index) => {
                const isAttempted = userAnswers[index] !== undefined;
                const isCurrent = index === currentQuestionIndex;
                let statusClass = 'bg-slate-700/50 hover:bg-slate-600/80';
                if (isCurrent) statusClass = 'bg-blue-600 ring-2 ring-blue-400';
                else if (isAttempted) statusClass = 'bg-green-600/80 hover:bg-green-500/80';

                return (
                  <button
                    key={index}
                    onClick={() => onQuestionSelect(index)}
                    className={`aspect-square rounded-lg flex items-center justify-center font-bold text-white transition-all duration-200 ${statusClass}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}