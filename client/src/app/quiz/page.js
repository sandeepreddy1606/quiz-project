'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiMenu } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import Timer from '../../components/Timer';
import ReviewPanel from '../../components/ReviewPanel';
import QuizNavigation from '../../components/QuizNavigation';
import QuestionPaginator from '../../components/QuestionPaginator';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    setIsQuizSubmitted(true);
    console.log("Quiz Submitted", userAnswers);
    // We'll build the report page next, for now, we just show a completion message.
  }, [userAnswers]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    axios.get('https://opentdb.com/api.php?amount=15&type=multiple')
      .then(response => {
        const formatted = response.data.results.map(q => ({...q, choices: shuffleArray([...q.incorrect_answers, q.correct_answer])}));
        setQuestions(formatted);
      })
      .catch(error => console.error("Failed to fetch questions:", error))
      .finally(() => setIsLoading(false));
  }, [router]);

  useEffect(() => {
    if (isLoading || isQuizSubmitted) return;
    if (timeLeft === 0) { handleSubmit(); return; }
    const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isLoading, isQuizSubmitted, handleSubmit]);

  const handleAnswerSelect = (answer) => setUserAnswers({ ...userAnswers, [currentQuestionIndex]: answer });
  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    setIsPanelOpen(false);
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen text-white text-2xl font-semibold">Preparing Your Challenge...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  if (isQuizSubmitted) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-white text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <h1 className="text-4xl font-bold">Quiz Complete!</h1>
          <p className="text-xl mt-4">You have successfully submitted your answers.</p>
          {/* We'll add a button to view the report here later */}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <div className="w-1/3"></div>
        <div className="w-1/3 flex justify-center">
          {questions.length > 0 && <QuestionPaginator total={questions.length} current={currentQuestionIndex} onQuestionSelect={setCurrentQuestionIndex} />}
        </div>
        <div className="w-1/3 flex justify-end items-center gap-4">
          <Timer timeLeft={timeLeft} />
          <button onClick={() => setIsPanelOpen(true)} className="p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:bg-white/20 transition-colors">
            <FiMenu size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl">
            <header className="mb-8">
              <p className="text-lg font-medium text-blue-400">Question {currentQuestionIndex + 1}</p>
              <h1 className="text-3xl font-bold mt-2 leading-tight" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {currentQuestion.choices.map((choice) => (
                <button key={choice} onClick={() => handleAnswerSelect(choice)}
                  className={`p-5 w-full rounded-xl text-left text-lg font-medium transition-all duration-200 border-2 
                    ${userAnswers[currentQuestionIndex] === choice ? 'bg-blue-600 border-blue-500 ring-2 ring-blue-400' : 'bg-slate-900/70 border-slate-700 hover:bg-slate-700/70'}`}
                  dangerouslySetInnerHTML={{ __html: choice }}
                />
              ))}
            </div>
          </div>
          <QuizNavigation
            onPrevious={() => setCurrentQuestionIndex(prev => prev - 1)}
            onNext={() => setCurrentQuestionIndex(prev => prev + 1)}
            onSubmit={handleSubmit}
            isFirstQuestion={currentQuestionIndex === 0}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />
        </motion.div>
      </AnimatePresence>

      <ReviewPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        questions={questions} 
        userAnswers={userAnswers}
        currentQuestionIndex={currentQuestionIndex}
        onQuestionSelect={handleQuestionSelect}
      />
    </div>
  );
}