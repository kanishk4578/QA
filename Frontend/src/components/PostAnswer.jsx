import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import { motion } from 'framer-motion';

function PostAnswer() {
  const {questionId} = useParams();
  const [text, setText] = useState('');
  const [user, setUser] = useState({});
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
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
      });

    axios.get(`${import.meta.env.VITE_BASE_URL}/question/get/${questionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setQuestion(res.data);
      })
      .catch(err => {
        console.error('Error fetching question:', err);
        alert('Failed to load question.');
      })
      .finally(() => setLoading(false));
  }, [questionId]);

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
      onSubmit={answerSubmitHandler}
      className="flex flex-col gap-4 max-w-2xl mx-auto px-4 py-8"
    >
      <h1 className="text-blue-600 font-semibold text-3xl text-center mb-4 flex items-center justify-center gap-1">
            Write Your Answer
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-red-600 font- text-5xl mb-4"
            >
        .
            </motion.span>
      </h1>
        <div className="mb-2">
          <strong>Question:</strong>
          <div className="mt-1 p-3 border rounded bg-gray-50">
            {question ? question.questionText : 'No question available.'}
          </div>
        </div>

      <textarea
        className="min-h-[100px] border border-indigo-400 p-3 text-black bg-white rounded-md resize-y"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Your answer'
      />

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-6 rounded-md text-lg hover:bg-blue-600 disabled:opacity-50"
      >
        Submit Answer
      </button>
    </form>
  </>
);

}

export default PostAnswer;