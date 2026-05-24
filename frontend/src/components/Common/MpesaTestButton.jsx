import React, { useState } from 'react';
import MpesaPaymentModal from './MpesaPaymentModal';

const MpesaTestButton = ({ amount = 10 }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Test M-Pesa Payment (KES {amount})
      </button>
      
      <MpesaPaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        amount={amount}
        accountReference="TEST-PAYMENT"
        transactionDesc="Test M-Pesa Integration"
        onSuccess={() => {
          console.log('Payment successful!');
          alert('Test payment completed!');
        }}
      />
    </>
  );
};

export default MpesaTestButton;