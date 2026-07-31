import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../hooks/useDarkMode';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();

  const mockUserStr = localStorage.getItem('mockUser');
  const mockUser = mockUserStr ? JSON.parse(mockUserStr) : null;
  const isLoggedIn = user || mockUser;

  const handleLogout = async () => {
      try {
          if (user) await logout();
      } catch (e) {
          console.error(e);
      } finally {
          localStorage.removeItem('mockUser');
          const role = mockUser?.role || 'student';
          navigate(`/login?role=${role}`);
      }
  };

  return (
    <nav className="border-b border-gray-200 bg-white/75 backdrop-blur-md sticky top-0 z-50 dark:border-gray-800 dark:bg-gray-950/75">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">SmartLibrary</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isLoggedIn ? (
              <>
                <Link to={mockUser?.role === 'student' ? '/student/dashboard' : '/admin/dashboard'}>
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/login?role=admin">
                  <Button variant="primary">Admin Portal</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
