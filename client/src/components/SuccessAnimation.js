import { motion } from 'framer-motion';

export default function SuccessAnimation({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center"
    >
      <motion.svg
        className="w-24 h-24 mb-4"
        viewBox="0 0 52 52"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="26" cy="26" r="25"
          fill="none"
          stroke="#34D399" // Emerald-400
          strokeWidth="3"
          initial={{ strokeDasharray: "0 157" }}
          animate={{ strokeDasharray: "157 157" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M14 27l8 8 16-16"
          fill="none"
          stroke="#34D399"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
        />
      </motion.svg>
      <p className="text-xl font-semibold text-white">{message}</p>
    </motion.div>
  );
}