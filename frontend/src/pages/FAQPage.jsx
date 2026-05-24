import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Wifi, CreditCard, Settings, Shield, HelpCircle, Package, Truck, RefreshCw } from 'lucide-react';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'Subscriptions',
      icon: Wifi,
      question: 'How do I subscribe to Spylink internet?',
      answer: 'You can subscribe by visiting our Packages page, selecting your preferred package, and completing the online registration process. You\'ll need to provide your details and pay the installation fee. Our team will contact you within 24 hours to schedule installation.'
    },
    {
      id: 2,
      category: 'Payments',
      icon: CreditCard,
      question: 'What payment methods do you accept?',
      answer: 'We accept M-Pesa payments via STK Push, bank transfers, and card payments. All payments are processed securely through our payment gateway.'
    },
    {
      id: 3,
      category: 'Installation',
      icon: Settings,
      question: 'How long does installation take?',
      answer: 'Installation typically takes 2-5 business days after your payment is confirmed. Our technical team will contact you to schedule a convenient time.'
    },
    {
      id: 4,
      category: 'Security',
      icon: Shield,
      question: 'Is my connection secure?',
      answer: 'Yes! We use enterprise-grade encryption and security protocols to protect your data. All our connections are secured with WPA2/WPA3 encryption.'
    },
    {
      id: 5,
      category: 'Subscriptions',
      icon: Wifi,
      question: 'Can I upgrade or downgrade my package?',
      answer: 'Yes, you can upgrade or downgrade your package at any time. Changes will take effect from your next billing cycle. Contact our support team for assistance.'
    },
    {
      id: 6,
      category: 'Payments',
      icon: CreditCard,
      question: 'When is my monthly payment due?',
      answer: 'Your payment is due on the same date each month that you started your subscription. You can view your billing date in your dashboard.'
    },
    {
      id: 7,
      category: 'Technical',
      icon: Settings,
      question: 'What internet speeds can I expect?',
      answer: 'We deliver the speeds as advertised in your package. However, actual speeds may vary based on network congestion, your device capabilities, and distance from the router.'
    },
    {
      id: 8,
      category: 'Support',
      icon: HelpCircle,
      question: 'How do I get technical support?',
      answer: 'We offer 24/7 technical support via WhatsApp at 0740370328, email at support@spylink.co.ke, or through your dashboard ticketing system.'
    },
    {
      id: 9,
      category: 'Subscriptions',
      icon: Wifi,
      question: 'What is the installation fee?',
      answer: 'The installation fee is KES 10,000 for all packages. This includes equipment setup, configuration, and testing. First month is FREE!'
    },
    {
      id: 10,
      category: 'Products',
      icon: Package,
      question: 'Do you offer warranty on products?',
      answer: 'Yes, all networking devices come with a 1-year manufacturer warranty. Please keep your receipt for warranty claims.'
    },
    {
      id: 11,
      category: 'Delivery',
      icon: Truck,
      question: 'How long does product delivery take?',
      answer: 'Products are delivered within 1-3 business days within Nairobi and 3-5 business days for other regions in Kenya.'
    },
    {
      id: 12,
      category: 'Subscriptions',
      icon: RefreshCw,
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel anytime from your dashboard. Cancellations take effect at the end of your current billing cycle. No cancellation fees apply.'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqs.map(f => f.category))];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our services
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 bg-white"
            />
          </div>
        </motion.div>

        {/* FAQ Categories */}
        {!searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSearchTerm(cat)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-primary-50 hover:border-primary-300 transition"
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No questions found matching your search.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-primary-600 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="mb-4"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full text-left bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <faq.icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <span className="font-semibold text-gray-800">{faq.question}</span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-5 pt-4 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 max-w-2xl mx-auto"
        >
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">We're here to help you</p>
          <a
            href="https://wa.me/254740370328"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Contact Support on WhatsApp
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;