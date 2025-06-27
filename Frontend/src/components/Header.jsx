import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [username, setUsername] = useState('');
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || 'User');
        setIsAuthenticated(true);
      } catch (err) {
        console.warn('Wrong email or password.');
      }
    } else {
      setIsAuthenticated(false);
    }

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const profileImage =
    user.profileImage ||
    'https://tse2.mm.bing.net/th?id=OIP.Hrxs5FpBvIjVQFd8wS69sQAAAA&pid=Api&P=0&h=180';

  return (
    <header className="bg-gray-100 shadow-sm py-4 px-6 flex justify-between items-center">
      <h3
        className="text-xl sm:text-2xl font-semibold cursor-pointer text-blue-700"
        onClick={() => navigate('/summary/:questionId')}
      >
        🧠 AI Q&A Portal
      </h3>

      <div className="flex items-center gap-6">
        {/* Navigation Links */}
        <div className="flex gap-4">
          <Link
            to="/"
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
          >
            Dashboard
          </Link>
        </div>

        {/* Avatar Dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowMenu(!showMenu)}
            className="w-12 h-12 rounded-full border-2 border-blue-500 cursor-pointer overflow-hidden"
          >
            <img
              src={isAuthenticated ? profileImage : 'https://cdn-icons-png.flaticon.com/512/6159/6159448.png'}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50 py-2">
              {isAuthenticated ? (
                <>
                  <p
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setShowMenu(false);
                      navigate('/profile');
                    }}
                  >
                    👤 Profile
                  </p>
                  <p
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setShowMenu(false);
                      handleLogout();
                    }}
                  >
                    🚪 Logout
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setShowMenu(false);
                      navigate('/login');
                    }}
                  >
                    🔐 Login
                  </p>
                  <p
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setShowMenu(false);
                      navigate('/register');
                    }}
                  >
                    📝 Register
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
