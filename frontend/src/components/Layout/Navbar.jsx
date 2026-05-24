import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, WifiIcon, UserIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('access_token');
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(count);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('cart');
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/packages', label: 'Packages' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <WifiIcon className="h-8 w-8 text-primary-600" />
            </motion.div>
            <span className="text-2xl font-bold gradient-text">Spylink</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                isActive={location.pathname === link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" isActive={location.pathname === '/dashboard'}>
                  Dashboard
                </NavLink>
                <button 
                  onClick={handleLogout} 
                  className="text-gray-700 hover:text-primary-600 transition font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" isActive={location.pathname === '/login'}>
                  Login
                </NavLink>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
  <Link to="/checkout" className="relative group">
    <ShoppingCartIcon className="h-6 w-6 text-gray-700 group-hover:text-primary-600 transition" />
    {cartCount > 0 && (
      <motion.span 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
      >
        {cartCount}
      </motion.span>
    )}
  </Link>
)}
            
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
          >
            <div className="flex flex-col space-y-2 p-6">
              {navLinks.map((link) => (
                <MobileNavLink 
                  key={link.to} 
                  to={link.to} 
                  onClick={() => setIsMenuOpen(false)}
                  isActive={location.pathname === link.to}
                >
                  {link.label}
                </MobileNavLink>
              ))}
              {isAuthenticated ? (
                <>
                  <MobileNavLink to="/dashboard" onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/dashboard'}>
                    Dashboard
                  </MobileNavLink>
                  <button 
                    onClick={() => { 
                      handleLogout(); 
                      setIsMenuOpen(false); 
                    }} 
                    className="text-left text-gray-700 hover:text-primary-600 transition py-3 px-4 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink to="/login" onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/login'}>
                    Login
                  </MobileNavLink>
                  <MobileNavLink to="/register" onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/register'}>
                    Sign Up Free
                  </MobileNavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const NavLink = ({ to, children, isActive }) => (
  <Link 
    to={to} 
    className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
      isActive 
        ? 'text-primary-600 bg-primary-50' 
        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
    }`}
  >
    {children}
    {isActive && (
      <motion.div
        layoutId="activeNav"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full"
        transition={{ duration: 0.3 }}
      />
    )}
  </Link>
);

const MobileNavLink = ({ to, children, onClick, isActive }) => (
  <Link 
    to={to} 
    onClick={onClick} 
    className={`block py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
      isActive 
        ? 'text-primary-600 bg-primary-50' 
        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;