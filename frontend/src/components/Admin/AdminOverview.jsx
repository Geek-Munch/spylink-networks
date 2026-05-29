import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Wifi, CreditCard, TrendingUp, Package, DollarSign, Activity } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const AdminOverview = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    packages: 0,
    products: 0,
    subscriptions: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const [ordersRes, packagesRes, productsRes, subsRes, paymentsRes] = await Promise.all([
        fetch('https://spylink-backend.onrender.com/api/orders/', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://spylink-backend.onrender.com/api/packages/'),
        fetch('https://spylink-backend.onrender.com/api/products/'),
        fetch('https://spylink-backend.onrender.com/api/subscriptions/', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://spylink-backend.onrender.com/api/payments/', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const ordersData = await ordersRes.json();
      const packagesData = await packagesRes.json();
      const productsData = await productsRes.json();
      const subsData = await subsRes.json();
      const paymentsData = await paymentsRes.json();

      setStats({
        users: 0, // You can get this from a separate endpoint
        orders: ordersData.length || 0,
        packages: packagesData.length || 0,
        products: productsData.length || 0,
        subscriptions: subsData.length || 0,
        revenue: paymentsData.reduce((sum, p) => sum + (p.status === 'COMPLETED' ? p.amount : 0), 0)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch('https://spylink-backend.onrender.com/api/orders/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRecentOrders(data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (KES)',
        data: [25000, 42000, 38000, 51000, 68000, stats.revenue],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const subscriptionData = {
    labels: ['Active', 'Pending', 'Expired', 'Cancelled'],
    datasets: [
      {
        data: [45, 23, 12, 8],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#6B7280'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  const statCards = [
    { title: 'Total Users', value: stats.users, icon: Users, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'from-green-500 to-green-600', change: '+8%' },
    { title: 'Packages', value: stats.packages, icon: Wifi, color: 'from-purple-500 to-purple-600', change: '0%' },
    { title: 'Products', value: stats.products, icon: Package, color: 'from-orange-500 to-orange-600', change: '+5%' },
    { title: 'Active Subscriptions', value: stats.subscriptions, icon: CreditCard, color: 'from-teal-500 to-teal-600', change: '+15%' },
    { title: 'Total Revenue', value: `KES ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'from-pink-500 to-pink-600', change: '+23%' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">Welcome to your admin dashboard</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-r ${card.color} p-3 rounded-xl shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{card.value}</span>
                </div>
                <h3 className="text-gray-600 font-medium">{card.title}</h3>
                <p className="text-sm text-green-600 mt-2">↑ {card.change} from last month</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
            <Line data={revenueData} options={chartOptions} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-4">Subscription Distribution</h2>
            <div className="max-w-xs mx-auto">
              <Doughnut data={subscriptionData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3">Order #</th>
                    <th className="text-left py-3">Customer</th>
                    <th className="text-left py-3">Date</th>
                    <th className="text-right py-3">Total</th>
                    <th className="text-center py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 font-mono text-sm">{order.order_number}</td>
                      <td className="py-3">{order.user?.email || 'N/A'}</td>
                      <td className="py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-3 text-right font-semibold">KES {order.total_amount}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-600' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminOverview;