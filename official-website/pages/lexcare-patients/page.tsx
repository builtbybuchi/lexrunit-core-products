import React from 'react';
import PageHeader from '../../components/PageHeader';
import { PatientAppIcon } from '../../components/icons/ProductIcons';

export default function LexCarePatientsPage() {
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <PageHeader
                title="LexCare"
                subtitle="Your health, in your hands. Connect with hospitals and manage your records effortlessly."
            />

            {/* Hero / Download Section */}
            <section className="bg-white py-20 md:py-28">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl md:text-6xl font-serif text-gray-800 leading-tight mb-6">
                                Healthcare <span className="text-lex-bright-blue">simplified</span> for you.
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 mb-8">
                                Book appointments, access medical records, and consult with doctors—all from your smartphone. Experience the future of patient-centric care.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-all shadow-lg">
                                    <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.523 15.3414C17.513 15.3414 17.503 15.3414 17.493 15.3414C16.634 14.8564 16.103 13.9664 16.103 12.9814C16.103 11.5564 17.263 10.3964 18.688 10.3964C18.758 10.3964 18.828 10.4014 18.898 10.4114C18.588 9.2514 17.523 8.3964 16.253 8.3964C15.583 8.3964 14.963 8.6264 14.463 9.0064C13.923 9.4164 13.243 9.6664 12.503 9.6664C11.763 9.6664 11.083 9.4164 10.543 9.0064C10.043 8.6264 9.423 8.3964 8.753 8.3964C6.683 8.3964 5.003 10.0764 5.003 12.1464C5.003 13.6664 5.903 14.9864 7.223 15.5964C7.223 15.5964 7.223 15.5964 7.233 15.5964C7.753 16.8964 8.863 18.9664 10.253 20.9664C10.743 21.6764 11.293 22.3964 11.883 22.3964C11.933 22.3964 11.983 22.3964 12.033 22.3964C12.493 22.3464 12.913 22.1464 13.253 21.8364C13.663 21.4664 14.203 21.2464 14.793 21.2464C15.383 21.2464 15.923 21.4664 16.333 21.8364C16.673 22.1464 17.093 22.3464 17.553 22.3964C17.603 22.3964 17.653 22.3964 17.703 22.3964C18.293 22.3964 18.843 21.6764 19.333 20.9664C19.903 20.1464 20.403 19.1864 20.783 18.1564C19.003 17.6964 17.663 16.1764 17.523 15.3414ZM14.793 7.3964C14.793 6.3464 14.363 5.3964 13.663 4.6964C12.963 3.9964 12.013 3.5664 10.963 3.5664C10.963 3.5664 10.963 3.5664 10.953 3.5664C10.953 4.6164 11.383 5.5664 12.083 6.2664C12.783 6.9664 13.733 7.3964 14.783 7.3964C14.783 7.3964 14.793 7.3964 14.793 7.3964Z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-xs">Download on the</div>
                                        <div className="text-lg font-bold leading-none">App Store</div>
                                    </div>
                                </button>
                                <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-all shadow-lg">
                                    <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3.609 2.836C3.336 2.984 3.141 3.234 3.063 3.547C3.016 3.734 3 3.969 3 5.547V18.453C3 20.031 3.016 20.266 3.063 20.453C3.141 20.766 3.336 21.016 3.609 21.164C3.828 21.281 4.016 21.297 4.375 21.219C4.531 21.188 6.969 18.797 11.703 14.156L12.563 13.313L11.719 12.453C10.875 11.594 10.875 11.594 4.375 5.219C3.906 4.766 3.766 4.688 3.609 2.836ZM13.828 12.047L12.984 12.891L16.031 15.938C17.703 17.609 19.094 18.984 19.125 18.984C19.234 18.969 21.391 17.734 21.734 17.531C22.094 17.328 22.094 17.313 13.828 12.047ZM13.828 12.047L22.094 6.781C22.094 6.781 22.094 6.766 21.734 6.563C21.391 6.359 19.234 5.125 19.125 5.109C19.094 5.109 17.703 6.484 16.031 8.156L12.984 11.203L13.828 12.047Z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-xs">GET IT ON</div>
                                        <div className="text-lg font-bold leading-none">Google Play</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <div className="relative w-64 h-[500px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
                                {/* Mock Phone Screen */}
                                <div className="absolute top-0 left-0 w-full h-full bg-white flex flex-col">
                                    <div className="h-8 bg-gray-100 w-full flex justify-center items-center text-[10px] text-gray-500">9:41</div>
                                    <div className="flex-1 p-4 bg-lex-bright-blue/10">
                                        <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                                            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-8 w-16 bg-lex-bright-blue/20 rounded"></div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                                            <div className="flex gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                                <div>
                                                    <div className="h-3 w-32 bg-gray-200 rounded mb-1"></div>
                                                    <div className="h-3 w-20 bg-gray-100 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="h-20 bg-gray-50 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="h-16 bg-white border-t flex justify-around items-center px-4">
                                        <div className="w-6 h-6 bg-lex-bright-blue rounded-full"></div>
                                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why use the LexCare App?</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to manage your health journey in one secure, easy-to-use application.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Instant Appointments',
                                desc: 'Book appointments with top specialists in your area without the wait.',
                                icon: (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Digital Health Records',
                                desc: 'Access your medical history, prescriptions, and lab results anytime, anywhere.',
                                icon: (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                )
                            },
                            {
                                title: 'Secure Messaging',
                                desc: 'Chat directly with your healthcare providers for follow-ups and quick questions.',
                                icon: (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                )
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100">
                                <div className="w-12 h-12 bg-lex-med-blue rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-lex-med-blue/20">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-lex-dark-blue text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to take control?</h2>
                    <p className="text-lex-light-blue text-lg mb-10 max-w-2xl mx-auto">
                        Download LexCare today and experience healthcare the way it should be.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-lex-dark-blue px-8 py-3 rounded-full font-bold hover:bg-lex-light-blue transition-all">
                            Download Now
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
