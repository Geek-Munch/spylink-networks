import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Award, Target, Heart, Wifi, Shield, Zap, Clock, MapPin, Phone, Mail, Building2, Globe, MessageCircle, FileText } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { value: '10K+', label: 'Happy Customers', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { value: '5+', label: 'Years of Excellence', icon: Award, color: 'from-yellow-500 to-orange-500' },
    { value: '99.9%', label: 'Uptime Guarantee', icon: Target, color: 'from-green-500 to-emerald-500' },
    { value: '24/7', label: 'Customer Support', icon: Heart, color: 'from-red-500 to-pink-500' },
  ];

  const values = [
    { icon: Wifi, title: 'Innovation', description: 'Constantly evolving with cutting-edge technology', color: 'from-purple-500 to-indigo-500' },
    { icon: Shield, title: 'Reliability', description: '99.9% uptime guarantee for uninterrupted service', color: 'from-blue-500 to-cyan-500' },
    { icon: Zap, title: 'Speed', description: 'Lightning-fast connectivity for all your needs', color: 'from-yellow-500 to-orange-500' },
    { icon: Clock, title: 'Support', description: 'Round-the-clock customer service', color: 'from-green-500 to-emerald-500' },
  ];

  const quickLinks = [
    { icon: MessageCircle, title: 'WhatsApp Support', description: 'Chat with us on WhatsApp', link: 'https://wa.me/254740370328', color: 'from-green-500 to-emerald-500' },
    { icon: FileText, title: 'Terms & Conditions', description: 'Read our terms of service', link: '/terms', color: 'from-blue-500 to-cyan-500' },
    { icon: Shield, title: 'Privacy Policy', description: 'How we protect your data', link: '/privacy', color: 'from-purple-500 to-indigo-500' },
    { icon: Globe, title: 'FAQ', description: 'Frequently asked questions', link: '/faq', color: 'from-orange-500 to-red-500' },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section - Clean without purple background */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Our Story
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              About <span className="gradient-text">Spylink Networks</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Kenya's most trusted internet service provider, connecting homes and businesses 
              with fast, reliable, and affordable internet since 2020.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className={`bg-gradient-to-br ${stat.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Our Journey</span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-6">From Humble Beginnings to Industry Leader</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2020, Spylink Networks emerged with a vision to transform Kenya's internet landscape. 
                  We saw a gap between expensive, unreliable connections and the growing need for high-speed internet access.
                </p>
                <p>
                  Starting from a small office in Bungoma, we've grown to become one of Kenya's fastest-growing ISPs, 
                  serving thousands of satisfied customers across the country.
                </p>
                <p className="font-semibold text-primary-600">
                  Our mission remains simple: provide fast, reliable, and affordable internet to every home and business in Kenya.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card rounded-2xl p-2">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3"
                  alt="Our Team"
                  className="rounded-xl w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
                  {/* Team Section - Names Overlaid on Images */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Our Leadership</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-4">Meet the <span className="gradient-text">Team</span> Behind Spylink</h2>
            <p className="text-gray-600">Dedicated experts committed to connecting Kenya with reliable, high-speed internet.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Founder Card - Joel Njenga Maina */}
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer">
              <div className="relative h-80 w-full">
                <img 
                  src="/src/assets/images/team/ceo.jpeg" 
                  alt="Joel Njenga Maina"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">Joel Njenga Maina</h3>
                  <p className="text-primary-300 font-semibold text-sm">Founder & CEO</p>
                  <p className="text-gray-200 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    15+ years in telecommunications, passionate about connecting Kenya.
                  </p>
                </div>
              </div>
            </div>

            {/* Technician 1 - Smith Juma */}
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer">
              <div className="relative h-80 w-full">
                <img 
                  src="/src/assets/images/team/smith.jpeg" 
                  alt="Smith Juma"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">Smith Juma</h3>
                  <p className="text-primary-300 font-semibold text-sm">Senior Technician</p>
                  <p className="text-gray-200 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Expert in fiber optics and network infrastructure installation.
                  </p>
                </div>
              </div>
            </div>

            {/* Technician 2 - Pius Pius */}
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer">
              <div className="relative h-80 w-full">
                <img 
                  src="/src/assets/images/team/pius.jpeg" 
                  alt="Pius Pius"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">Pius Pius</h3>
                  <p className="text-primary-300 font-semibold text-sm">Field Technician</p>
                  <p className="text-gray-200 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Specialist in last-mile connectivity and customer installations.
                  </p>
                </div>
              </div>
            </div>

            {/* Developer - Mungai Mwihaki Ruth */}
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer">
              <div className="relative h-80 w-full">
                <img 
                  src="/src/assets/images/team/Ruth.jpeg" 
                  alt="Mungai Mwihaki Ruth"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">Mungai Mwihaki Ruth</h3>
                  <p className="text-primary-300 font-semibold text-sm">Lead Developer</p>
                  <p className="text-gray-200 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Driving technological advancements and digital solutions for our network.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Core Values</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-4">What Drives <span className="gradient-text">Us Forward</span></h2>
            <p className="text-gray-600">Our principles guide everything we do at Spylink Networks</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group"
              >
                <div className={`bg-gradient-to-br ${value.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <value.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Links Section - WhatsApp, Terms, FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Quick <span className="gradient-text">Resources</span></h2>
            <p className="text-gray-600">Get help, read our policies, or chat with our support team</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {quickLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.link}
                target={link.link.startsWith('http') ? '_blank' : '_self'}
                rel={link.link.startsWith('http') ? 'noopener noreferrer' : ''}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group cursor-pointer block"
              >
                <div className={`bg-gradient-to-br ${link.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <link.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{link.title}</h3>
                <p className="text-gray-500 text-sm">{link.description}</p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Location Section - Bungoma */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Visit Our <span className="gradient-text">Headquarters</span></h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-gray-600">Bungoma, Kenya</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Phone / WhatsApp</h3>
                    <p className="text-gray-600">0740370328</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">info@spylink.co.ke</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center"
            >
              <div className="text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">📍 Bungoma, Kenya</p>
                <p className="text-sm text-gray-400 mt-2">Main Headquarters</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Join Us?</h2>
            <p className="text-xl text-white/90 mb-8">Experience the Spylink difference today</p>
            <Link to="/packages" className="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105">
              View Our Packages
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;