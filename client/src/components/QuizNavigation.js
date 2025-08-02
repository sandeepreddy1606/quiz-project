'use client';

export default function QuizNavigation({ onPrevious, onNext, onSubmit, isFirstQuestion, isLastQuestion }) {
  return (
    <footer className="mt-8 flex justify-between items-center">
      <button
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className="px-8 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl font-semibold hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Previous
      </button>

      {isLastQuestion ? (
        <button
          onClick={onSubmit}
          className="px-8 py-3 bg-green-500 rounded-xl font-semibold hover:bg-green-600 transition-all shadow-lg"
        >
          Submit Quiz
        </button>
      ) : (
        <button
          onClick={onNext}
          className="px-8 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
        >
          Next
        </button>
      )}
    </footer>
  );
}