import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [adhaar, setAdhaar] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, {
        name, email, adhaar, password
      });

      console.log("Backend response:", res);

      if (res.status === 201) {
        localStorage.setItem('token', res.data.token);
        navigate('/');
      } else {
        console.warn("Unexpected response:", res.status);
      }

    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,_#7b66ff_0%,_#a08eff_50%,_#d6ccff_100%)] px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-semibold text-blue-900 text-center mb-6">Create Account</h2>
        
        <form onSubmit={submitHandler} className="flex flex-col space-y-4">
          <input
            placeholder="Adhaar Number"
            value={adhaar}
            onChange={(e) => setAdhaar(e.target.value)}
            className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-medium transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Please Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
