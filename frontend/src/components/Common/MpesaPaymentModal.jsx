import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { mpesaService } from '../../services/mpesa';
import toast from 'react-hot-toast';

const MpesaPaymentModal = ({ isOpen, onClose, amount, accountReference, transactionDesc, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [status, setStatus] = useState(null);

  const handlePayment = async () => {
    if (!mpesaService.validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid M-Pesa phone number (e.g., 0712345678)');
      return;
    }

    setLoading(true);
    setStatus('initiating');

    try {
      const response = await mpesaService.initiatePayment(
        phoneNumber,
        amount,
        accountReference,
        transactionDesc
      );

      if (response.success) {
        setCheckoutRequestId(response.checkout_request_id);
        setStatus('sent');
        toast.success('STK Push sent! Please check your phone and enter your M-Pesa PIN.');
        
        // Start polling for payment status
        startPolling(response.checkout_request_id);
      } else {
        setStatus('failed');
        toast.error(response.error || 'Payment initiation failed');
      }
    } catch (error) {
      setStatus('failed');
      toast.error(error.response?.data?.error || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (requestId) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 attempts = 60 seconds
    
    const pollInterval = setInterval(async () => {
      attempts++;
      
      try {
        const response = await mpesaService.checkPaymentStatus(requestId);
        
        if (response.status === '0') { // Success
          clearInterval(pollInterval);
          setStatus('completed');
          toast.success('Payment completed successfully!');
          if (onSuccess) onSuccess();
          setTimeout(() => {
            onClose();
          }, 2000);
        } else if (response.status !== '1' || attempts >= maxAttempts) {
          clearInterval(pollInterval);
          if (attempts >= maxAttempts) {
            setStatus('timeout');
            toast.error('Payment timeout. Please try again.');
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000); // Check every 2 seconds
  };

  const handleClose = () => {
    setPhoneNumber('');
    setStatus(null);
    setCheckoutRequestId(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black bg-opacity-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">M-Pesa Payment</h2>
              <p className="text-gray-600 mt-2">Amount: <span className="font-bold text-primary-600">KES {amount.toLocaleString()}</span></p>
              <p className="text-sm text-gray-500">{transactionDesc}</p>
            </div>
            
            {!status && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">M-Pesa Phone Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="0712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:outline-none focus:border-primary-500"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter the phone number registered with M-Pesa</p>
                </div>
                
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Initiating...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Pay with M-Pesa
                    </>
                  )}
                </button>
              </div>
            )}
            
            {status === 'sent' && (
              <div className="text-center">
                <div className="animate-pulse mb-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <Smartphone className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">STK Push Sent!</h3>
                <p className="text-gray-600 mb-4">
                  Please check your phone for the M-Pesa prompt.
                  Enter your PIN to complete the payment.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Waiting for confirmation...
                  </p>
                </div>
              </div>
            )}
            
            {status === 'completed' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">Payment Successful!</h3>
                <p className="text-gray-600">
                  Your payment has been processed successfully.
                </p>
              </div>
            )}
            
            {(status === 'failed' || status === 'timeout') && (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-600 mb-2">Payment Failed</h3>
                <p className="text-gray-600 mb-4">
                  {status === 'timeout' 
                    ? 'Payment took too long. Please try again.'
                    : 'There was an issue with your payment. Please try again.'}
                </p>
                <button
                  onClick={() => setStatus(null)}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700"
                >
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MpesaPaymentModal;