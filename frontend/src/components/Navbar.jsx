import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700">
          FullstackApp
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/create"
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                + New Post
              </Link>
              <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900">
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
