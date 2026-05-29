import React from 'react';
import { motion } from 'framer-motion';

const AdminUsers = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      <div className="bg-white rounded-2xl shadow-md p-6">
        <p className="text-gray-500 text-center py-8">User management interface coming soon...</p>
      </div>
    </motion.div>
  );
};

export default AdminUsers;