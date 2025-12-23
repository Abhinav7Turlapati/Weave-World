import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usersData from '../data/users.json';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateName = (name) => {
    // Name should be 2-50 characters, only letters, spaces, hyphens, and apostrophes
    const re = /^[a-zA-Z\s'-]{2,50}$/;
    return re.test(name.trim());
  };

  const validatePassword = (password) => {
    // Password should be at least 6 characters
    if (password.length < 6) return { valid: false, message: 'Password must be at least 6 characters long' };
    // Optional: Check for at least one letter and one number
    if (!/[a-zA-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one letter' };
    }
    return { valid: true, message: '' };
  };

  const checkEmailExists = (email) => {
    // Check in users.json
    const existsInJson = usersData.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    
    // Check in localStorage
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existsInStorage = storedUsers.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    
    return existsInJson || existsInStorage;
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
    // Clear register error when user starts typing
    if (registerError) {
      setRegisterError('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // Validate on blur for better UX
    if (name === 'name' && value.trim()) {
      if (!validateName(value)) {
        setErrors((prev) => ({
          ...prev,
          name: 'Name should be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes',
        }));
      }
    } else if (name === 'email' && value.trim()) {
      if (!validateEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          email: 'Please enter a valid email address',
        }));
      } else if (checkEmailExists(value)) {
        setErrors((prev) => ({
          ...prev,
          email: 'This email is already registered',
        }));
      }
    } else if (name === 'password' && value) {
      const passwordValidation = validatePassword(value);
      if (!passwordValidation.valid) {
        setErrors((prev) => ({
          ...prev,
          password: passwordValidation.message,
        }));
      }
    } else if (name === 'confirmPassword' && value && formData.password) {
      if (value !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Name should be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (checkEmailExists(formData.email)) {
      newErrors.email = 'This email is already registered';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.message;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');

    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Get existing registered users from localStorage
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // Create new user
        const newUser = {
          id: Date.now(), // Simple ID generation
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          role: 'user', // New users are regular users by default
        };

        // Add to localStorage
        storedUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));

        setIsLoading(false);
        
        // Show success message and redirect to login
        setRegisterError('');
        alert('Registration successful! Please login with your credentials.');
        navigate('/login');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50 flex items-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Sign Up
          </h1>
          <p className="text-gray-600">
            Create your account to get started.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {registerError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">{registerError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={50}
                className={`input-field ${errors.name ? 'border-red-500' : formData.name && !errors.name ? 'border-green-500' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

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
                className={`input-field ${errors.email ? 'border-red-500' : formData.email && !errors.email && validateEmail(formData.email) && !checkEmailExists(formData.email) ? 'border-green-500' : ''}`}
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
                className={`input-field ${errors.password ? 'border-red-500' : formData.password && !errors.password && validatePassword(formData.password).valid ? 'border-green-500' : ''}`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              {formData.password && !errors.password && validatePassword(formData.password).valid && (
                <p className="mt-1 text-sm text-green-600">✓ Password is valid</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters long and contain at least one letter
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-field ${errors.confirmPassword ? 'border-red-500' : formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-500' : ''}`}
                placeholder="Confirm your password"
              />
              {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-1 text-sm text-green-600">✓ Passwords match</p>
              )}
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

