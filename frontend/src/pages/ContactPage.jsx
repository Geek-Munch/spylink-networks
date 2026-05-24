import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Building2, Globe, Headphones, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  
  try {
    const response = await fetch(`${API_URL}/contact/`, {...});
    
    const data = await response.json();
    
    if (response.ok) {
      toast.success(data.message || 'Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(true);
      
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      toast.error(data.error || 'Failed to send message. Please try again.');
    }
  } catch (error) {
    console.error('Contact form error:', error);
    toast.error('Network error. Please try again.');
  } finally {
    setSubmitting(false);
  }
};

  const contactInfo = [
    { 
      icon: Phone, 
      title: 'Phone / WhatsApp', 
      details: '0740370328',
      action: 'tel:+254740370328',
      color: 'from-green-500 to-emerald-500',
      description: 'Mon-Fri, 8am-6pm'
    },
    { 
      icon: Mail, 
      title: 'Email', 
      details: 'info@spylink.co.ke',
      action: 'mailto:info@spylink.co.ke',
      color: 'from-blue-500 to-cyan-500',
      description: '24/7 Response'
    },
    { 
      icon: MapPin, 
      title: 'Address', 
      details: 'Bungoma, Kenya',
      action: 'https://maps.google.com/?q=Bungoma,Kenya',
      color: 'from-red-500 to-pink-500',
      description: 'Visit our HQ'
    },
    { 
      icon: MessageCircle, 
      title: 'WhatsApp Support', 
      details: 'Chat with us',
      action: 'https://wa.me/254740370328',
      color: 'from-green-500 to-emerald-500',
      description: 'Quick responses'
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Get in Touch</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">Contact <span className="gradient-text">Us</span></h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.action}
                target={info.action.startsWith('http') || info.action.startsWith('mailto') || info.action.startsWith('tel') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group block cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`bg-gradient-to-br ${info.color} p-3 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <info.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{info.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base truncate">{info.details}</p>
                    <p className="text-xs text-gray-400 mt-1">{info.description}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Send us a <span className="gradient-text">Message</span></h2>
            
            {submitted ? (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for reaching out. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-primary-500 transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-primary-500 transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-primary-500 transition"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-primary-500 transition resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 group-hover:translate-x-1 transition" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 sm:mt-12"
        >
          <div className="bg-gray-200 rounded-xl h-64 sm:h-80 flex items-center justify-center relative overflow-hidden">
            <div className="text-center p-4">
              <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">📍 Bungoma, Kenya</p>
              <p className="text-sm text-gray-400 mt-2">Main Headquarters</p>
              <a 
                href="https://maps.google.com/?q=Bungoma,Kenya" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-3 text-primary-600 hover:underline text-sm"
              >
                View on Google Maps →
              </a>
            </div>
          </div>
        </motion.div>

        {/* Business Hours Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 sm:mt-12 bg-white rounded-xl shadow-md p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg sm:text-xl font-bold">Business Hours</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Monday - Friday</p>
              <p className="text-gray-600">8:00 AM - 6:00 PM</p>
            </div>
            <div>
              <p className="font-semibold">Saturday</p>
              <p className="text-gray-600">9:00 AM - 4:00 PM</p>
            </div>
            <div>
              <p className="font-semibold">Sunday</p>
              <p className="text-gray-600">Closed (Emergency support only)</p>
            </div>
            <div>
              <p className="font-semibold">Support Hotline</p>
              <p className="text-gray-600">24/7 - WhatsApp: 0740370328</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;