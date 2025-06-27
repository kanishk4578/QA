import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { useParams } from 'react-router-dom';

function Summary() {
  const { questionId } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${import.meta.env.VITE_BASE_URL}/summary/summaries/${questionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setSummary(res.data.summary);
      })
      .catch(err => {
        console.error("Failed to fetch summary:", err);
        setSummary(null);
      })
      .finally(() => setLoading(false));
  }, [questionId]);

  return (
    <>
      <Header />
      <div className="min-h-screen px-4 py-10 flex justify-center items-start">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-3xl font-semibold text-blue-800 mb-6 text-center">📄 Summary</h2>
          
          {loading ? (
            <p className="text-gray-600 text-center">Loading...</p>
          ) : summary ? (
            <div className="border border-gray-300 rounded-md bg-gray-100 p-4 text-gray-800">
              <h3 className="text-lg font-medium mb-2">Generated Summary:</h3>
              <p className="leading-relaxed whitespace-pre-wrap">{summary}</p>
            </div>
          ) : (
            <p className="text-red-500 text-center">No summary found for this question.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Summary;
