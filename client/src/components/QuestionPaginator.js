'use client';

// This component displays a dynamic list of 5 question numbers
export default function QuestionPaginator({ total, current, onQuestionSelect }) {
  // This function calculates which 5 page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    // Start page is current - 2, but not less than 0
    let startPage = Math.max(0, current - 2);
    // End page is current + 2, but not more than the total
    let endPage = Math.min(total - 1, current + 2);

    // Adjust the range if we are near the beginning
    if (current < 2) {
      endPage = Math.min(4, total - 1);
    }
    // Adjust the range if we are near the end
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
    <div className="flex items-center justify-center gap-2 bg-white p-2 rounded-xl shadow-md border">
      {pages.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onQuestionSelect(pageNum)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-all
            ${current === pageNum 
              ? 'bg-yellow-500 text-white scale-110 shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'}
          `}
        >
          {pageNum + 1}
        </button>
      ))}
      <span className="ml-2 text-xl font-semibold text-gray-400">/ {total}</span>
    </div>
  );
}