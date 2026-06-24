import React from 'react';

const HospitalSearchSection: React.FC = () => {
    return (
        <section className="relative py-28 bg-gray-50 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/operationscontrol.jpeg"
                    alt="Hospital Background"
                    className="w-full h-full object-cover filter grayscale opacity-20"
                />
                <div className="absolute inset-0 bg-white/90"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-lex-dark-blue mb-6">
                    Find Care Near You
                </h2>
                <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                    Locate top-rated hospitals and discover which LexrunIt health products they use.
                    Filter by specialty, insurance, and available technology.
                </p>

                {/* Mock Search Bar / CTA */}
                <div className="max-w-3xl mx-auto bg-white p-2 rounded-full shadow-2xl flex flex-col sm:flex-row items-center gap-2 transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex-grow flex items-center px-6 py-3 w-full sm:w-auto">
                        <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by city, hospital, or specialty..."
                            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                            readOnly // Read-only since it redirects
                        />
                    </div>
                    <a
                        href="/find-hospitals"
                        className="bg-lex-bright-blue text-white font-bold py-3 px-8 rounded-full hover:bg-lex-med-blue transition-colors w-full sm:w-auto text-center"
                    >
                        Search
                    </a>
                </div>

                {/* Quick Tags */}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {['Cardiology', 'Pediatrics', 'Dentistry', 'General Practice', 'Emergency'].map((tag) => (
                        <a
                            key={tag}
                            href="/find-hospitals"
                            className="px-4 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                        >
                            {tag}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HospitalSearchSection;
