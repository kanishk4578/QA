import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const socket = io(import.meta.env.VITE_BASE_URL, { autoConnect: true });

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

function HomeDashboard() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Fetch user & question data
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

  // Real-time socket listener
  useEffect(() => {
    socket.on('new-question', question => {
      setQuestions(prev => [question, ...prev]);
    });
    return () => socket.off('new-question');
  }, []);

  // Answer submission
  const submitAnswer = async (questionId) => {
    if (!answers[questionId]) return;
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/answers`, {
        userId: user?._id,
        questionId,
        answerText: answers[questionId]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnswers(prev => ({ ...prev, [questionId]: '' }));
      alert('Answer submitted!');
    } catch (err) {
      alert('Failed to submit answer.');
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Welcome animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-amber-950 mb-10 text-center"
        >
          {`Welcome, ${user?.name || 'User'}!`.split('').map((char, index) => (
            <motion.span key={index} variants={letterVariants} className="inline-block">
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Admin-only: Post question */}
        {user?.email === 'lucia@gmail.com' && (
          <div className="text-center mb-8">
            <Link
              to="/question"
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
            >
              ➕ Post New Question
            </Link>
          </div>
        )}

        {/* Questions Section */}
        <h3 className="text-2xl sm:text-3xl font-semibold text-red-600 mb-6 text-center">
          Live Questions
        </h3>

        {loading ? (
          <p className="text-center text-lg text-gray-600">Loading...</p>
        ) : Array.isArray(questions) && questions.length > 0 ? (
          questions.map(q => (
            <div
              key={q._id}
              className="border border-gray-300 bg-white rounded p-4 mb-6 shadow hover:shadow-md transition"
            >
              <strong className="block text-lg mb-2 text-gray-800">{q.questionText}</strong>
              <div className="flex flex-wrap gap-3 mt-2">
                {user?.email === 'lucia@gmail.com' ? (
                  <>
                    <Link
                      to={`/edit/${q._id}`}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Edit Question
                    </Link>
                    <Link
                      to={`/summary/${q._id}`}
                      className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800 transition"
                    >
                      View AI Summary
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/question"
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Submit Answer
                    </Link>
                    <Link
                      to={`/summary/${q._id}`}
                      className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800 transition"
                    >
                      View AI Summary
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-xl text-black">
            No questions found{'.'.repeat(dotCount)}
          </p>
        )}
      </div>
    </>
  );
}

export default HomeDashboard;
