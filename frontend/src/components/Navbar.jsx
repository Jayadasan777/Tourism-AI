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
    <nav className="sticky top-0 z-50 glass-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
              🧭
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-text-primary tracking-tight">
                Smart Tour AI
              </span>
              <span className="text-[10px] text-accent-violet tracking-wider uppercase font-mono">
                SIH 2026
              </span>
            </div>
          </Link>

          {/* Navigation Controls */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/plan"
                  className="nav-link font-medium text-sm"
                >
                  Plan Trip
                </Link>
                <Link
                  to="/nearby"
                  className="nav-link font-medium text-sm inline-flex items-center gap-1"
                >
                  <span>🎯</span>
                  <span>Nearby Radar</span>
                </Link>
                <Link
                  to="/status"
                  className="nav-link font-medium text-sm inline-flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
                  <span>Status</span>
                </Link>
                <span className="text-xs font-mono text-text-muted hidden sm:block max-w-[130px] truncate">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nav-link font-medium text-sm"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm px-5 py-2 rounded-lg">
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
