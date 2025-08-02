'use client';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, imageFirst = false }) {
  const imageVariants = {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
  };

  const formVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  const imagePanel = (
    <motion.div
      variants={imageVariants}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="hidden lg:block relative"
    >
      <img
        src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop"
        alt="Collaborative team working"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
      <motion.div
        initial="initial"
        animate="animate"
        layout
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {imageFirst && imagePanel}
        <motion.div variants={formVariants} transition={{ duration: 0.5, delay: 0.3 }} className="p-8 md:p-12">
          {children}
        </motion.div>
        {!imageFirst && imagePanel}
      </motion.div>
    </div>
  );
}