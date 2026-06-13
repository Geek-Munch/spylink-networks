import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch('https://spylink-networks.onrender.com/api/payments/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'COMPLETED': { color: 'bg-green-100 text-green-600', icon: CheckCircle },
      'PENDING': { color: 'bg-yellow-100 text-yellow-600', icon: Clock },
      'FAILED': { color: 'bg-red-100 text-red-600', icon: XCircle },
    };
    const badge = badges[status] || badges['PENDING'];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const filteredPayments = payments.filter(payment =>
    payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Payment Management
          </h1>
          <p className="text-gray-500 mt-1">Track all transactions</p>
        </div>
        <button className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Report
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90">Total Revenue</p>
          <p className="text-3xl font-bold">KES {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90">Total Transactions</p>
          <p className="text-3xl font-bold">{payments.length}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90">Success Rate</p>
          <p className="text-3xl font-bold">
            {Math.round((payments.filter(p => p.status === 'COMPLETED').length / payments.length) * 100)}%
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer email or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Method</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6 text-gray-500">{new Date(payment.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-6">{payment.user?.email}</td>
                  <td className="py-3 px-6 font-semibold">KES {payment.amount}</td>
                  <td className="py-3 px-6">{payment.method}</td>
                  <td className="py-3 px-6">{getStatusBadge(payment.status)}</td>
                  <td className="py-3 px-6 font-mono text-sm">{payment.transaction_id || '—'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPayments;