import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight,
  Rocket,
  Shield,
  Clock,
  Smartphone,
  Zap,
  Sparkles,
  Wifi
} from 'lucide-react';
import { SkeletonPackage } from '../components/Common/Skeleton';

const HomePage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/packages/');
      const data = await response.json();
      setPackages(data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  const features = [
    { icon: Rocket, title: 'Lightning Fast', description: 'Up to 1 Gbps speeds for seamless streaming' },
    { icon: Shield, title: 'Secure Connection', description: 'Enterprise-grade security for your peace of mind' },
    { icon: Clock, title: '99.9% Uptime', description: 'Reliable connection you can count on' },
    { icon: Smartphone, title: 'Easy Setup', description: 'Quick installation and activation' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3')] bg-cover bg-center opacity-5"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-semibold">Kenya's Fastest Growing ISP</span>
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="gradient-text">Lightning Fast</span>
                <br />
                Internet for Everyone
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience the future of connectivity with Spylink. 
                Ultra-fast fiber optic internet, 24/7 support, and unbeatable prices.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/packages" className="btn-primary group">
                  Get Started
                  <ArrowRight className="h-5 w-5 inline-block ml-2 group-hover:translate-x-1 transition" />
                </Link>
                <Link to="/shop" className="btn-secondary">
                  Shop Devices
                </Link>
              </div>
              
              <div className="mt-12 flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-primary-600">10K+</p>
                  <p className="text-gray-500">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600">99.9%</p>
                  <p className="text-gray-500">Uptime Guarantee</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600">24/7</p>
                  <p className="text-gray-500">Support</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl opacity-20"
                ></motion.div>
                <div className="glass-card rounded-2xl p-1">
                  <img 
                    src="https://images.unsplash.com/photo-1558005137-d9619a5c1a3d?ixlib=rb-4.0.3" 
                    alt="Internet Speed"
                    className="rounded-2xl w-full"
                  />
                </div>
                <motion.div 
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-6 -left-6 glass-card rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">1 Gbps</p>
                      <p className="text-sm text-gray-500">Ultra Fast Speed</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose <span className="gradient-text">Spylink</span>?</h2>
            <p className="text-xl text-gray-600">We provide the best internet experience with cutting-edge technology</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center group">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Choose Your <span className="gradient-text">Perfect Plan</span></h2>
            <p className="text-xl text-gray-600">Flexible packages tailored to your needs</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              // Show skeletons while loading
              <>
                <SkeletonPackage />
                <SkeletonPackage />
                <SkeletonPackage />
              </>
            ) : (
              // Show actual packages
              packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="package-card relative"
                >
                  {pkg.is_popular && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                      Most Popular
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Wifi className="h-6 w-6 text-primary-600" />
                      <h3 className="text-2xl font-bold">{pkg.name}</h3>
                    </div>
                    <p className="text-gray-500 mb-4">{pkg.speed}</p>
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-primary-600">KES {pkg.price.toLocaleString()}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <p className="text-gray-600 mb-6">{pkg.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      {pkg.features && Object.entries(pkg.features).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-gray-700 capitalize">{key.replace(/_/g, ' ')}: {value.toString()}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link 
                      to={`/subscribe/${pkg.id}`}
                      className="block w-full text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 hover:shadow-lg"
                    >
                      Subscribe Now
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Experience the Future?</h2>
            <p className="text-xl text-white/90 mb-8">Join thousands of satisfied customers enjoying lightning-fast internet</p>
            <Link to="/packages" className="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105">
              Get Connected Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;