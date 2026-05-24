import React from 'react';
import { Link } from 'react-router-dom';
import { WifiIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-20 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <WifiIcon className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">Spylink</span>
            </div>
            <p className="text-gray-400">
              Providing fast, reliable, and affordable internet across Kenya since 2020.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-primary-400 transition">Home</Link></li>
              <li><Link to="/packages" className="text-gray-400 hover:text-primary-400 transition">Packages</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-primary-400 transition">Shop</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition">Support</a></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-primary-400 transition">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
  <h4 className="text-lg font-semibold mb-4">Contact</h4>
  <ul className="space-y-3">
    <li className="flex items-center gap-3 text-gray-400">
      <PhoneIcon className="h-5 w-5" />
      <span>0740370328</span>
    </li>
    <li className="flex items-center gap-3 text-gray-400">
      <a href="https://wa.me/254740370328" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary-400 transition">
        <MessageCircle className="h-5 w-5" />
        <span>0740370328 (WhatsApp)</span>
      </a>
    </li>
    <li className="flex items-center gap-3 text-gray-400">
      <EnvelopeIcon className="h-5 w-5" />
      <span>info@spylink.co.ke</span>
    </li>
    <li className="flex items-center gap-3 text-gray-400">
      <MapPinIcon className="h-5 w-5" />
      <span>Bungoma, Kenya</span>
    </li>
  </ul>
</div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Spylink Networks. All rights reserved. | Kenya's Premier Internet Service Provider</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;