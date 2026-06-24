import React, { useState } from 'react';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID } from 'appwrite';
import { Check, Loader2, Mail } from 'lucide-react';

const WaitlistPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.WAITLIST,
                ID.unique(),
                {
                    name,
                    email,
                    createdAt: new Date().toISOString()
                }
            );
            setStatus('success');
            setName('');
            setEmail('');
        } catch (error) {
            console.error('Waitlist submission failed:', error);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-block px-4 py-1.5 bg-blue-100 text-lex-med-blue rounded-full text-sm font-semibold mb-6">
                    Coming February 2026
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-lex-dark-blue mb-6">
                    Dr. Andre is almost here.
                </h1>
                <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                    Join the waitlist to get exclusive weekly updates, early access, and be part of the future of healthcare accessibility.
                </p>

                <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">You're on the list!</h3>
                            <p className="text-gray-600">Thanks for joining. We'll keep you posted on our progress.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-6 text-lex-med-blue font-medium hover:underline"
                            >
                                Register another email
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lex-med-blue focus:border-transparent transition-all outline-none"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lex-med-blue focus:border-transparent transition-all outline-none"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {status === 'error' && (
                                <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-lex-med-blue text-white py-3.5 rounded-xl font-bold text-lg hover:bg-lex-bright-blue transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center"
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    'Join Waitlist'
                                )}
                            </button>
                            <p className="text-xs text-gray-500 text-center mt-4">
                                We respect your privacy. No spam, ever.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WaitlistPage;
