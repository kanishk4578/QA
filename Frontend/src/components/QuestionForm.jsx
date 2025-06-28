import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { motion } from 'framer-motion';

function QuestionForm() {
  const [text, setText] = useState('');
  const navigate = useNavigate();

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

  return (
  <>
    <Header />
    <form
      onSubmit={submitHandler}
      className="flex flex-col gap-4 max-w-2xl mx-auto px-4 py-8"
    >
      <h1 className="text-blue-600 font-semibold text-3xl text-center mb-4 flex items-center justify-center gap-1">
                Ask Your Question
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-red-600 font-bold text-5xl"
                >
                  ?
                </motion.span>
      </h1>

      <textarea
        className="min-h-[100px] border border-indigo-400 p-3 text-black bg-white rounded-md resize-y"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Your question'
      />

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-6 rounded-md text-lg hover:bg-blue-600 disabled:opacity-50"
      >
        Post Question
      </button>
    </form>
  </>
);
}

export default QuestionForm;