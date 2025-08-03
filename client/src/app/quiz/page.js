'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileDropdown from '../../components/ProfileDropdown';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Your timer and submission logic can be added back here
  // For clarity, this version focuses on the UI and layout fix

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth'); return; }

    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=15&type=multiple');
        const formatted = response.data.results.map(q => ({...q, choices: shuffleArray([...q.incorrect_answers, q.correct_answer])}));
        setQuestions(formatted);
      } catch (error) { console.error("Failed to fetch questions:", error); } 
      finally { setIsLoading(false); }
    };
    fetchQuestions();
  }, [router]);

  const handleAnswerSelect = (answer) => setUserAnswers({ ...userAnswers, [currentQuestionIndex]: answer });
  const handleNext = () => { if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1) };
  const handlePrevious = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1) };
  const handleSubmit = () => { console.log("Submitting Quiz:", userAnswers); alert("Quiz Submitted!"); };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen text-xl font-semibold">Loading Quiz...</div>;
  if (questions.length === 0) return <div className="flex justify-center items-center min-h-screen">Failed to load questions.</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-8 bg-gray-50">
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-6">
        <ProfileDropdown />
        {/* You can add your timer component here */}
      </header>
      
      {/* Main content area that grows to push the footer down */}
      <main className="flex-grow flex items-center w-full">
        <div className="w-full max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-xl border">
                <p className="text-lg font-semibold text-yellow-600 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <h2 className="text-3xl font-bold text-gray-800" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.choices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => handleAnswerSelect(choice)}
                      className={`p-4 w-full rounded-xl text-left font-semibold transition-all duration-200 border-2
                        ${userAnswers[currentQuestionIndex] === choice 
                          ? 'bg-yellow-500 text-white border-yellow-500 ring-2 ring-yellow-300' 
                          : 'bg-gray-100 border-gray-200 hover:bg-yellow-100 hover:border-yellow-300'}
                      `}
                      dangerouslySetInnerHTML={{ __html: choice }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer with navigation buttons that STAYS IN THE SAME PLACE */}
      <footer className="w-full max-w-3xl mx-auto mt-8">
        <div className="flex justify-between">
          <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="px-8 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-all">
            Previous
          </button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <button onClick={handleNext} className="px-8 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 shadow-lg transition-all">
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} className="px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 shadow-lg transition-all">
              Submit
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}