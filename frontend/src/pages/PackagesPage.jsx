import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Wifi, Calendar, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import MpesaPaymentModal from '../components/Common/MpesaPaymentModal';
import { API_URL } from '../config';

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [includeInstallation, setIncludeInstallation] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
  try {
    const response = await fetch(`${API_URL}/packages/`);
    const data = await response.json();
    
    if (data.results && Array.isArray(data.results)) {
      setPackages(data.results);
    } else if (Array.isArray(data)) {
      setPackages(data);
    } else {
      setPackages([]);
    }
  } catch (error) {
    console.error('Error fetching packages:', error);
    toast.error('Failed to load packages');
  } finally {
    setLoading(false);
  }
};

  const handleSubscribeClick = (pkg) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Please login to subscribe');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }
    setSelectedPackage(pkg);
  };

  const calculateTotalAmount = (pkg) => {
    let total = pkg.price;
    // If not first month free, add the first month price
    if (!pkg.first_month_free) {
      total += pkg.price;
    }
    // Add installation fee if applicable
    if (includeInstallation) {
      total += pkg.installation_fee || 10000;
    }
    return total;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading packages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 pt-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-4">Internet Packages</h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Choose the perfect plan for your needs
        </p>
        
        {packages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No packages available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${pkg.is_popular ? 'border-2 border-primary-500' : ''}`}>
                {pkg.is_popular && (
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center py-2 font-semibold">
                    🔥 Most Popular
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="h-6 w-6 text-primary-600" />
                    <h2 className="text-2xl font-bold">{pkg.name}</h2>
                  </div>
                  <p className="text-gray-600 mb-4">{pkg.speed}</p>
                  
                  {/* Price Display */}
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary-600">KES {pkg.price.toLocaleString()}</span>
                    <span className="text-gray-500">/month</span>
                    {pkg.first_month_free && (
                      <div className="inline-block ml-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                        First Month Free
                      </div>
                    )}
                  </div>
                  
                  {/* Installation Fee */}
                  {pkg.installation_fee && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">
                          One-time installation fee: <strong>KES {pkg.installation_fee.toLocaleString()}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* First Month Free Banner */}
                  {pkg.first_month_free && (
                    <div className="bg-green-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          🎉 <strong>First month FREE!</strong> You only pay for installation
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-6">{pkg.description}</p>
                  
                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {pkg.features && typeof pkg.features === 'object' && Object.entries(pkg.features).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700 capitalize">{key.replace(/_/g, ' ')}: {String(value)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Payment Summary */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600 mb-1">First Payment:</p>
                    <p className="text-lg font-bold text-primary-600">
                      KES {(pkg.installation_fee || 10000).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Installation fee + First month FREE</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Then <strong>KES {pkg.price.toLocaleString()}/month</strong> from month 2
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleSubscribeClick(pkg)}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition"
                  >
                    Subscribe - KES {(pkg.installation_fee || 10000).toLocaleString()} upfront
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MpesaPaymentModal
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
        amount={selectedPackage ? (selectedPackage.installation_fee || 10000) : 0}
        accountReference={`SUB-${selectedPackage?.id || ''}`}
        transactionDesc={`${selectedPackage?.name || 'Internet'} Installation`}
        onSuccess={() => {
          setSelectedPackage(null);
          toast.success('Payment successful! We will contact you to schedule installation.');
          fetchPackages();
        }}
      />
    </div>
  );
};

export default PackagesPage;