import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [isOwner, setIsOwner] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is owner/admin
    const checkUserStatus = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const userObj = JSON.parse(userData);
        if (userObj.isLoggedIn) {
          setIsLoggedIn(true);
          setUser(userObj);
          if (userObj.role === 'owner' || userObj.role === 'admin') {
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
          setIsOwner(false);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setIsOwner(false);
      }
    };

    // Check on mount
    checkUserStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkUserStatus);

    // Check periodically for same-tab updates
    const interval = setInterval(checkUserStatus, 1000);

    return () => {
      window.removeEventListener('storage', checkUserStatus);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsOwner(false);
    navigate('/');
    window.location.reload(); // Refresh to update all components
  };

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageMenu && !event.target.closest('.relative')) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageMenu]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Handloom Global
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/artisans"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              {t('nav.artisans')}
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              {t('nav.products')}
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              {t('nav.contact')}
            </Link>
            <Link
              to="/feedback"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              {t('nav.feedback')}
            </Link>
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Profile</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                {t('nav.login')}
              </Link>
            )}
            {isOwner && (
              <Link
                to="/admin/products"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                {t('nav.manageProducts')}
              </Link>
            )}
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                <span className="text-sm">{language.toUpperCase()}</span>
              </button>
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <button
                    onClick={() => {
                      changeLanguage('en');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-lg ${language === 'en' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700'
                      }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('hi');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${language === 'hi' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700'
                      }`}
                  >
                    हिंदी (Hindi)
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('zh');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-b-lg ${language === 'zh' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700'
                      }`}
                  >
                    中文 (Chinese)
                  </button>
                </div>
              )}
            </div>
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              <span className="flex items-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </span>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-primary-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Links */}
        <div className="md:hidden pb-4 space-y-2">
          <Link
            to="/"
            className="block text-gray-700 hover:text-primary-600 font-medium py-2"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/artisans"
            className="block text-gray-700 hover:text-primary-600 font-medium py-2"
          >
            {t('nav.artisans')}
          </Link>
          <Link
            to="/products"
            className="block text-gray-700 hover:text-primary-600 font-medium py-2"
          >
            {t('nav.products')}
          </Link>
          <Link
            to="/contact"
            className="block text-gray-700 hover:text-primary-600 font-medium py-2"
          >
            {t('nav.contact')}
          </Link>
          <Link
            to="/feedback"
            className="block text-gray-700 hover:text-primary-600 font-medium py-2"
          >
            {t('nav.feedback')}
          </Link>
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 font-medium py-2 w-full text-left"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Profile</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="block text-gray-700 hover:text-primary-600 font-medium py-2"
            >
              {t('nav.login')}
            </Link>
          )}
          {isOwner && (
            <Link
              to="/admin/products"
              className="block text-gray-700 hover:text-primary-600 font-medium py-2"
            >
              {t('nav.manageProducts')}
            </Link>
          )}
          {/* Mobile Language Selector */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Language / भाषा / 语言</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 text-sm rounded ${language === 'en'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage('hi')}
                className={`px-3 py-1 text-sm rounded ${language === 'hi'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => changeLanguage('zh')}
                className={`px-3 py-1 text-sm rounded ${language === 'zh'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                中文
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
