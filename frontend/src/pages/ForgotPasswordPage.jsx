import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password/`, {...})
      const response = await fetch(`${API_URL}/auth/verify-reset-code/`, {...})
    const response =  await fetch(`${API_URL}/auth/reset-password/`, {...});

      const data = await response.json();
      if (response.ok) {
        toast.success('Reset code sent to your email!');
        setResetEmail(email);
        setStep(2);
      } else {
        toast.error(data.error || 'Failed to send reset code');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleVerifyCode = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/verify-reset-code/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: verificationCode })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Code verified! Enter your new password.');
        setStep(3);
      } else {
        toast.error(data.error || 'Invalid code');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const verificationCode = code.join('');

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          code: verificationCode,
          new_password: newPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Password reset successful! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(data.error || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
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
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a reset code.
                </p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Reset Code
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Enter Reset Code</h1>
                <p className="text-gray-600">
                  We sent a 6-digit code to <strong>{resetEmail}</strong>
                </p>
              </div>

              <div className="mb-8">
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
                onClick={handleVerifyCode}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full mt-3 text-gray-600 hover:text-primary-600 transition"
              >
                ← Back to email
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
                <p className="text-gray-600">
                  Create a new password for your account
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Resetting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Reset Password
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary-600 hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;