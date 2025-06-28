import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user,setUser] = useState({});

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



return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <h3 className="text-2xl sm:text-3xl font-semibold text-red-600 mb-6 text-center">
          History
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
                      to={`/summary/${q._id}`}
                      className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800 transition"
                    >
                      View Summary
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/answer"
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                    >
                      View Answers
                    </Link>
                    <Link
                      to={`/summary/${q._id}`}
                      className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800 transition"
                    >
                      View Summary
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-xl text-black">
            No questions found.
          </p>
        )}
      </div>
    </>
  );

}

export default Dashboard;