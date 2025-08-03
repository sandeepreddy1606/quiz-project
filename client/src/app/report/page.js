'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheck, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ReportPage() {
  const [reportData, setReportData] = useState(null);
  const [score, setScore] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // On page load, retrieve the results from localStorage
    const results = localStorage.getItem('quizResults');
    if (results) {
      const parsedResults = JSON.parse(results);
      setReportData(parsedResults);

      // Calculate the user's score
      let calculatedScore = 0;
      parsedResults.questions.forEach((q, index) => {
        if (parsedResults.userAnswers[index] === q.correct_answer) {
          calculatedScore++;
        }
      });
      setScore(calculatedScore);

      // IMPORTANT: Clean up localStorage after loading the data
      // This prevents showing old results if the user takes another quiz
      localStorage.removeItem('quizResults');
    } else {
      // If no results are found in storage, the user probably hasn't
      // finished a quiz, so we redirect them.
      router.push('/quiz');
    }
  }, [router]);

  // Show a loading message while we process the results
  if (!reportData) {
    return <div className="flex justify-center items-center min-h-screen">Loading Report...</div>;
  }

  const { questions, userAnswers } = reportData;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-lg text-center mb-8 border"
        >
          <h1 className="text-4xl font-bold text-slate-800">Quiz Complete!</h1>
          <p className="text-lg text-slate-500 mt-2">Here's how you did:</p>
          <div className="mt-6">
            <p className="text-6xl font-bold text-amber-500">
              {score} <span className="text-3xl text-slate-400">/ {questions.length}</span>
            </p>
            <p className="text-xl font-semibold text-slate-600 mt-2">Correct Answers</p>
          </div>
        </motion.div>

        <h2 className="text-2xl font-bold text-slate-700 mb-6">Detailed Review</h2>
        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const correctAnswer = question.correct_answer;
            const isCorrect = userAnswer === correctAnswer;

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-md border"
              >
                <p className="text-lg font-semibold text-slate-800 mb-4" dangerouslySetInnerHTML={{ __html: `${index + 1}. ${question.question}` }} />
                <div className="space-y-2">
                  {question.choices.map((choice) => {
                    const isUserChoice = choice === userAnswer;
                    const isCorrectChoice = choice === correctAnswer;
                    
                    let choiceClass = 'border-slate-200 bg-slate-50 text-slate-700';
                    let icon = null;

                    // Style for the correct answer
                    if (isCorrectChoice) {
                      choiceClass = 'border-emerald-300 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200';
                      icon = <FiCheck className="text-emerald-500" />;
                    }
                    // Style for the user's incorrect answer
                    if (isUserChoice && !isCorrect) {
                      choiceClass = 'border-red-300 bg-red-50 text-red-800 ring-2 ring-red-200';
                      icon = <FiX className="text-red-500" />;
                    }

                    return (
                      <div key={choice} className={`flex items-center justify-between p-3 rounded-lg border-2 ${choiceClass}`}>
                        <span dangerouslySetInnerHTML={{ __html: choice }} />
                        {icon}
                      </div>
                    );
                  })}
                  {!userAnswer && (
                    <div className="p-3 rounded-lg border-2 border-slate-200 bg-slate-50 text-slate-500 italic">
                        No answer submitted.
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="text-center mt-8">
            <button onClick={() => router.push('/quiz')} className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 shadow-lg transition-all">
                Try Another Quiz
            </button>
        </div>
      </div>
    </div>
  );
}