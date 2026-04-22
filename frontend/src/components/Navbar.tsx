import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../services/store';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">🎓 PLAQUE</div>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-gray-600">Welcome, {user.username}</span>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/login';
                  }}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
