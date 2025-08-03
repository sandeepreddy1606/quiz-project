'use client';
import { useState, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
        {user?.profilePicture ? (
          <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
        ) : (
          <FiUser className="text-gray-600" size={24} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl p-4 z-50 border"
          >
            <p className="font-bold text-gray-800">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}