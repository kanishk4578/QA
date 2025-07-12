import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [username, setUsername] = useState('');
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menu-container')) {
        setShowMenu(false);
        setShowNavMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
    setShowMenu(false);
  };

  const profileImage =
    user.profileImage ||
    'https://tse2.mm.bing.net/th?id=OIP.Hrxs5FpBvIjVQFd8wS69sQAAAA&pid=Api&P=0&h=180';

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children, className = "", onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isActivePath(to)
          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
          : 'text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:shadow-md'
      } ${className}`}
    >
      {children}
      {isActivePath(to) && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
      )}
    </Link>
  );

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/Logo.png"
                alt="Logo"
                className="h-10 sm:h-12 object-contain rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                RashtrSetu
              </h1>
              <p className="text-xs text-gray-500 font-medium">Bridge to Democracy</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <NavLink to="/">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </span>
              </NavLink>
              <NavLink to="/dashboard">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </span>
              </NavLink>
            </nav>

            {/* Mobile Navigation Menu */}
            <div className="lg:hidden relative menu-container">
              <button
                onClick={() => setShowNavMenu(!showNavMenu)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {showNavMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 animate-in slide-in-from-top-2 duration-200">
                  <NavLink 
                    to="/" 
                    onClick={() => setShowNavMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 mx-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </NavLink>
                  <NavLink 
                    to="/dashboard" 
                    onClick={() => setShowNavMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 mx-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Dashboard
                  </NavLink>
                </div>
              )}
            </div>

            {/* User Profile Section */}
            <div className="relative menu-container">
              <div className="flex items-center gap-3">
                {/* Username Display (Desktop) */}
                {isAuthenticated && (
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-gray-700">
                      {loading ? 'Loading...' : (user.name || username)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email || 'user@example.com'}
                    </p>
                  </div>
                )}

                {/* Profile Avatar */}
                <div
                  onClick={() => setShowMenu(!showMenu)}
                  className="relative cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full border-3 border-gradient-to-r from-blue-500 to-indigo-500 p-0.5 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <img
                      src={
                        isAuthenticated
                          ? profileImage
                          : 'https://cdn-icons-png.flaticon.com/512/6159/6159448.png'
                      }
                      alt="avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  {isAuthenticated && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
              </div>

              {/* Profile Dropdown */}
              {showMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 animate-in slide-in-from-top-2 duration-200">
                  {isAuthenticated ? (
                    <>
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">
                          {user.name || username}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.email || 'user@example.com'}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                        onClick={() => {
                          setShowMenu(false);
                          navigate('/profile');
                        }}
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium text-gray-700">Profile</span>
                      </button>
                      
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3 text-red-600"
                        onClick={handleLogout}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                        onClick={() => {
                          setShowMenu(false);
                          navigate('/login');
                        }}
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium text-gray-700">Login</span>
                      </button>
                      
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                        onClick={() => {
                          setShowMenu(false);
                          navigate('/register');
                        }}
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span className="font-medium text-gray-700">Register</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;