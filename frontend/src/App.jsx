import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import PackagesPage from './pages/PackagesPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from "./pages/AboutPage";
import ContactPage from './pages/ContactPage';
import ScrollToTop from './components/Common/ScrollToTop';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminOverview from './pages/Admin/AdminOverview';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminPackages from './pages/Admin/AdminPackages';
import AdminSubscriptions from './pages/Admin/AdminSubscriptions';
import AdminPayments from './pages/Admin/AdminPayments';
import AdminAccess from './components/Admin/AdminAccess';

function App() {
  return (
    <AdminAccess>
  <Navbar />
  <main className="flex-grow pt-20">
    <Routes>
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            <Route path="/admin" element={<AdminDashboard />}>
  <Route index element={<AdminOverview />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="orders" element={<AdminOrders />} />
  <Route path="products" element={<AdminProducts />} />
  <Route path="packages" element={<AdminPackages />} />
  <Route path="subscriptions" element={<AdminSubscriptions />} />
  <Route path="payments" element={<AdminPayments />} />
</Route>

          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
     </Routes>
  </main>
  <Footer />
</AdminAccess>
  );
}

export default App;