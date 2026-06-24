
import React from 'react';
import PageHeader from '../components/PageHeader';
import { MailIcon, PhoneIcon, LocationIcon } from '../components/icons/ContactIcons';

const ContactPage: React.FC = () => {

    const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (status === 'submitting') {
            return;
        }

        setStatus('submitting');

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8001/api/v1';
            const API_KEY = import.meta.env.VITE_LEXRUNIT_API_KEY || 'default-dev-key';
            const response = await fetch(`${BASE_URL}/contact`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-lexrunit-api-key': API_KEY
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setStatus('success');
            form.reset();
            alert('Thank you for your message! We will get back to you shortly.');
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setStatus('error');
            alert('Something went wrong. Please try again later.');
        } finally {
            setStatus('idle');
        }
    };

    return (
        <div>
            <PageHeader
                title="Get In Touch"
                subtitle="Have a question or a project in mind? We'd love to hear from you."
            />
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="flex items-start space-x-4">
                                <div className="bg-lex-light-blue text-lex-med-blue p-3 rounded-full flex-shrink-0 mt-1">
                                    <MailIcon />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-lex-dark-blue">Email</h3>
                                    <p className="text-gray-600">Reach out to us for any inquiries.</p>
                                    <a href="mailto:info@lexrunit.com" className="text-lex-med-blue hover:text-lex-bright-blue font-semibold transition-colors duration-300 break-all">
                                        info@lexrunit.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="bg-lex-light-blue text-lex-med-blue p-3 rounded-full flex-shrink-0 mt-1">
                                    <PhoneIcon />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-lex-dark-blue">Phone</h3>
                                    <p className="text-gray-600">Give us a call during business hours.</p>
                                    <a href="tel:+1234567890" className="text-lex-med-blue hover:text-lex-bright-blue font-semibold transition-colors duration-300">
                                        +234 (0) 901 251 2401                                  </a>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="bg-lex-light-blue text-lex-med-blue p-3 rounded-full flex-shrink-0 mt-1">
                                    <LocationIcon />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-lex-dark-blue">Office</h3>
                                    <p className="text-gray-600">Come visit us at our headquarters.</p>
                                    <p className="font-semibold text-lex-dark-blue">
                                        Lion Science Park, University of Nigeria
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-lex-bg p-8 rounded-2xl shadow-lg">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                    <input type="text" id="name" name="name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lex-med-blue transition-shadow" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input type="email" id="email" name="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lex-med-blue transition-shadow" />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                    <input type="text" id="subject" name="subject" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lex-med-blue transition-shadow" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                    <textarea id="message" name="message" rows={4} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lex-med-blue transition-shadow"></textarea>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="w-full bg-lex-med-blue text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-lex-bright-blue disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {status === 'submitting' ? 'Sending…' : 'Send Message'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
