import React from 'react';

const HMSSection: React.FC = () => {
    return (
        <section className="py-24 bg-lex-dark-blue text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-lex-med-blue/10 skew-x-12 transform origin-top-right"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-lex-bright-blue/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Content */}
                    <div className="lg:w-1/2">
                        <div className="inline-block bg-lex-med-blue text-white font-bold px-4 py-1 rounded-full text-sm uppercase tracking-wide mb-6">
                            For Healthcare Providers
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Streamline Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lex-bright-blue to-white">Hospital Operations</span>
                        </h2>

                        <p className="text-lg text-lex-light-blue mb-8 leading-relaxed max-w-xl">
                            LexCare HMS is an AI-powered platform designed to optimize patient care, manage resources efficiently, and reduce administrative burdens.
                            Join the network of modern hospitals delivering superior healthcare.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="/find-hospitals"
                                className="bg-white text-lex-dark-blue font-bold py-4 px-8 rounded-full text-lg hover:bg-lex-light-blue transition-all duration-300 shadow-lg hover:shadow-white/20 transform hover:-translate-y-1 text-center"
                            >
                                Register Your Hospital
                            </a>
                            <a
                                href="/lexcare-hms"
                                className="bg-transparent border border-white/30 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-white/10 transition-all duration-300 text-center"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="lg:w-1/2 w-full">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                            <img
                                src="https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1775345388/megan_rexazin_conde-medical-5459653_1920_pulbpn.png"
                                alt="Hospital Management"
                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-lex-dark-blue/90 via-transparent to-transparent"></div>

                            {/* Floating Stats Card */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-lex-light-blue text-sm mb-1">Efficiency Increase</p>
                                        <p className="text-3xl font-bold text-white">45%</p>
                                    </div>
                                    <div className="h-10 w-24 flex items-end gap-1">
                                        <div className="w-1/4 h-1/2 bg-lex-med-blue rounded-t-sm"></div>
                                        <div className="w-1/4 h-3/4 bg-lex-med-blue rounded-t-sm"></div>
                                        <div className="w-1/4 h-2/3 bg-lex-med-blue rounded-t-sm"></div>
                                        <div className="w-1/4 h-full bg-lex-bright-blue rounded-t-sm animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HMSSection;
