import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import MpesaPaymentModal from '../components/Common/MpesaPaymentModal';
import { API_URL } from '../config';

const response = await fetch(`${API_URL}/payments/mpesa/initiate/`, {...})
const response = await fetch(`${API_URL}/payments/mpesa/status/`, {...})

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Please login to checkout');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (Array.isArray(parsedCart)) {
        setCart(parsedCart);
        calculateTotal(parsedCart);
      }
    }
  }, []);

  const calculateTotal = (cartItems) => {
    const sum = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    toast.success('Item removed');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingCartIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add some products to your cart and come back!</p>
            <Link to="/shop" className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3 rounded-lg inline-block hover:shadow-lg transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between border-b py-4 last:border-0">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">KES {item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 border rounded-lg p-2 text-center"
                    />
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">M-Pesa Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="0712345678" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Shipping Address</label>
                <textarea 
                  placeholder="Your full address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary-500"
                  rows="3"
                />
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>KES {total}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping:</span>
                  <span>KES 200</span>
                </div>
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total:</span>
                  <span className="text-primary-600">KES {total + 200}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowMpesaModal(true)}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition"
              >
                Pay with M-Pesa
              </button>
            </div>
          </div>
        </div>
      </div>

      <MpesaPaymentModal
        isOpen={showMpesaModal}
        onClose={() => setShowMpesaModal(false)}
        amount={total + 200}
        accountReference={`ORD-${Date.now()}`}
        transactionDesc="Spylink Networks Order"
        onSuccess={() => {
          localStorage.removeItem('cart');
          setCart([]);
          setTotal(0);
          toast.success('Payment successful! Order placed.');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        }}
      />
    </div>
  );
};

export default CheckoutPage;s