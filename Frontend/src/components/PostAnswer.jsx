import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import { motion } from 'framer-motion';

function PostAnswer() {
  const { questionId } = useParams();
  const [text, setText] = useState('');
  const [user, setUser] = useState({});
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`${import.meta.env.VITE_BASE_URL}/users/userdata`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err.message);
        setError('Failed to load user data.');
      });

    axios.get(`${import.meta.env.VITE_BASE_URL}/question/get/${questionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setQuestion(res.data);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching question:', err);
        setError('Failed to load question. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [questionId]);

  const answerSubmitHandler = async (e) => {
    e.preventDefault();
    if (!text.trim() || !question) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/answer/write`,
        { answerText: text, userId: user._id, questionId: question._id }
      );
      
      if (response.status === 201) {
        setSuccess('Answer submitted successfully!');
        setText('');
        setTimeout(() => {
          navigate('/answer');
        }, 1500);
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-200 animate-pulse"></div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Loading question...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2"
            >
              Write Your Answer
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-blue-600 text-5xl"
              >
                .
              </motion.span>
            </motion.h1>
            <p className="text-gray-600 text-lg">
              Share your knowledge and help the community
            </p>
          </div>

          {/* Question Display Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Question
              </h2>
            </div>
            <div className="p-6">
              <div className="text-gray-800 text-lg leading-relaxed">
                {question ? question.questionText : 'No question available.'}
              </div>
              {question && (
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Posted recently
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    ID: {questionId}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Answer Form Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
              <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Your Answer
              </h2>
            </div>
            
            <form onSubmit={answerSubmitHandler} className="p-8 space-y-6">
              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-700 font-medium">{success}</p>
                  </div>
                </motion.div>
              )}

              {/* Textarea */}
              <div className="space-y-2">
                <label htmlFor="answerText" className="block text-sm font-semibold text-gray-700">
                  Your Answer
                </label>
                <div className="relative">
                  <textarea
                    id="answerText"
                    rows="10"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-y text-gray-800 placeholder-gray-500"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your detailed answer here... Be specific and helpful!"
                    disabled={submitting}
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                    {text.length} characters
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Provide a detailed, helpful answer to earn community recognition</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={!text.trim() || submitting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-green-200 flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Answer
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-gray-200 flex items-center justify-center border border-gray-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>

          {/* Tips Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Tips for Writing Great Answers
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start text-blue-700">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Be specific and provide detailed explanations</span>
                </div>
                <div className="flex items-start text-blue-700">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Use examples to illustrate your points</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start text-blue-700">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Check your grammar and spelling</span>
                </div>
                <div className="flex items-start text-blue-700">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Stay on topic and answer the question directly</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default PostAnswer;