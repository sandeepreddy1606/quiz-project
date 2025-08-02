'use client';

// Helper function to format time as MM:SS
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function Timer({ timeLeft }) {
  const isLowTime = timeLeft < 60;
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-3 rounded-xl shadow-lg">
      <p className={`text-2xl font-mono transition-colors duration-500 ${isLowTime ? 'text-red-400' : 'text-white'}`}>
        {formatTime(timeLeft)}
      </p>
    </div>
  );
}