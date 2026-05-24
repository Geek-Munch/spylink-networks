import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Clock, Users, CreditCard, Wifi, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  const sections = [
    {
      icon: Shield,
      title: '1. Acceptance of Terms',
      content: 'By accessing and using Spylink Networks services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.'
    },
    {
      icon: Wifi,
      title: '2. Internet Service',
      content: 'Spylink Networks provides high-speed internet connectivity services. Service availability, speeds, and pricing are subject to change with notice. We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service.'
    },
    {
      icon: CreditCard,
      title: '3. Payments and Billing',
      content: 'All payments are due on or before the billing date. Late payments may result in service suspension. Installation fees are non-refundable after installation is scheduled. Monthly subscriptions are billed in advance.'
    },
    {
      icon: Clock,
      title: '4. Subscription and Cancellation',
      content: 'Subscriptions can be cancelled anytime from your dashboard. Cancellations take effect at the end of the current billing cycle. No refunds are provided for partial months. Installation fees are non-refundable.'
    },
    {
      icon: Users,
      title: '5. User Responsibilities',
      content: 'Users must not use our service for illegal activities, hacking, spamming, or distributing malicious content. You are responsible for maintaining the security of your account credentials.'
    },
    {
      icon: AlertCircle,
      title: '6. Fair Usage Policy',
      content: 'While we offer unlimited data, we reserve the right to manage network traffic to ensure quality service for all users. Excessive usage that affects network performance may be subject to throttling.'
    },
    {
      icon: FileText,
      title: '7. Equipment and Installation',
      content: 'All equipment provided remains the property of Spylink Networks unless purchased. Users are responsible for the safekeeping of rented equipment. Damage or loss may incur replacement fees.'
    },
    {
      icon: Shield,
      title: '8. Limitation of Liability',
      content: 'Spylink Networks shall not be liable for any indirect, incidental, or consequential damages arising from service interruptions, data loss, or any other issues related to service usage.'
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
            Terms & <span className="gradient-text">Conditions</span>
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-gray-500 mt-2">
            Please read these terms carefully before using our services
          </p>
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
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
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">Important Notice</h3>
                <p className="text-sm text-yellow-700">
                  By using our services, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms and Conditions. If you have any 
                  questions, please contact our support team.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Have questions about our terms? <br />
              <a href="https://wa.me/254740370328" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;