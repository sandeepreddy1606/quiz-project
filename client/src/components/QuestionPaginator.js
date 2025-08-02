'use client';

// This component displays a dynamic list of 5 question numbers
export default function QuestionPaginator({ total, current, onQuestionSelect }) {
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(0, current - 2);
    let endPage = Math.min(total - 1, current + 2);

    if (current < 2) {
      endPage = Math.min(4, total - 1);
    }
    if (current > total - 3) {
      startPage = Math.max(0, total - 5);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      {pages.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onQuestionSelect(pageNum)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-all
            ${current === pageNum ? 'bg-blue-600 text-white scale-110' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
          `}
        >
          {pageNum + 1}
        </button>
      ))}
      <span className="ml-2 text-2xl font-light text-gray-500">/ {total}</span>
    </div>
  );
}