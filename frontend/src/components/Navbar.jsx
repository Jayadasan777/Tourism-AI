import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <span className="font-bold text-xl text-primary-700">Smart Tour AI</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/plan"
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Plan Trip
                </Link>
                <span className="text-sm text-gray-500 hidden sm:block">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="btn-secondary text-sm px-3 py-1.5"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
