import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import usersData from '../data/users.json';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check for message from protected route redirect
  useEffect(() => {
    if (location.state?.message) {
      setInfoMessage(location.state.message);
      // Clear state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Redirect if already logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.isLoggedIn) {
        navigate('/');
      }
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    // Clear login error when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // Validate on blur for better UX
    if (name === 'email' && value.trim()) {
      if (!validateEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          email: 'Please enter a valid email address',
        }));
      }
    } else if (name === 'password' && value) {
      if (value.length < 6) {
        setErrors((prev) => ({
          ...prev,
          password: 'Password must be at least 6 characters long',
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setInfoMessage('');

    if (validateForm()) {
      setIsLoading(true);

      // Simulate API call delay
      setTimeout(() => {
        // Check if credentials match any user in the database (users.json)
        let user = usersData.find(
          (u) => u.email.toLowerCase() === formData.email.toLowerCase() && u.password === formData.password
        );

        // If not found, check registered users in localStorage
        if (!user) {
          const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const foundUser = storedUsers.find(
            (u) => u.email.toLowerCase() === formData.email.toLowerCase() && u.password === formData.password
          );
          if (foundUser) {
            user = foundUser;
          }
        }

        if (user) {
          // Save user session to localStorage
          const userData = {
            email: user.email,
            name: user.name,
            id: user.id,
            role: user.role || 'user', // Default to 'user' if role not specified
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
          };
          localStorage.setItem('user', JSON.stringify(userData));

          setIsLoading(false);
          // Redirect to home page after successful login
          navigate('/home');
        } else {
          // Invalid credentials
          setIsLoading(false);
          setLoginError('Invalid email or password. Please try again.');
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50 flex items-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Login
          </h1>
          <p className="text-gray-600">
            Welcome back! Please login to your account.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {infoMessage && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">{infoMessage}</p>
            </div>
          )}
          {loginError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">{loginError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field ${errors.email ? 'border-red-500' : formData.email && !errors.email && validateEmail(formData.email) ? 'border-green-500' : ''}`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field ${errors.password ? 'border-red-500' : formData.password && !errors.password && formData.password.length >= 6 ? 'border-green-500' : ''}`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

