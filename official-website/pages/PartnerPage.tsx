import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID } from 'appwrite';

const PartnerPage: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.PARTNERS,
                ID.unique(),
                {
                    hospitalName: formData.get('hospitalName'),
                    contactPerson: formData.get('contactPerson'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    address: formData.get('address'),
                    message: formData.get('message'),
                    createdAt: new Date().toISOString(),
                    // status: 'pending', // Default status for new inquiries
                }
            );

            setStatus('success');
            form.reset();
        } catch (error) {
            console.error('Error submitting partner inquiry:', error);
            setStatus('error');
        } finally {
            // Reset status after a delay if needed, or keep success message visible
            if (status !== 'success') {
                // setStatus('idle'); // Optional: keep success state
            }
        }
    };

    return (
        <div>
            <PageHeader
                title="Partner with Us"
                subtitle="Join the LexCare network and transform healthcare delivery in your facility."
            />
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="bg-lex-bg p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-lex-dark-blue mb-6 text-center">Hospital Registration Inquiry</h2>
                        <p className="text-gray-600 mb-8 text-center">
                            Fill out the form below to express your interest. Our team will review your details and reach out to complete the registration process.
                        </p>

                        {status === 'success' ? (
                            <div className="text-center p-8 bg-green-100 rounded-lg border border-green-200">
                                <h3 className="text-xl font-bold text-green-800 mb-2">Thank You!</h3>
                                <p className="text-green-700">
                                    Your inquiry has been received. We will be in touch shortly to discuss the next steps.
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-6 text-green-800 font-semibold hover:underline"
                                >
                                    Submit another inquiry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="hospitalName" className="block text-sm font-bold text-gray-700 mb-2">Hospital Name</label>
                                        <input type="text" id="hospitalName" name="hospitalName" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lex-med-blue transition-shadow" placeholder="e.g. General Hospital Lagos" />
                                    </div>
                                    <div>
                                        <label htmlFor="contactPerson" className="block text-sm font-bold text-gray-700 mb-2">Contact Person</label>
                                        <input type="text" id="contactPerson" name="contactPerson" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lex-med-blue transition-shadow" placeholder="Full Name" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                        <input type="email" id="email" name="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lex-med-blue transition-shadow" placeholder="admin@hospital.com" />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                        <input type="tel" id="phone" name="phone" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lex-med-blue transition-shadow" placeholder="+234..." />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-2">Hospital Address</label>
                                    <input type="text" id="address" name="address" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lex-med-blue transition-shadow" placeholder="Street Address, City, State" />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Additional Information (Optional)</label>
                                    <textarea id="message" name="message" rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lex-med-blue transition-shadow" placeholder="Tell us about your facility size, current systems, etc."></textarea>
                                </div>

                                {status === 'error' && (
                                    <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
                                        Something went wrong. Please try again later.
                                    </div>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="w-full bg-lex-med-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-lex-bright-blue transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {status === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PartnerPage;
