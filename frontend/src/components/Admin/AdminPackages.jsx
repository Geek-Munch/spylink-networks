import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2, Plus, Wifi, TrendingUp } from 'lucide-react';

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('https://spylink-networks.onrender.com/api/packages/');
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

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
            Internet Packages
          </h1>
          <p className="text-gray-500 mt-1">Manage your subscription plans</p>
        </div>
        <button className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Package
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ${pkg.is_popular ? 'border-2 border-primary-500' : ''}`}
          >
            {pkg.is_popular && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center py-1 text-sm font-semibold">
                Most Popular
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wifi className="h-6 w-6 text-primary-600" />
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                </div>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">{pkg.speed}</p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary-600">KES {pkg.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-1">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-1">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminPackages;