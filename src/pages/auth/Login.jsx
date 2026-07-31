import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, UserCog, GraduationCap } from 'lucide-react';

export const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const role = searchParams.get('role') || 'student';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem('savedLogin');
    if (savedLogin) {
      try {
        const parsed = JSON.parse(savedLogin);
        if (parsed.email && parsed.password) {
          setEmail(parsed.email);
          setPassword(parsed.password);
          setRememberMe(true);
        }
      } catch (e) {
        console.error("Could not parse saved login");
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Handle Remember Me
    if (rememberMe) {
        localStorage.setItem('savedLogin', JSON.stringify({ email, password }));
    } else {
        localStorage.removeItem('savedLogin');
    }
    
    // Mock Admin Login Bypass
    if (!isStudent && email === 'admin@gmail.com' && password === 'admin@12345') {
      setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('mockUser', JSON.stringify({ role: 'admin', email }));
        navigate('/admin/dashboard');
      }, 500); // Simulate brief loading
      return;
    }

    // Mock Student Login Bypass
    if (isStudent && email === 'student1@gmail.com' && password === 'student1@12345') {
      setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('mockUser', JSON.stringify({ role: 'student', email }));
        navigate('/student/dashboard');
      }, 500);
      return;
    }
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const isStudent = role === 'student';

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Header Tab-like selector */}
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => navigate('/login?role=student')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${isStudent ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            <GraduationCap className="w-4 h-4" />
            Student Login
          </button>
          <button
            onClick={() => navigate('/login?role=admin')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${!isStudent ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            <UserCog className="w-4 h-4" />
            Librarian Login
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Sign in to access your {isStudent ? 'academic' : 'library administrative'} dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none dark:text-gray-200">Password</label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 text-xs">
                  Forgot password?
                </a>
              </div>
              <Input
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <div className="flex items-center space-x-2 my-4">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600" 
              />
              <label htmlFor="remember" className="text-sm font-medium leading-none text-gray-600 dark:text-gray-400 cursor-pointer">
                Remember me
              </label>
            </div>

            <Button type="submit" className="w-full h-11 text-base" isLoading={isLoading}>
              Sign in as {isStudent ? 'Student' : 'Librarian'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
