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

    // Fetch user data
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/userdata`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(err => console.error("Profile fetch error:", err.message));

    // Fetch questions
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

    // Fetch user's answers
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

  return (
    <>
      <Header />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-800 text-center">Your Answers</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : answers.length === 0 ? (
          <p className="text-center text-gray-600">You have not answered any questions yet.</p>
        ) : (
          <ul className="space-y-6">
            {answers.map((ans) => {
              const question = questions.find(q => q._id === ans.questionId);
              if (!question) return null;

              return (
                <li key={ans._id} className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition duration-300">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Question:</h3>
                    <p className="text-gray-700">{question.questionText}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-green-700 mb-1">Your Answer:</h4>
                    <p className="text-gray-800">{ans.answerText}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

export default AnswerList;
