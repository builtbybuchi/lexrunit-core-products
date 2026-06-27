import React, { useEffect, useState } from 'react';
import { useAuth, useUser, UserProfile } from '@clerk/clerk-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const AccountPage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [settings, setSettings] = useState<any>({ products: [] });
  const [phone, setPhone] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [initialPhoneSet, setInitialPhoneSet] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [awaitingCode, setAwaitingCode] = useState(false);

  const syncUser = async (isManualSave = false) => {
    if (isLoaded && isSignedIn && user) {
      if (isManualSave) setIsSaving(true);
      const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8001/api/v1';
      const API_KEY = import.meta.env.VITE_LEXRUNIT_API_KEY || 'default-dev-key';
      const token = await getToken();
      
      const payload: any = {
          email: user.primaryEmailAddress?.emailAddress,
          first_name: user.firstName,
          last_name: user.lastName,
      };
      // If saving phone, pass it to sync endpoint
      if (phone) {
          payload.phone = phone; // react-phone-number-input returns +234... which our backend parses correctly
      }

      fetch(`${BASE_URL}/users/sync`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(userDoc => {
          if (userDoc.phone && !initialPhoneSet) {
              setPhone(userDoc.phone.startsWith('+') ? userDoc.phone : '+' + userDoc.phone);
              setInitialPhoneSet(true);
              setIsEditingPhone(false);
          } else if (!userDoc.phone && !initialPhoneSet) {
              setIsEditingPhone(true);
              setInitialPhoneSet(true);
          }

          if (isManualSave) {
              setIsSaving(false);
              setIsEditingPhone(false);
          }
          return fetch(`${BASE_URL}/users/settings`, { headers: { 'Authorization': `Bearer ${token}` } });
      }).then(res => res.json())
      .then(data => setSettings(data))
      .catch((e) => {
          console.error(e);
          if (isManualSave) setIsSaving(false);
      });
    }
  };

  const handleRequestVerification = async () => {
    if (!phone) return;
    setIsSaving(true);
    const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8001/api/v1';
    const token = await getToken();
    try {
      const res = await fetch(`${BASE_URL}/users/request-verification`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (data.success) {
        setAwaitingCode(true);
        setToastMessage('Verification code sent to your WhatsApp!');
        setTimeout(() => setToastMessage(''), 5000);
      } else {
        setToastMessage(data.detail || 'Failed to send verification code');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (e) {
      setToastMessage('Network error');
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) return;
    setIsVerifying(true);
    const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8001/api/v1';
    const token = await getToken();
    try {
      const res = await fetch(`${BASE_URL}/users/verify-phone`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: verificationCode })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage('Phone number verified successfully!');
        setTimeout(() => setToastMessage(''), 3000);
        setAwaitingCode(false);
        setVerificationCode('');
        // Sync user to get the new phone state and products
        syncUser(true);
      } else {
        setToastMessage(data.detail || 'Invalid verification code');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (e) {
      setToastMessage('Network error');
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setIsVerifying(false);
    }
  };

  const AVAILABLE_PRODUCTS = [
      { id: 'lexcare-hms', name: "L'Hopital", desc: 'Hospital Management System' },
      { id: 'lexcare-patient', name: 'LexCare', desc: 'Patient-facing mobile application' },
      { id: 'dr-andre', name: 'Dr. Andre AI', desc: 'AI-powered clinical assistant' },
      { id: 'partner-portal', name: 'Partner Portal', desc: 'For hospital partners and vendors' }
  ];


  useEffect(() => {
    syncUser();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-[80vh] pt-24 pb-12 bg-lex-bg flex justify-center">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-lex-dark-blue mb-8 text-center">Account Management</h1>
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex justify-center">
            <UserProfile path="/account" routing="path" />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm mt-8 relative">
            <h2 className="text-2xl font-bold text-lex-dark-blue mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-4">Please provide your WhatsApp number for system updates.</p>
            
            {toastMessage && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md text-sm animate-pulse">
                    {toastMessage}
                </div>
            )}

            <div className="flex flex-col gap-4 max-w-sm">
                {isEditingPhone ? (
                    <>
                        {!awaitingCode ? (
                            <>
                                <PhoneInput
                                    placeholder="Enter WhatsApp number"
                                    value={phone}
                                    onChange={(val: any) => setPhone(val)}
                                    className="border p-2 rounded focus:ring-2 focus:ring-lex-med-blue outline-none"
                                />
                                <button 
                                    onClick={handleRequestVerification} 
                                    disabled={isSaving}
                                    className="bg-lex-med-blue text-white py-2 px-4 rounded hover:bg-lex-bright-blue font-bold mt-2 flex justify-center items-center h-10"
                                >
                                    {isSaving ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Send Verification Code'}
                                </button>
                                <button 
                                    onClick={() => setIsEditingPhone(false)} 
                                    className="text-gray-500 hover:text-gray-800 text-sm mt-2 font-semibold"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-gray-700">Enter the 6-digit code sent to your WhatsApp.</p>
                                <input
                                    type="text"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="border p-2 rounded focus:ring-2 focus:ring-lex-med-blue outline-none tracking-widest text-center text-lg"
                                />
                                <button 
                                    onClick={handleVerifyCode} 
                                    disabled={isVerifying || verificationCode.length < 6}
                                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 font-bold mt-2 flex justify-center items-center h-10 disabled:opacity-50"
                                >
                                    {isVerifying ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Verify Code'}
                                </button>
                                <button 
                                    onClick={() => setAwaitingCode(false)} 
                                    className="text-gray-500 hover:text-gray-800 text-sm mt-2 font-semibold"
                                >
                                    Change Number
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-between border p-3 rounded bg-gray-50">
                        <span className="text-gray-800 font-medium">{phone || 'No number saved'}</span>
                        <button 
                            onClick={() => setIsEditingPhone(true)} 
                            className="text-lex-med-blue hover:text-lex-dark-blue text-sm font-semibold"
                        >
                            Edit number
                        </button>
                    </div>
                )}
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
            <h2 className="text-2xl font-bold text-lex-dark-blue mb-4">My Lexrunit Products</h2>
            <p className="text-gray-600 mb-6">This shows the Lexrunit applications you currently use. Access each application individually to interact with it.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_PRODUCTS.map(product => {
                    const isSelected = (settings?.products || []).includes(product.id);
                    if (!isSelected) return null; // Only show what they use
                    
                    return (
                        <div 
                            key={product.id} 
                            className="border border-lex-med-blue bg-lex-light-blue bg-opacity-10 rounded-lg p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lex-dark-blue">{product.name}</h3>
                                    <p className="text-sm text-gray-500">{product.desc}</p>
                                </div>
                                <div className="w-6 h-6 rounded-full border-2 border-lex-med-blue bg-lex-med-blue flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {!(settings?.products || []).length && (
                    <p className="text-gray-500 italic col-span-2">You are not currently enrolled in any Lexrunit products.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
