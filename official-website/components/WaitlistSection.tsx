import React, { useState } from 'react';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID } from 'appwrite';
import { Check, Loader2, Mail, User } from 'lucide-react';

type Props = { compact?: boolean };

const WaitlistSection: React.FC<Props> = ({ compact = false }) => {
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
        <div 
            className={`rounded-3xl px-4 py-8 md:px-8 md:py-12 shadow-lg ${compact ? 'mt-3' : 'mt-12'} w-full font-hand`}
            style={{ background: 'linear-gradient(135deg, hsl(230, 100%, 26%) 0%, hsl(230, 100%, 35%) 100%)' }}
        >
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
                {/* Left side - Text content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-block px-4 py-1.5 bg-white/20 text-white rounded-full text-sm font-semibold mb-4">
                        Coming February 2026
                    </div>
                    <h2 className="text-white text-3xl md:text-4xl lg:text-5xl mb-4" style={{ fontWeight: 700 }}>
                        Be the first to know
                    </h2>
                    <p className="text-white/80 text-lg md:text-xl mb-4" style={{ fontWeight: 500 }}>
                        Join the waitlist for exclusive updates, early access, and be part of the future of healthcare accessibility.
                    </p>
                </div>

                {/* Right side - Form */}
                <div className="flex-1 w-full max-w-md">
                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        {status === 'success' ? (
                            <div className="text-center py-4">
                                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Check className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">You're on the list!</h3>
                                <p className="text-gray-600 text-sm">Thanks for joining. We'll keep you posted.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-4 text-lex-med-blue font-medium hover:underline text-sm"
                                >
                                    Register another email
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="waitlist-name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            id="waitlist-name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lex-med-blue focus:border-transparent transition-all outline-none"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="waitlist-email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            id="waitlist-email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lex-med-blue focus:border-transparent transition-all outline-none"
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
                                    className="w-full bg-lex-med-blue text-white py-3 rounded-xl font-bold text-lg hover:bg-lex-bright-blue transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center"
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
                                <p className="text-xs text-gray-500 text-center">
                                    We respect your privacy. No spam, ever.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitlistSection;
