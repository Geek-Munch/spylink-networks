import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, CheckCircle, XCircle, Wifi } from 'lucide-react';

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch('https://spylink-networks.onrender.com/api/subscriptions/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubscriptionStatus = async (subId, newStatus) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`https://spylink-networks.onrender.com/api/subscriptions/${subId}/update-status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchSubscriptions();
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'ACTIVE': 'bg-green-100 text-green-600',
      'PENDING': 'bg-yellow-100 text-yellow-600',
      'EXPIRED': 'bg-red-100 text-red-600',
      'CANCELLED': 'bg-gray-100 text-gray-600',
      'INSTALLATION': 'bg-blue-100 text-blue-600',
    };
    return badges[status] || badges['PENDING'];
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.package_details?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Subscription Management
        </h1>
        <p className="text-gray-500 mt-1">Manage customer subscriptions</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer email or package name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Package</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Speed</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Start Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">End Date</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((sub, index) => (
                <motion.tr
                  key={sub.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6">{sub.user?.email}</td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-primary-600" />
                      {sub.package_details?.name}
                    </div>
                  </td>
                  <td className="py-3 px-6">{sub.package_details?.speed}</td>
                  <td className="py-3 px-6">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-gray-500">{new Date(sub.start_date).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-gray-500">{new Date(sub.end_date).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-center">
                    <select
                      value={sub.status}
                      onChange={(e) => updateSubscriptionStatus(sub.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INSTALLATION">Installation</option>
                      <option value="EXPIRED">Expired</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSubscriptions;