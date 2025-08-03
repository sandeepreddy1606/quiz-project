'use client';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewPanel({ isOpen, onClose, questions, userAnswers, onQuestionSelect, currentQuestionIndex, reviewLaterQuestions }) {
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
            className="fixed top-0 right-0 h-full w-full max-w-xs bg-white/80 backdrop-blur-xl border-l border-gray-200 shadow-2xl z-50 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Review Questions</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors"><FiX size={28} /></button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {questions.map((_, index) => {
                const isAttempted = userAnswers[index] !== undefined;
                const isCurrent = index === currentQuestionIndex;
                const isMarkedForReview = reviewLaterQuestions.includes(index);

                let statusClass = 'bg-gray-200 hover:bg-gray-300 text-gray-700'; // Default
                if (isMarkedForReview) statusClass = 'bg-orange-400 hover:bg-orange-500 text-white ring-2 ring-orange-200';
                if (isAttempted) statusClass = 'bg-green-500 hover:bg-green-600 text-white';
                if (isCurrent) statusClass = 'bg-yellow-500 text-white ring-2 ring-yellow-300';

                return (
                  <button
                    key={index}
                    onClick={() => onQuestionSelect(index)}
                    className={`aspect-square rounded-lg flex items-center justify-center font-bold transition-all duration-200 ${statusClass}`}
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