import React, { useEffect, useState } from 'react';

const PaymentCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // In a production scenario, we could call an endpoint to verify the transaction
    // However, since the backend relies on the Squad webhook for the actual subscription update,
    // we just give the webhook a moment to arrive and then display success.
    const searchParams = new URLSearchParams(window.location.search);
    const reference = searchParams.get('reference');

    if (reference) {
      const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8001/api/v1';
      fetch(`${BASE_URL}/whatsapp/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reference })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 pt-20 px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-12 w-12 text-lex-med-blue mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">Verifying Payment...</h2>
            <p className="text-gray-500 mt-2">Please wait while we confirm your transaction.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
            <p className="text-gray-500 mt-3 text-sm">
              Your subscription has been processed. You can now return to WhatsApp and start chatting with Dr. Andre!
            </p>
            <a 
              href="https://wa.me/message/YOUR_BOT_LINK" 
              className="mt-6 inline-block bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-all w-full"
            >
              Return to WhatsApp
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Invalid Request</h2>
            <p className="text-gray-500 mt-3 text-sm">
              We couldn't process this payment confirmation. If you were charged, please contact our support.
            </p>
            <a 
              href="/" 
              className="mt-6 inline-block bg-lex-med-blue text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-lex-dark-blue transition-all w-full"
            >
              Go to Homepage
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallbackPage;
