import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, Camera, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone_number: '',
    address: ''
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/auth/profile/`, {...})
          await fetch(`${API_URL}/auth/change-password/`, {...});
      
      if (response.ok) {
        const data = await response.json();
        setProfile({
          username: data.username || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          address: data.address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/auth/profile/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      
      if (response.ok) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setChangingPassword(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('${API_URL}/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: passwordData.old_password,
          new_password: passwordData.new_password
        })
      });
      
      if (response.ok) {
        toast.success('Password changed successfully!');
        setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-bold">Personal Information</h2>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone_number}
                    onChange={(e) => setProfile({...profile, phone_number: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-primary-500"
                    placeholder="0712345678"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Address</label>
                  <textarea
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-primary-500"
                    rows="3"
                    placeholder="Your address"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  {updating ? 'Saving...' : <><Save className="h-5 w-5" /> Save Changes</>}
                </button>
              </form>
            </div>
            
            {/* Change Password */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-bold">Change Password</h2>
              </div>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-primary-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2"
                >
                  {changingPassword ? 'Changing...' : <><Lock className="h-5 w-5" /> Change Password</>}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;