import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const VerifyEmailPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state;
    if (state) {
      setUserId(state.userId);
      setEmail(state.email);
    } else {
      const storedUserId = sessionStorage.getItem('pending_user_id');
      const storedEmail = sessionStorage.getItem('pending_email');
      if (storedUserId && storedEmail) {
        setUserId(storedUserId);
        setEmail(storedEmail);
      } else {
        toast.error('Verification information not found');
        navigate('/register');
      }
    }
  }, [location, navigate]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-email/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, code: verificationCode })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Save tokens for auto-login
        if (data.access) {
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
        }
        
        toast.success('Email verified! Redirecting to dashboard...');
        
        sessionStorage.removeItem('pending_user_id');
        sessionStorage.removeItem('pending_email');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.error(data.error || 'Verification failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userId) {
      toast.error('User information not found');
      return;
    }
    
    setResending(true);
    try {
      const response = await fetch(`${API_URL}/auth/resend-verification/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('New verification code sent to your email!');
        setCode(['', '', '', '', '', '']);
      } else {
        toast.error(data.error || 'Failed to resend code');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-10 w-10 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a verification code to <br />
              <strong>{email}</strong>
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 mb-3 text-center">
              Enter 6-digit verification code
            </label>
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Verify Email
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-primary-600 hover:underline flex items-center gap-1 inline-flex"
              >
                <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
                Resend Code
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Check your spam folder if you don't see the email within a few minutes.
              The verification code expires in 15 minutes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;