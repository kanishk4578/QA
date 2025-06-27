import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { motion } from 'framer-motion';

function QuestionForm() {
  const [text, setText] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState({});
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch user data
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/userdata`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        if (response.status === 200 && response.data.email === 'lucia@gmail.com') {
          setIsAdmin(true);
        }
        setUser(response.data);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err.message);
      });

    // Fetch a question for answering (if not admin)
    axios.get(`${import.meta.env.VITE_BASE_URL}/question/read`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        // Get the first question (customize as needed)
        const data = Array.isArray(response.data) ? response.data : response.data.questions;
        if (data && data.length > 0) {
          setQuestion(data[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch question:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/question/ask`,
        { questionText: text }
      );
      if (response.status === 201) {
        navigate('/dashboard');
      }
      setText('');
    } catch (err) {
      alert('Failed to post question.');
    }
  };

  const answerSubmitHandler = async (e) => {
    e.preventDefault();
    if (!text.trim() || !question) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/answer/write`,
        { answerText: text, userId: user._id, questionId: question._id }
      );
      if (response.status === 201) {
        navigate('/answer');
      }
      setText('');
    } catch (err) {
      alert('Failed to submit answer.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  return (
  <>
    <Header />
    <form
      onSubmit={isAdmin ? submitHandler : answerSubmitHandler}
      className="flex flex-col gap-4 max-w-2xl mx-auto px-4 py-8"
    >
      <h1 className="text-blue-600 font-semibold text-3xl text-center mb-4 flex items-center justify-center gap-1">
            {isAdmin ? (
              <>
                Ask Your Question
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-red-600 font-bold text-5xl"
                >
                  ?
          </motion.span>
              </>
            ) : (
          <>
            Write Your Answer
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-red-600 font- text-5xl mb-4"
            >
        .
            </motion.span>
          </>
        )}
      </h1>
      {!isAdmin && (
        <div className="mb-2">
          <strong>Question:</strong>
          <div className="mt-1 p-3 border rounded bg-gray-50">
            {question ? question.questionText : 'No question available.'}
          </div>
        </div>
      )}

      <textarea
        className="min-h-[100px] border border-indigo-400 p-3 text-black bg-white rounded-md resize-y"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isAdmin ? 'Your question' : 'Your answer'}
      />

      <button
        type="submit"
        disabled={!text.trim() || (!isAdmin && !question)}
        className="bg-blue-500 text-white py-2 px-6 rounded-md text-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isAdmin ? 'Post Question' : 'Submit Answer'}
      </button>
    </form>
  </>
);

}

export default QuestionForm;