import React, { useState } from 'react';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID } from 'appwrite';
import { Check, Loader2, MessageSquare, Star } from 'lucide-react';

const FeedbackPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        product: 'general',
        rating: '5',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.FEEDBACK,
                ID.unique(),
                {
                    ...formData,
                    createdAt: new Date().toISOString()
                }
            );
            setStatus('success');
            setFormData({ name: '', email: '', product: 'general', rating: '5', message: '' });
        } catch (error) {
            console.error('Feedback submission failed:', error);
            setStatus('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-lex-dark-blue mb-4">We Value Your Feedback</h1>
                    <p className="text-gray-600">Help us improve our products and services to better serve your healthcare needs.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    {status === 'success' ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                            <p className="text-gray-600 mb-6">Your feedback has been received and is very valuable to us.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="px-6 py-2 bg-lex-med-blue text-white rounded-lg font-medium hover:bg-lex-bright-blue transition-colors"
                            >
                                Send More Feedback
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lex-med-blue focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lex-med-blue focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product / Service</label>
                                    <select
                                        name="product"
                                        value={formData.product}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lex-med-blue focus:border-transparent outline-none bg-white"
                                    >
                                        <option value="general">General Feedback</option>
                                        <option value="dr-andre">Dr. Andre</option>
                                        <option value="lexcare-hms">LexCare HMS</option>
                                        <option value="lexcare-patients">LexCare Patient App</option>
                                        <option value="website">Website Experience</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                    <div className="flex items-center gap-4 h-[42px]">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, rating: star.toString() }))}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${parseInt(formData.rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lex-med-blue focus:border-transparent outline-none resize-none"
                                    placeholder="Tell us what you think..."
                                    required
                                />
                            </div>

                            {status === 'error' && (
                                <p className="text-red-500 text-sm">Submission failed. Please try again.</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-lex-med-blue text-white py-3 rounded-lg font-bold text-lg hover:bg-lex-bright-blue transition-colors flex items-center justify-center"
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <MessageSquare className="w-5 h-5 mr-2" />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
