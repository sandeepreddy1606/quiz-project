'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBookmark, FiMenu, FiUser, FiRefreshCw } from 'react-icons/fi';

// Import all our components
import ProfilePanel from '../../components/ProfilePanel';
import AnimatedTimer from '../../components/AnimatedTimer';
import ReviewPanel from '../../components/ReviewPanel';
import QuestionPaginator from '../../components/QuestionPaginator';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [reviewLater, setReviewLater] = useState([]);
  const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);

  // --- THIS IS THE CORRECTED SUBMIT FUNCTION ---
  const handleSubmit = useCallback(() => {
    // 1. Create a results object with the questions and the user's answers
    const quizResults = {
      questions,
      userAnswers,
    };
    // 2. Convert the object to a string and save it to the browser's localStorage
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    
    // 3. Navigate the user to the new report page
    router.push('/report');
  }, [questions, userAnswers, router]);

  const fetchAndSetQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://opentdb.com/api.php?amount=15&type=multiple');
      const formatted = response.data.results.map(q => ({...q, choices: shuffleArray([...q.incorrect_answers, q.correct_answer])}));
      setQuestions(formatted);
      sessionStorage.setItem('quizQuestions', JSON.stringify(formatted));
    } catch (error) {
      console.error("Failed to fetch new questions:", error);
      alert("Could not fetch new questions. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth'); return; }

    const savedQuestions = sessionStorage.getItem('quizQuestions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
      setIsLoading(false);
    } else {
      fetchAndSetQuestions();
    }
  }, [router, fetchAndSetQuestions]);
  
  const handleNewQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setReviewLater([]);
    fetchAndSetQuestions();
  };

  const handleAnswerSelect = (answer) => setUserAnswers({ ...userAnswers, [currentQuestionIndex]: answer });
  const handleNext = () => { if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1) };
  const handlePrevious = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1) };
  
  const handleToggleReviewLater = () => {
    setReviewLater(prev => 
      prev.includes(currentQuestionIndex)
        ? prev.filter(index => index !== currentQuestionIndex)
        : [...prev, currentQuestionIndex]
    );
  };
  
  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    setIsReviewPanelOpen(false);
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen text-xl font-semibold">Loading Quiz...</div>;
  if (questions.length === 0) return <div className="flex justify-center items-center min-h-screen">Failed to load questions.</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const isMarkedForReview = reviewLater.includes(currentQuestionIndex);

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-8 bg-slate-100">
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={() => setIsProfilePanelOpen(true)} className="p-3 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <FiUser size={24} className="text-slate-700"/>
            </button>
            <button onClick={handleNewQuiz} className="p-3 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors" title="Get New Questions">
              <FiRefreshCw size={24} className="text-slate-700"/>
            </button>
        </div>
        <QuestionPaginator 
          total={questions.length} 
          current={currentQuestionIndex} 
          onQuestionSelect={setCurrentQuestionIndex} 
        />
        <div className="flex items-center gap-4">
          <AnimatedTimer duration={15 * 60} onTimeUp={handleSubmit} />
          <button 
            onClick={() => setIsReviewPanelOpen(true)}
            className="p-3 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <FiMenu size={24} className="text-slate-700"/>
          </button>
        </div>
      </header>
      
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
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                <p className="text-lg font-semibold text-amber-600 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <h2 className="text-3xl font-bold text-slate-800" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.choices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => handleAnswerSelect(choice)}
                      className={`p-4 w-full rounded-xl text-left font-semibold transition-all duration-200 border-2
                        ${userAnswers[currentQuestionIndex] === choice 
                          ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-300' 
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-amber-100 hover:border-amber-300'}
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

      <footer className="w-full max-w-3xl mx-auto mt-8">
        <div className="flex justify-between items-center">
          <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="px-8 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-all">
            Previous
          </button>
          
          <button 
            onClick={handleToggleReviewLater}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2
              ${isMarkedForReview 
                ? 'bg-orange-100 text-orange-600 border-orange-200' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}
            `}
          >
            <FiBookmark className={isMarkedForReview ? 'fill-current' : ''}/>
            {isMarkedForReview ? 'Marked' : 'Review Later'}
          </button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <button onClick={handleNext} className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 shadow-lg transition-all">
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-lg transition-all">
              Submit
            </button>
          )}
        </div>
      </footer>

      <ReviewPanel 
        isOpen={isReviewPanelOpen}
        onClose={() => setIsReviewPanelOpen(false)} 
        questions={questions} 
        userAnswers={userAnswers}
        currentQuestionIndex={currentQuestionIndex}
        onQuestionSelect={handleQuestionSelect}
        reviewLaterQuestions={reviewLater}
      />
      <ProfilePanel 
        isOpen={isProfilePanelOpen}
        onClose={() => setIsProfilePanelOpen(false)}
      />
    </div>
  );
}