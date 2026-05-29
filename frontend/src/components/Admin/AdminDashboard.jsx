import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingBag, 
  Wifi, 
  CreditCard,
  LogOut,
  Settings,
  Bell,
  Search
} from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('https://spylink-backend.onrender.com/api/auth/profile/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.is_staff || data.is_superuser) {
        setUser(data);
      } else {
        alert('Admin access only');
        navigate('/dashboard');
      }
    } catch (error) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/packages', icon: Wifi, label: 'Internet Packages' },
    { path: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Spylink Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Welcome, {user?.username}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-gray-800 transition"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;