'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiX, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePanel({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await fetch('http://localhost:5001/api/user/me', {
              headers: { 'auth-token': token }
            });
            if (response.ok) {
              const data = await response.json();
              setUser(data);
            }
          } catch (err) {
            console.error("Failed to fetch user:", err);
          }
        }
      };
      fetchUser();
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-40"
          onClick={onClose}
        >
          {/* --- CHANGES ARE IN THIS DIV --- */}
          <motion.div
            initial={{ x: '-100%' }} // Changed from '100%' to '-100%'
            animate={{ x: 0 }}
            exit={{ x: '-100%' }} // Changed from '100%' to '-100%'
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-full max-w-xs bg-white/80 backdrop-blur-xl border-r border-gray-200 shadow-2xl z-50 p-6 flex flex-col" // Changed right-0 to left-0 and border-l to border-r
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-800">Profile</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors"><FiX size={28} /></button>
            </div>
            {user ? (
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-6">
                  <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-amber-500" />
                  <div>
                    <p className="font-bold text-lg text-slate-800">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading profile...</p>
            )}
            <button onClick={handleLogout} className="w-full mt-auto py-3 flex items-center justify-center gap-3 font-semibold text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition-all">
              <FiLogOut />
              Logout
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}