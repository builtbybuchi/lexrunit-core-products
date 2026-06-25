import React from 'react';
import PageHeader from '../../components/PageHeader';

export default function FeaturesPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <PageHeader
        title="L'Hopital"
        subtitle="AI-Powered Healthcare Management Platform with local, distributed and persistant DB"
      />

      {/* Google-Style Intro Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-3xl md:text-5xl lg:text-6xl font-serif text-gray-800 leading-tight">
            The <span className="text-lex-bright-blue">complete</span> platform for{' '}
            <span className="bg-lex-med-blue text-white px-2 md:px-4 rounded-md">modern</span> healthcare delivery.
          </p>
          <p className="mt-6 text-center text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            L'Hopital integrates intelligent AI, comprehensive hospital management, and powerful analytics to revolutionize patient care.
          </p>
        </div>
      </section>

      {/* AI Consultation Section with Sticky Background */}
      <div className="relative">
        <div className="sticky top-0 h-[50vh] md:h-[55vh] lg:h-[60vh] w-full z-0 flex items-end">
          <img
            src="https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1775345398/zillurrahmanraju-test-10140809_1920_rebhor.jpg"
            alt="AI Consultation Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-lex-dark-blue/30"></div>
        </div>
        <div className="relative z-10 -mt-[25vh] md:-mt-[28vh] lg:-mt-[30vh]">
          <section className="min-h-screen flex flex-col justify-start pt-[40vh] md:pt-[48vh] lg:pt-[55vh] pb-16 bg-gradient-to-b from-transparent via-lex-dark-blue/85 to-lex-dark-blue/95">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                  <span className="inline-block bg-lex-bright-blue/90 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                    AI Consultation
                  </span>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
                    Intelligent Diagnostics
                  </h2>
                  <p className="text-lex-light-blue text-lg max-w-2xl">
                    Advanced AI algorithms enhance diagnostic accuracy and treatment recommendations
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">Diagnostic Assistance</h3>
                        <p className="text-lex-light-blue text-sm">
                          AI analyzes symptoms, history, and tests to suggest diagnoses
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">Treatment Plans</h3>
                        <p className="text-lex-light-blue text-sm">
                          Evidence-based recommendations tailored to patient factors
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">Medical Imaging</h3>
                        <p className="text-lex-light-blue text-sm">
                          Advanced recognition identifies abnormalities in scans
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">Risk Assessment</h3>
                        <p className="text-lex-light-blue text-sm">
                          Predictive models enable preventive interventions
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">24/7 Availability</h3>
                        <p className="text-lex-light-blue text-sm">
                          Round-the-clock AI support for healthcare providers
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">Improved Accuracy</h3>
                        <p className="text-lex-light-blue text-sm">
                          30% reduction in diagnostic errors with AI assistance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Hospital Management Section with Sticky Background */}
      <div className="relative">
        <div className="sticky top-0 h-[50vh] md:h-[55vh] lg:h-[60vh] w-full z-0 flex items-end">
          <img
            src="https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1775345380/elf-moondance-hospital-6700680_1920_dbsza1.webp"
            alt="Hospital Management Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-lex-bright-blue/20"></div>
        </div>
        <div className="relative z-10 -mt-[25vh] md:-mt-[28vh] lg:-mt-[30vh]">
          <section className="min-h-screen flex flex-col justify-start pt-[40vh] md:pt-[48vh] lg:pt-[55vh] pb-16 bg-gradient-to-b from-transparent via-white/85 to-white/95">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                  <span className="inline-block bg-lex-med-blue text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                    Hospital Management
                  </span>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-lex-dark-blue mb-3">
                    Complete Operations Control
                  </h2>
                  <p className="text-gray-700 text-lg max-w-2xl">
                    Streamline every aspect of hospital administration and patient care
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/80 backdrop-blur-lg rounded-xl p-5 border border-lex-light-blue/50 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-med-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-lex-dark-blue mb-1">Patient Management</h3>
                        <p className="text-gray-600 text-sm">
                          Complete records, scheduling & automated reminders
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-lg rounded-xl p-5 border border-lex-light-blue/50 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-lex-dark-blue mb-1">Resource Allocation</h3>
                        <p className="text-gray-600 text-sm">
                          AI-optimized staff schedules & bed assignments
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-lg rounded-xl p-5 border border-lex-light-blue/50 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-med-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-lex-dark-blue mb-1">Inventory Control</h3>
                        <p className="text-gray-600 text-sm">
                          Automated tracking with predictive ordering
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-lg rounded-xl p-5 border border-lex-light-blue/50 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-lex-dark-blue mb-1">Billing & Insurance</h3>
                        <p className="text-gray-600 text-sm">
                          Streamlined processes & claim management
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-lg rounded-xl p-5 border border-lex-light-blue/50 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-med-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-lex-dark-blue mb-1">Appointment System</h3>
                        <p className="text-gray-600 text-sm">
                          Smart scheduling with automated confirmations
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-lg rounded-xl p-5 border border-lex-light-blue/50 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-lex-dark-blue mb-1">Quality Assurance</h3>
                        <p className="text-gray-600 text-sm">
                          45% reduction in administrative workload
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Analytics Section with Sticky Background */}
      <div className="relative">
        <div className="sticky top-0 h-[50vh] md:h-[55vh] lg:h-[60vh] w-full z-0 flex items-end">
          <img
            src="https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1775345396/elf-moondance-doctor-6029164_1920_iu1y7r.png"
            alt="Analytics Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-lex-med-blue/30"></div>
        </div>
        <div className="relative z-10 -mt-[25vh] md:-mt-[28vh] lg:-mt-[30vh]">
          <section className="min-h-screen flex flex-col justify-start pt-[40vh] md:pt-[48vh] lg:pt-[55vh] pb-16 bg-gradient-to-b from-transparent via-lex-med-blue/80 to-lex-med-blue/95">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                  <span className="inline-block bg-lex-bright-blue text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                    Analytics & Insights
                  </span>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
                    Data-Driven Decisions
                  </h2>
                  <p className="text-lex-light-blue text-lg max-w-2xl">
                    Transform healthcare data into actionable insights
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">Clinical Analytics</h3>
                        <p className="text-lex-light-blue text-sm">
                          Patient outcomes & treatment efficacy analysis
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">Operational Metrics</h3>
                        <p className="text-lex-light-blue text-sm">
                          Resource utilization & workflow efficiency KPIs
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">Predictive Models</h3>
                        <p className="text-lex-light-blue text-sm">
                          Forecast admissions & resource needs
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">Population Health</h3>
                        <p className="text-lex-light-blue text-sm">
                          Trends & risk factors for public health
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">Custom Reports</h3>
                        <p className="text-lex-light-blue text-sm">
                          Tailored dashboards for every department
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="flex items-start mb-3">
                      <div className="bg-lex-bright-blue p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">Real-Time Data</h3>
                        <p className="text-lex-light-blue text-sm">
                          Live updates for instant decision-making
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Integration Section with Sticky Background */}
      <div className="relative">
        <div className="sticky top-0 h-[50vh] md:h-[55vh] lg:h-[60vh] w-full z-0 flex items-end">
          <img
            src="https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1775345387/mohamed_hassan-online-8579179_1920_pljpaa.png"
            alt="Integration Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-lex-bright-blue/25"></div>
        </div>
        <div className="relative z-10 -mt-[25vh] md:-mt-[28vh] lg:-mt-[30vh]">
          <section className="min-h-screen flex flex-col justify-start pt-[40vh] md:pt-[48vh] lg:pt-[55vh] pb-16 bg-gradient-to-b from-transparent via-white/85 to-white/95">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                  <span className="inline-block bg-lex-med-blue text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                    Integration
                  </span>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-lex-dark-blue mb-3">
                    Seamless Connectivity
                  </h2>
                  <p className="text-gray-700 text-lg max-w-2xl">
                    Connect with existing healthcare systems effortlessly
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg border border-lex-light-blue/50 hover:shadow-xl transition-all">
                    <div className="text-lex-med-blue mb-3">
                      <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-lex-dark-blue font-bold text-sm">EHR Systems</p>
                    <p className="text-gray-600 text-xs mt-1">Electronic Health Records</p>
                  </div>

                  <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg border border-lex-light-blue/50 hover:shadow-xl transition-all">
                    <div className="text-lex-med-blue mb-3">
                      <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <p className="text-lex-dark-blue font-bold text-sm">Laboratory</p>
                    <p className="text-gray-600 text-xs mt-1">Lab Information Systems</p>
                  </div>

                  <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg border border-lex-light-blue/50 hover:shadow-xl transition-all">
                    <div className="text-lex-med-blue mb-3">
                      <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="text-lex-dark-blue font-bold text-sm">Pharmacy</p>
                    <p className="text-gray-600 text-xs mt-1">Pharmacy Management</p>
                  </div>

                  <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg border border-lex-light-blue/50 hover:shadow-xl transition-all">
                    <div className="text-lex-med-blue mb-3">
                      <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-lex-dark-blue font-bold text-sm">Medical Devices</p>
                    <p className="text-gray-600 text-xs mt-1">IoT Device Integration</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/80 backdrop-blur-lg rounded-xl p-5 border border-lex-light-blue/50 shadow-lg">
                    <div className="flex items-center mb-2">
                      <svg className="w-6 h-6 text-lex-bright-blue mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <h3 className="text-base font-bold text-lex-dark-blue">Eliminate Data Silos</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Unified platform for all healthcare data and workflows
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-lg rounded-xl p-5 border border-lex-light-blue/50 shadow-lg">
                    <div className="flex items-center mb-2">
                      <svg className="w-6 h-6 text-lex-bright-blue mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <h3 className="text-base font-bold text-lex-dark-blue">Complete Patient View</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      360-degree patient information across all systems
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-lex-dark-blue via-lex-med-blue to-lex-bright-blue">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Transform Your Healthcare Facility
          </h2>
          <p className="text-lg md:text-xl text-lex-light-blue mb-10 max-w-2xl mx-auto">
            Join leading hospitals across Africa delivering better patient outcomes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="inline-block bg-white text-lex-med-blue font-bold py-4 px-10 rounded-full hover:bg-lex-light-blue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Schedule a Demo
            </a>
            <a 
              href="/contact" 
              className="inline-block bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-lex-med-blue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
