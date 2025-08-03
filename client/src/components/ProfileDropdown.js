'use client';
import { useState, useEffect, useRef } from 'react';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('http://localhost:5001/api/user/me', {
          headers: { 
            'auth-token': token,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/auth');
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="relative">
        <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
      >
        <FiUser size={18} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 min-w-[250px] z-50"
          >
            {user ? (
              <div className="space-y-3">
                <div className="border-b border-gray-700 pb-3">
                  <div className="font-medium text-white">
                    {user.firstName || user.name || 'User'} {user.lastName || ''}
                  </div>
                  <div className="text-sm text-gray-400 mt-1 break-all">
                    {user.email}
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ backgroundColor: '#374151' }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full text-left px-2 py-2 text-red-400 hover:text-red-300 rounded transition-colors"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                No user data available
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
