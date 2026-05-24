import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Database, Lock, UserCheck, Mail, Cookie, AlertTriangle } from 'lucide-react';

const PrivacyPage = () => {
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: 'We collect personal information including your name, email address, phone number, physical address, payment information, and usage data to provide and improve our services.'
    },
    {
      icon: Database,
      title: 'How We Use Your Information',
      content: 'Your information is used to process payments, provide customer support, improve our services, send important updates, and comply with legal obligations.'
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: 'We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information.'
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: 'You have the right to access, correct, or delete your personal information. You can also request a copy of your data or withdraw consent for marketing communications.'
    },
    {
      icon: Mail,
      title: 'Marketing Communications',
      content: 'With your consent, we may send you promotional emails about our services. You can opt out at any time by clicking the unsubscribe link or contacting support.'
    },
    {
      icon: Cookie,
      title: 'Cookies and Tracking',
      content: 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser.'
    },
    {
      icon: AlertTriangle,
      title: 'Third-Party Services',
      content: 'We may share your information with trusted third-party partners for payment processing, analytics, and customer support. These partners are contractually obligated to protect your data.'
    }
  ];

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
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-gray-500 mt-2">
            Your privacy is important to us. Learn how we protect your data.
          </p>
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              {/* Intro */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-primary-600" />
                  <h2 className="text-2xl font-bold">Our Commitment to Privacy</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  At Spylink Networks, we are committed to protecting your privacy and ensuring 
                  the security of your personal information. This Privacy Policy explains how we 
                  collect, use, and safeguard your data when you use our services.
                </p>
              </div>

              {/* Sections */}
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-8 last:mb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                      <section.icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                  {index < sections.length - 1 && (
                    <div className="border-b border-gray-200 my-6"></div>
                  )}
                </motion.div>
              ))}

              {/* Contact for Privacy Questions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-2">Questions About Privacy?</h3>
                <p className="text-gray-600 mb-3">
                  If you have any questions about our privacy practices or would like to exercise your privacy rights, please contact us:
                </p>
                <div className="flex flex-col gap-2 text-sm">
                  <p>📧 Email: privacy@spylink.co.ke</p>
                  <p>📞 Phone: 0740370328</p>
                  <p>📍 Address: Bungoma, Kenya</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Protection Notice */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800 mb-1">Data Protection Commitment</h3>
                <p className="text-sm text-green-700">
                  We are committed to complying with applicable data protection laws and regulations. 
                  We regularly review and update our privacy practices to ensure your information 
                  remains secure and protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;