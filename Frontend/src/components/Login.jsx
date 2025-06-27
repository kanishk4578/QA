import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        navigate('/');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        alert("Wrong email or password");
        navigate('/login');
      } else {
        alert("Login failed. Please try again.");
      }
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Login</h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          New here?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Create your account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
