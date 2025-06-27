import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {io} from 'socket.io-client';
import Header from './Header';

// Connect to the socket server using env variable
const socket = io(import.meta.env.VITE_BASE_URL);

function Dashboard() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions on mount
    axios.get(`${import.meta.env.VITE_BASE_URL}/question/read`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.questions;
        setQuestions(data || []);
      })
      .catch(err => {
        console.error("Failed to fetch questions:", err);
        setQuestions([]);
      });

    // Listen for new questions via socket
    socket.on('new-question', question => {
      setQuestions(prev => [question, ...prev]);
    });

    // Cleanup socket on unmount
    return () => {
      socket.off('new-question');
      socket.disconnect();
    };
  }, []);

return (
  <>
    <Header />
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Questions
      </h2>

      <ul className="space-y-4">
        {Array.isArray(questions) && questions.length > 0 ? (
          questions.map(q => (
            <li
              key={q._id}
              className="p-5 bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <p className="text-lg font-medium text-gray-800">{q.questionText}</p>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500 text-lg">No questions found</li>
        )}
      </ul>
    </div>
  </>
);

}

export default Dashboard;