import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  ShoppingBag, 
  CreditCard, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  User,
  Settings
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { SkeletonDashboard } from '../components/Common/Skeleton';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchDashboardData(token);
  }, []);

  const fetchDashboardData = async (token) => {
    try {
      const [profileRes, subsRes, ordersRes, paymentsRes] = await Promise.all([
        fetch(`${API_URL}/auth/profile/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/subscriptions/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/orders/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/payments/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const userData = await profileRes.json();
      let subsData = await subsRes.json();
      let ordersData = await ordersRes.json();
      const paymentsData = await paymentsRes.json();

      subsData = Array.isArray(subsData) ? subsData : (subsData.results || []);
      ordersData = Array.isArray(ordersData) ? ordersData : (ordersData.results || []);

      setUser(userData);
      setSubscriptions(subsData);
      setOrders(ordersData);
      setPayments(Array.isArray(paymentsData) ? paymentsData : (paymentsData.results || []));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/subscriptions/${subscriptionId}/cancel/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success('Subscription cancelled successfully');
        fetchDashboardData(token);
      } else {
        toast.error('Failed to cancel subscription');
      }
    } catch (error) {
      toast.error('Error cancelling subscription');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'EXPIRED': return 'text-red-600 bg-red-100';
      case 'CANCELLED': return 'text-gray-600 bg-gray-100';
      case 'INSTALLATION': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4" />;
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'EXPIRED': return <AlertCircle className="h-4 w-4" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 pt-20">
        <SkeletonDashboard />
      </div>
    );
  }

  const activeSubscriptions = subscriptions.filter(s => s.status === 'ACTIVE');
  const pendingInstallations = subscriptions.filter(s => s.status === 'INSTALLATION');
  const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username}!</h1>
          <p className="text-gray-600">Manage your subscriptions, track orders, and update your account.</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90">Active Subscriptions</p>
                <p className="text-3xl font-bold mt-2">{activeSubscriptions.length}</p>
              </div>
              <Wifi className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90">Orders Completed</p>
                <p className="text-3xl font-bold mt-2">{completedOrders}</p>
              </div>
              <ShoppingBag className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90">Total Spent</p>
                <p className="text-3xl font-bold mt-2">KES {totalSpent.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90">Pending Installation</p>
                <p className="text-3xl font-bold mt-2">{pendingInstallations.length}</p>
              </div>
              <Calendar className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-6 py-3 font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'subscriptions' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'orders' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-3 font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'payments' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'profile' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Active Subscriptions Preview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Active Subscriptions</h2>
              {activeSubscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <Wifi className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No active subscriptions.</p>
                  <Link to="/packages" className="inline-block mt-3 text-primary-600 hover:underline">
                    Browse Packages →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeSubscriptions.slice(0, 3).map(sub => (
                    <div key={sub.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Wifi className="h-5 w-5 text-primary-600" />
                            <h3 className="font-bold text-lg">{sub.package_details?.name}</h3>
                          </div>
                          <p className="text-gray-600 text-sm">{sub.package_details?.speed}</p>
                          {sub.end_date && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              <span>Valid until: {new Date(sub.end_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">KES {sub.amount_paid}</p>
                          <p className="text-sm text-gray-500">/month</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {activeSubscriptions.length > 3 && (
                    <button
                      onClick={() => setActiveTab('subscriptions')}
                      className="text-primary-600 hover:underline text-sm flex items-center gap-1"
                    >
                      View all {activeSubscriptions.length} subscriptions <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet.</p>
                  <Link to="/shop" className="inline-block mt-3 text-primary-600 hover:underline">
                    Start Shopping →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map(order => (
                    <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.order_number}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">KES {order.total_amount}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length > 3 && (
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-primary-600 hover:underline text-sm flex items-center gap-1"
                    >
                      View all orders <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-4">All Subscriptions</h2>
            {subscriptions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No subscriptions yet.</p>
            ) : (
              <div className="space-y-4">
                {subscriptions.map(sub => (
                  <div key={sub.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-5 w-5 text-primary-600" />
                          <h3 className="font-bold text-lg">{sub.package_details?.name}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(sub.status)}`}>
                            {getStatusIcon(sub.status)}
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{sub.package_details?.speed}</p>
                        {sub.start_date && (
                          <p className="text-sm text-gray-500 mt-2">Started: {new Date(sub.start_date).toLocaleDateString()}</p>
                        )}
                        {sub.end_date && (
                          <p className="text-sm text-gray-500">Renews: {new Date(sub.end_date).toLocaleDateString()}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">KES {sub.amount_paid}</p>
                        <p className="text-sm text-gray-500">/month</p>
                        {sub.status === 'ACTIVE' && (
                          <button 
                            onClick={() => cancelSubscription(sub.id)}
                            className="mt-2 text-red-600 hover:text-red-700 text-sm font-semibold"
                          >
                            Cancel Subscription
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-4">Order History</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3">Order #</th>
                      <th className="text-left py-3">Date</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-right py-3">Total</th>
                      <th className="text-right py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium">{order.order_number || order.id}</td>
                        <td className="py-3 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="py-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-semibold">KES {order.total_amount}</td>
                        <td className="py-3 text-right">
                          <Link 
                            to={`/track-order/${order.id}`}
                            className="text-primary-600 hover:underline text-sm"
                          >
                            Track Order
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-4">Payment History</h2>
            {payments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No payment records yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3">Date</th>
                      <th className="text-left py-3">Payment Method</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-right py-3">Amount</th>
                      <th className="text-right py-3">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{new Date(payment.created_at).toLocaleDateString()}</td>
                        <td className="py-3">{payment.method}</td>
                        <td className="py-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'COMPLETED' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-semibold">KES {payment.amount}</td>
                        <td className="py-3 text-right text-sm text-gray-500">{payment.transaction_id || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-bold">Account Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Username</p>
                <p className="font-medium">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                <p className="font-medium">{user?.phone_number || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="font-medium">{user?.address || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link 
                to="/profile" 
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                <Settings className="h-5 w-5" />
                Edit Profile
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;