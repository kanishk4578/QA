import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

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
    <div className="text-center py-16">
      <div className="relative">
        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">No Questions Yet</h3>
        <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
          Start your journey by asking your first question. Your question history will appear here.
        </p>
      </div>
    </div>
  );

  const QuestionCard = ({ question }) => (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-200 leading-tight">
              {question.questionText}
            </h4>
            {question.createdAt && (
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDate(question.createdAt)}
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {user?.email === 'lucia@gmail.com' ? (
            <Link
              to={`/summary/${question._id}`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Summary
            </Link>
          ) : (
            <>
              <Link
                to="/answer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
              >
                <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Answers
              </Link>
              <Link
                to={`/summary/${question._id}`}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
              >
                <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Summary
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-4">
              Question History
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Track your questions and explore the insights you've gathered over time
            </p>
          </div>

          {/* Stats Section */}
          {!loading && questions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">{questions.length}</p>
                    <p className="text-gray-600">Total Questions</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">Active</p>
                    <p className="text-gray-600">Status</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-800">{user?.email?.split('@')[0] || 'User'}</p>
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
            ) : Array.isArray(questions) && questions.length > 0 ? (
              questions.map(question => (
                <QuestionCard key={question._id} question={question} />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;