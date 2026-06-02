import React from 'react';
import { Link } from 'react-router-dom';

export function PaymentCancel() {
  return (
    <div className="max-w-3xl mx-auto py-24 text-center">
      <h2 className="text-2xl font-semibold mb-2">Payment canceled</h2>
      <p className="text-sm text-gray-500 mb-4">You canceled the payment. No charge was made.</p>
      <Link to="/courses" className="inline-block px-4 py-2 bg-primary text-white rounded">Back to courses</Link>
    </div>
  );
}

export default null;
