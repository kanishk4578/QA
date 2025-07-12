import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';

function EditQuestion() {
  const { questionId } = useParams();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !questionId) return;

    axios.get(`${import.meta.env.VITE_BASE_URL}/question/get/${questionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setText(res.data.questionText);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching question:', err);
        setError('Failed to load question for editing. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [questionId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_BASE_URL}/question/edit/${questionId}`, {
        questionText: text
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Question updated successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to update question. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600 text-lg">Loading question...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Edit Your Question
            </h1>
            <p className="text-gray-600 text-lg">
              Make your question clearer and more engaging
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-white text-xl font-semibold">Question Editor</h2>
            </div>
            
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-700 font-medium">{success}</p>
                  </div>
                </div>
              )}

              {/* Textarea */}
              <div className="space-y-2">
                <label htmlFor="questionText" className="block text-sm font-semibold text-gray-700">
                  Question Text
                </label>
                <div className="relative">
                  <textarea
                    id="questionText"
                    rows="8"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-gray-800 placeholder-gray-500"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your question here..."
                    disabled={updating}
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                    {text.length} characters
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={!text.trim() || updating}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-200 flex items-center justify-center"
                >
                  {updating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Update Question
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={updating}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-gray-200 flex items-center justify-center border border-gray-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Tips for Better Questions
            </h3>
            <ul className="text-blue-700 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Be specific and clear about what you're asking
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Provide context when necessary
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Use proper grammar and spelling
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Keep it concise but comprehensive
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditQuestion;