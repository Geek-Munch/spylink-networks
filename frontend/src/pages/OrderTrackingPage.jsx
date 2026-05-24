import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  Mail,
  ShoppingBag,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderStatuses = [
    { status: 'PENDING', icon: Package, label: 'Order Placed', description: 'Your order has been received' },
    { status: 'PROCESSING', icon: Clock, label: 'Processing', description: 'Order is being processed' },
    { status: 'PAID', icon: CheckCircle, label: 'Payment Confirmed', description: 'Payment has been verified' },
    { status: 'SHIPPED', icon: Truck, label: 'Shipped', description: 'Your order is on the way' },
    { status: 'DELIVERED', icon: MapPin, label: 'Delivered', description: 'Order has been delivered' },
  ];

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/orders/${orderId}/`, {...});
      
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        toast.error('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStep = () => {
    if (!order) return 0;
    const currentStatus = order.status;
    const index = orderStatuses.findIndex(s => s.status === currentStatus);
    return index >= 0 ? index : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn-primary inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-gray-600">Order #{order.order_number || order.id}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tracking Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-xl font-bold mb-6">Order Status</h2>
              
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-gray-200"></div>
                
                {orderStatuses.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  
                  return (
                    <div key={step.status} className="relative flex items-start gap-6 mb-8 last:mb-0">
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-3">
                          <h3 className={`font-semibold ${isCompleted ? 'text-primary-600' : 'text-gray-500'}`}>
                            {step.label}
                          </h3>
                          {isCurrent && (
                            <span className="bg-primary-100 text-primary-600 text-xs px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                        {isCompleted && step.status === 'DELIVERED' && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ Delivered on {new Date(order.updated_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Details */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-primary-600">KES {order.total_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-600' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-lg mb-4">Shipping Address</h3>
              <p className="text-gray-600">{order.shipping_address}</p>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-3">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">Have questions about your order?</p>
              <a 
                href="https://wa.me/254740370328" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                <Phone className="h-4 w-4" />
                <span>Contact Support on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8 bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-0">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{item.product_details?.name || 'Product'}</h4>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">KES {item.price}</p>
                  <p className="text-sm text-gray-500">Total: KES {item.subtotal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;