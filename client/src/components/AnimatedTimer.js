'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function AnimatedTimer({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / duration) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute w-full h-full" viewBox="0 0 70 70">
        {/* Background Circle */}
        <circle
          cx="35"
          cy="35"
          r={radius}
          stroke="#e5e7eb" // gray-200
          strokeWidth="5"
          fill="transparent"
        />
        {/* Progress Circle */}
        <motion.circle
          cx="35"
          cy="35"
          r={radius}
          stroke="#f59e0b" // yellow-500
          strokeWidth="5"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: "linear" }}
          transform="rotate(-90 35 35)"
        />
      </svg>
      <span className="relative font-bold text-lg text-gray-800">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}