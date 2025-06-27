import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/userdata`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
        }
      })
      .catch((err) => {
        console.error('Profile fetch error:', err.message);
        setError('Failed to fetch user data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <>
    <Header/>
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">👤 My Profile</h2>

      <div className="flex flex-col items-center">
        {user.profileImage ? (
          <>
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover mb-4"
            />
            <Link
              to="/profilesetup"
              className="text-blue-600 hover:underline text-sm mb-4"
            >
              Edit Profile
            </Link>
          </>
        ) : (
          <>
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-2">
              <span className="text-gray-600 text-sm">No Image</span>
            </div>
            <Link
              to="/profilesetup"
              className="text-blue-600 hover:underline text-sm mb-4"
            >
              Set Profile
            </Link>
          </>
        )}

        <div className="text-center">
          <p className="text-gray-700">
            <strong>Username:</strong> {user.name || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> {user.email || "N/A"}
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default Profile;
