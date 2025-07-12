import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';

function AnswerList() {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);

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
      });

    axios.get(`${import.meta.env.VITE_BASE_URL}/answer/read`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setAnswers(res.data.answers || []);
      })
      .catch(err => {
        console.error("Failed to fetch answers:", err);
        setAnswers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const LoadingSkeleton = () => (
    <div className="space-y-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="animate-pulse">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-5 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-5 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-20">
      <div className="relative">
        <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
          <div className="relative">
            <svg className="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-4">No Answers Yet</h3>
        <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed mb-8">
          You haven't answered any questions yet. Start participating in discussions to see your contributions here.
        </p>
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Start Answering
        </div>
      </div>
    </div>
  );

  const AnswerCard = ({ answer, question }) => (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-8">
        {/* Question Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">Question</h3>
              <p className="text-lg font-bold text-gray-800 leading-tight group-hover:text-blue-700 transition-colors duration-200">
                {question.questionText}
              </p>
            </div>
          </div>
          
          {question.createdAt && (
            <div className="flex items-center text-sm text-gray-500 ml-15">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Asked {formatDate(question.createdAt)}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-6"></div>

        {/* Answer Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-1">Your Answer</h4>
              <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-green-500">
                <p className="text-gray-800 leading-relaxed text-base">
                  {answer.answerText}
                </p>
              </div>
            </div>
          </div>
          
          {answer.createdAt && (
            <div className="flex items-center text-sm text-gray-500 ml-15">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Answered {formatDate(answer.createdAt)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-600">Answered</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {user?.name || 'You'}
          </div>
        </div>
      </div>
    </div>
  );

  const validAnswers = answers.filter(ans => {
    const question = questions.find(q => q._id === ans.questionId);
    return question;
  });

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
              Your Answers
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Review all the questions you've answered and track your contributions to the community
            </p>
          </div>

          {/* Stats Section */}
          {!loading && validAnswers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">{validAnswers.length}</p>
                    <p className="text-gray-600">Total Answers</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">Active</p>
                    <p className="text-gray-600">Contributor</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">{user?.name?.split(' ')[0] || 'You'}</p>
                    <p className="text-gray-600">Account</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="space-y-8">
            {loading ? (
              <LoadingSkeleton />
            ) : validAnswers.length === 0 ? (
              <EmptyState />
            ) : (
              validAnswers.map((answer) => {
                const question = questions.find(q => q._id === answer.questionId);
                return (
                  <AnswerCard 
                    key={answer._id} 
                    answer={answer} 
                    question={question}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AnswerList;