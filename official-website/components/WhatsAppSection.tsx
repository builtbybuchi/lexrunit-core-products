import React from 'react';

const WhatsAppSection: React.FC = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-lex-dark-blue">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-lex-med-blue/10 skew-x-12 transform origin-top-right"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-lex-bright-blue/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Content */}
                    <div className="lg:w-1/2 text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-white-400 font-semibold text-sm mb-6 w-fit">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            Online 24/7
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-lex-bright-blue to-white">Dr. Andre</span>, <br />
                            Your AI Health Companion
                        </h2>

                        <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
                            Get instant medical answers, symptom analysis, and health tips directly on WhatsApp.
                            It's like having a doctor in your pocket, available anytime, anywhere.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="https://wa.me/2349012512401"
                                target="_blank"
                                className="bg-white text-lex-dark-blue font-bold py-4 px-8 rounded-full text-lg hover:bg-lex-light-blue transition-all duration-300 shadow-lg hover:shadow-white/20 transform hover:-translate-y-1 text-center"
                            >
                                Chat Now for Free
                            </a>
                            <a
                                href="/products/dr-andre"
                                className="bg-transparent border border-white/30 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-white/10 transition-all duration-300 text-center"
                            >
                                Learn More
                            </a>
                        </div>

                        <div className="mt-8 flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex -space-x-2">
                                {/*
                                <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-lex-dark-blue"></div>
                                <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-lex-dark-blue"></div>
                                */}
                                <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-lex-dark-blue flex items-center justify-center text-xs text-white font-bold">+2k</div>
                            </div>
                            <p>Trusted by thousands of users daily</p>
                        </div>
                    </div>

                    {/* Right Visual - Chat Interface Mockup */}
                    <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-md">
                            {/* Phone Frame / Chat Container */}
                            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-gray-900 relative z-10 transform rotate-2 hover:rotate-0 transition-all duration-500">
                                {/* Header */}
                                <div className="bg-[#075E54] p-4 flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden">
                                        <img src="https://res.cloudinary.com/dlvffw5wt/image/upload/v1775344548/Dr_Andre_hj5naj.jpg" alt="Dr. Andre" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Dr. Andre</h3>
                                        <p className="text-xs text-white/80">Online</p>
                                    </div>
                                </div>

                                {/* Chat Area */}
                                <div className="bg-[#E5DDD5] h-[400px] p-4 flex flex-col gap-4 overflow-hidden relative">
                                    {/* Chat Background Pattern */}
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}></div>

                                    {/* Messages */}
                                    <div className="self-end bg-[#DCF8C6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] relative z-10 animate-[fadeInUp_0.5s_ease-out_forwards]">
                                        <p className="text-sm text-gray-800">Hi Dr. Andre, I've been having a headache for 2 days. What should I do?</p>
                                        <span className="text-[10px] text-gray-500 block text-right mt-1">10:42 AM</span>
                                    </div>

                                    <div className="self-start bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative z-10 animate-[fadeInUp_0.5s_ease-out_0.5s_forwards] opacity-0" style={{ animationDelay: '0.5s' }}>
                                        <p className="text-sm text-gray-800">Hello! I can help with that. Are you experiencing any other symptoms like fever, sensitivity to light, or nausea?</p>
                                        <span className="text-[10px] text-gray-500 block text-right mt-1">10:42 AM</span>
                                    </div>

                                    <div className="self-end bg-[#DCF8C6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] relative z-10 animate-[fadeInUp_0.5s_ease-out_1.5s_forwards] opacity-0" style={{ animationDelay: '1.5s' }}>
                                        <p className="text-sm text-gray-800">Just a bit of nausea, no fever.</p>
                                        <span className="text-[10px] text-gray-500 block text-right mt-1">10:43 AM</span>
                                    </div>

                                    <div className="self-start bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative z-10 animate-[fadeInUp_0.5s_ease-out_2.5s_forwards] opacity-0" style={{ animationDelay: '2.5s' }}>
                                        <p className="text-sm text-gray-800">It sounds like it could be a tension headache or a migraine. Make sure to stay hydrated and rest in a quiet, dark room. If it persists, please see a doctor.</p>
                                        <span className="text-[10px] text-gray-500 block text-right mt-1">10:43 AM</span>
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="bg-[#f0f0f0] p-3 flex items-center gap-2">
                                    <div className="flex-grow bg-white rounded-full h-10 px-4 flex items-center text-gray-400 text-sm">Type a message...</div>
                                    <div className="w-10 h-10 bg-[#075E54] rounded-full flex items-center justify-center text-white">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements around phone */}
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#25D366]/20 rounded-full blur-xl animate-pulse"></div>
                            <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-lex-bright-blue/20 rounded-full blur-xl"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
};

export default WhatsAppSection;
