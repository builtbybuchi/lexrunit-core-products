import React from 'react';

const PatientAppSection: React.FC = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#0f2444 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16">

                    {/* Right Content (Text) */}
                    <div className="lg:w-1/2">
                        <div className="inline-block bg-lex-bright-blue/10 text-lex-bright-blue font-bold px-4 py-1 rounded-full text-sm uppercase tracking-wide mb-6">
                            For Patients
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold text-lex-dark-blue mb-6 leading-tight">
                            Your Health, <br />
                            <span className="text-lex-bright-blue">In Your Hands</span>
                        </h2>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                            Book appointments, access medical records, and consult with doctors—all from your smartphone.
                            Experience the future of patient-centric care with the L'Hopital.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="/lexcare-patients"
                                className="bg-lex-dark-blue text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-lex-med-blue transition-all duration-300 shadow-lg hover:shadow-lex-dark-blue/30 transform hover:-translate-y-1 text-center"
                            >
                                Download App
                            </a>
                            <a
                                href="/lexcare-patients"
                                className="bg-transparent border border-lex-dark-blue/20 text-lex-dark-blue font-bold py-4 px-8 rounded-full text-lg hover:bg-lex-dark-blue/5 transition-all duration-300 text-center"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>

                    {/* Left Visual (App Mockup) */}
                    <div className="lg:w-1/2 w-full flex justify-center lg:justify-start">
                        <div className="relative w-72 h-[500px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden transform -rotate-3 hover:rotate-0 transition-all duration-500">
                            {/* Mock Phone Screen */}
                            <div className="absolute top-0 left-0 w-full h-full bg-white flex flex-col">
                                <div className="h-8 bg-gray-100 w-full flex justify-center items-center text-[10px] text-gray-500">9:41</div>
                                <div className="flex-1 p-4 bg-gray-50 overflow-hidden">
                                    {/* App Header */}
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <div className="text-xs text-gray-500">Welcome back,</div>
                                            <div className="font-bold text-gray-800">Sarah</div>
                                        </div>
                                        <div className="w-8 h-8 bg-lex-bright-blue rounded-full"></div>
                                    </div>

                                    {/* App Content */}
                                    <div className="bg-lex-dark-blue text-white p-4 rounded-2xl mb-4 shadow-lg">
                                        <div className="text-xs text-lex-light-blue mb-1">Upcoming Appointment</div>
                                        <div className="font-bold mb-2">Dr. Emily Chen</div>
                                        <div className="text-xs opacity-80">Today, 2:00 PM</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg mb-2"></div>
                                            <div className="text-xs font-bold text-gray-700">Records</div>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg mb-2"></div>
                                            <div className="text-xs font-bold text-gray-700">Messages</div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <div className="font-bold text-sm text-gray-800 mb-3">Recent Vitals</div>
                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2 mb-2">
                                            <span className="text-xs text-gray-500">Heart Rate</span>
                                            <span className="text-xs font-bold text-lex-med-blue">72 bpm</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Blood Pressure</span>
                                            <span className="text-xs font-bold text-lex-med-blue">120/80</span>
                                        </div>
                                    </div>
                                </div>
                                {/* App Nav */}
                                <div className="h-16 bg-white border-t flex justify-around items-center px-4">
                                    <div className="w-6 h-6 bg-lex-bright-blue rounded-full"></div>
                                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-20 -left-10 w-20 h-20 bg-lex-bright-blue/10 rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute bottom-20 -right-10 w-24 h-24 bg-lex-med-blue/10 rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PatientAppSection;
