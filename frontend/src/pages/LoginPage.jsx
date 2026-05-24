import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register/`, {...});

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Login to Spylink</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-spylink-teal"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-spylink-teal"
              required
            />
          </div>
          
          <button 
  type="submit" 
  disabled={loading}
  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition disabled:opacity-50"
>
  {loading ? 'Logging in...' : 'Login'}
</button>

    <div className="text-right mt-2">
  <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">
    Forgot Password?
  </Link>
</div>

        </form>
        
        <p className="text-center text-gray-600 mt-4">
          Don't have an account? <Link to="/register" className="text-spylink-teal hover:underline">Register</Link>
        </p>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <div className="flex justify-center space-x-4 text-sm">
            <Link to="/terms" className="text-gray-500 hover:text-primary-600 transition">Terms of Service</Link>
            <span className="text-gray-300">|</span>
            <Link to="/privacy" className="text-gray-500 hover:text-primary-600 transition">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;