import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: '0.3em' },
  visible: {
    opacity: 1,
    y: '0em',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const isWithinTimeLimit = (createdAt, hours) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMs = now - created;
  const limitInMs = hours * 60 * 60 * 1000;
  return diffInMs <= limitInMs;
};

function HomeDashboard() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dotCount, setDotCount] = useState(1);
  const [increasing, setIncreasing] = useState(true);

  // Dot animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prev => {
        if (increasing) {
          if (prev >= 6) {
            setIncreasing(false);
            return prev - 1;
          }
          return prev + 1;
        } else {
          if (prev <= 1) {
            setIncreasing(true);
            return prev + 1;
          }
          return prev - 1;
        }
      });
    }, 300);
    return () => clearInterval(interval);
  }, [increasing]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`${import.meta.env.VITE_BASE_URL}/users/userdata`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(err => console.error("Profile fetch error:", err.message));

    axios.get(`${import.meta.env.VITE_BASE_URL}/question/read`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.questions;
        setQuestions(data || []);
      })
      .catch(err => {
        console.error("Failed to fetch questions:", err);
        setQuestions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInMs = now - created;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInHours >= 1) {
      return `${diffInHours}h ago`;
    } else if (diffInMinutes >= 1) {
      return `${diffInMinutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const liveQuestions = questions.filter(q => isWithinTimeLimit(q.createdAt, 24));

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="animate-pulse">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="h-6 bg-gray-300 rounded-lg w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
            <div className="flex gap-3">
              <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
              <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-20"
    >
      <div className="relative">
        <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 rounded-full flex items-center justify-center shadow-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-20 h-20 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          No live questions found{'.'.repeat(dotCount)}
        </h3>
        <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
          Questions appear here when they're posted within the last 24 hours. Check back soon for new discussions!
        </p>
      </div>
    </motion.div>
  );

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-800 via-amber-900 to-amber-950 bg-clip-text text-transparent mb-6"
            >
              {`Welcome, ${user?.name || 'User'}!`.split('').map((char, index) => (
                <motion.span key={index} variants={letterVariants} className="inline-block">
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-gray-700 text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Discover live questions from the community and join the conversation
            </motion.p>
          </div>

          {/* Admin Action Button */}
          {user?.email === 'lucia@gmail.com' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-center mb-12"
            >
              <Link
                to="/question"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Post New Question
              </Link>
            </motion.div>
          )}

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </motion.div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-800">{liveQuestions.length}</p>
                  <p className="text-gray-600 font-medium">Live Questions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-800">24h</p>
                  <p className="text-gray-600 font-medium">Time Limit</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-800">Active</p>
                  <p className="text-gray-600 font-medium">Discussion</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg mb-6">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-4">
              Live Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Fresh questions from the last 24 hours
            </p>
          </motion.div>

          {/* Questions List */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="space-y-6"
          >
            {loading ? (
              <LoadingSkeleton />
            ) : liveQuestions.length > 0 ? (
              liveQuestions.map((question, index) => (
                <motion.div
                  key={question._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/30 hover:border-red-200 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full">
                              LIVE
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(question.createdAt)}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-red-700 transition-colors duration-200 leading-tight">
                          {question.questionText}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {user?.email === 'lucia@gmail.com' ? (
                        <>
                          <Link
                            to={`/edit/${question._id}`}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                          >
                            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Question
                          </Link>
                          <Link
                            to={`/summary/${question._id}`}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                          >
                            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Summary
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to={`/answers/${question._id}`}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                          >
                            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                            Submit Answer
                          </Link>
                          <Link
                            to={`/summary/${question._id}`}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                          >
                            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Summary
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <EmptyState />
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default HomeDashboard;