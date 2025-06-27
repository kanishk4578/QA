import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';

function EditQuestion() {
  const { questionId } = useParams();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !questionId) return;

    axios.get(`${import.meta.env.VITE_BASE_URL}/question/get/${questionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setText(res.data.questionText);
      })
      .catch(err => {
        console.error('Error fetching question:', err);
        alert('Failed to load question for editing.');
      })
      .finally(() => setLoading(false));
  }, [questionId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_BASE_URL}/question/edit/${questionId}`, {
        questionText: text
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Question updated!');
      navigate('/');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update question.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Header />
      <form
        onSubmit={handleUpdate}
        className="flex flex-col gap-4 p-8 max-w-2xl mx-auto"
      >
        <h1 className="text-blue-900 text-3xl mb-4">Edit Your Question</h1>
        <textarea
          rows="6"
          className="border-2 border-indigo-400 p-3 rounded-md w-full resize-none text-black"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Update your question..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md text-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={!text.trim()}
        >
          Update Question
        </button>
      </form>
    </>
  );
}

export default EditQuestion;
