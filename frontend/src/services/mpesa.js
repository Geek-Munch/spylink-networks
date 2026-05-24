import api from './api';
import { API_URL } from '../config';

export const mpesaService = {
  /**
   * Initiate STK Push payment
   * @param {string} phoneNumber - Customer's phone number (e.g., 0712345678)
   * @param {number} amount - Amount to pay
   * @param {string} accountReference - Reference for the payment (e.g., SUB-123, ORD-456)
   * @param {string} transactionDesc - Description of the transaction
   * @returns {Promise} - Response from server
   */
  async initiatePayment(phoneNumber, amount, accountReference, transactionDesc) {
    try {
      const response = await fetch(`${API_URL}/payments/mpesa/initiate/`, {...});
      return response.data;
    } catch (error) {
      console.error('M-Pesa payment error:', error);
      throw error;
    }
  },

  /**
   * Check payment status
   * @param {string} checkoutRequestId - The checkout request ID from initiation
   * @returns {Promise} - Payment status
   */
  async checkPaymentStatus(checkoutRequestId) {
    try {
      const response = await api.post('/payments/mpesa/status/', {
        checkout_request_id: checkoutRequestId
      });
      return response.data;
    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  },

  /**
   * Format phone number to a readable format
   * @param {string} phone - Raw phone number
   * @returns {string} - Formatted phone number
   */
  formatPhoneNumber(phone) {
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Format as 07XX XXX XXX
    if (cleaned.length === 10 && cleaned.startsWith('07')) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    // Format as 2547XX XXX XXX
    if (cleaned.length === 12 && cleaned.startsWith('254')) {
      return `0${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }
    return phone;
  },

  /**
   * Validate phone number
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - Is valid
   */
  validatePhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    // Valid formats: 07XXXXXXXX (10 digits) or 2547XXXXXXXX (12 digits)
    return (cleaned.length === 10 && cleaned.startsWith('07')) || 
           (cleaned.length === 12 && cleaned.startsWith('254'));
  }
};