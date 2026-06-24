import React from 'react';
import PageHeader from '../../../components/PageHeader';

const DrAndrePage = () => {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <PageHeader
        title="Dr. Andre"
        subtitle="Your AI-Powered Health Companion on WhatsApp – Available 24/7"
      />

      {/* Google-Style Intro Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-3xl md:text-5xl lg:text-6xl font-serif text-gray-800 leading-tight">
            Healthcare guidance <span className="text-lex-bright-blue">instantly</span>, right in your{' '}
            <span className="bg-green-500 text-white px-2 md:px-4 rounded-md">WhatsApp</span>.
          </p>
          <p className="mt-6 text-center text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Dr. Andre combines advanced AI with medical knowledge to provide instant health consultations, symptom analysis, and personalized wellness guidance—no appointments needed.
          </p>
        </div>
      </section>

      {/* Chat Demo Section */}
      <section className="py-20 bg-lex-dark-blue relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-lex-med-blue/10 skew-x-12 transform origin-top-right"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-lex-bright-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Content */}
            <div className="lg:w-1/2 text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-white font-semibold text-sm mb-6 w-fit">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Online 24/7
              </div>

              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Chat With <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lex-bright-blue">Dr. Andre</span> Now
              </h2>

              <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
                Simply send a message on WhatsApp and get instant, reliable health information. Dr. Andre understands your symptoms, provides guidance, and helps you make informed health decisions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/2349012512401"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1 text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Start Chat Now
                </a>
              </div>

              <div className="mt-8 flex items-center gap-4 text-sm text-gray-400">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-lex-dark-blue flex items-center justify-center text-xs text-white font-bold">+2k</div>
                </div>
                <p>Trusted by thousands of users daily</p>
              </div>
            </div>

            {/* Right Visual - Chat Interface Mockup */}
            <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-gray-900 relative z-10 transform rotate-2 hover:rotate-0 transition-all duration-500">
                    {/* Header */}
                    <div className="bg-[#075E54] p-4 flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                      <img 
                      src="https://res.cloudinary.com/dlvffw5wt/image/upload/v1775344548/Dr_Andre_hj5naj.jpg" 
                      alt="Dr. Andre" 
                      className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">Dr. Andre</h3>
                      <p className="text-xs text-white/80">Online</p>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="bg-[#E5DDD5] h-[400px] p-4 flex flex-col gap-4 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://res.cloudinary.com/dlvffw5wt/image/upload/v1775344548/Dr_Andre_hj5naj.jpg")' }}></div>

                    <div className="self-end bg-[#DCF8C6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] relative z-10">
                      <p className="text-sm text-gray-800">Hi Dr. Andre, I've been feeling tired lately and have headaches. What could be wrong?</p>
                      <span className="text-[10px] text-gray-500 block text-right mt-1">10:42 AM</span>
                    </div>

                    <div className="self-start bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative z-10">
                      <p className="text-sm text-gray-800">Hello! I'm here to help. Those symptoms could have several causes. Let me ask a few questions to better understand your situation.</p>
                      <span className="text-[10px] text-gray-500 block text-right mt-1">10:42 AM</span>
                    </div>

                    <div className="self-start bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative z-10">
                      <p className="text-sm text-gray-800">Are you getting enough sleep (7-8 hours)? And how much water do you drink daily?</p>
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

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-lex-bright-blue/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section with Image Background */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dlvffw5wt/image/upload/v1775347685/this_is_engineering-woman-8499932_1920_vhwpbn.jpg"
            alt="How Dr. Andre Works"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-800/70 to-green-900/90"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center md:text-left">
              <span className="inline-block bg-white text-green-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                How It Works
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
                Simple as Messaging a Friend
              </h2>
              <p className="text-green-100 text-lg max-w-2xl">
                Getting health guidance has never been easier. Just three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300 relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">1</div>
                <div className="mt-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Open WhatsApp</h3>
                  <p className="text-green-100 leading-relaxed">
                    Click the chat button or scan the QR code to start a conversation with Dr. Andre on WhatsApp.
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300 relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">2</div>
                <div className="mt-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Describe Your Concern</h3>
                  <p className="text-green-100 leading-relaxed">
                    Type your health question or describe your symptoms in plain language. Dr. Andre understands natural conversation.
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300 relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">3</div>
                <div className="mt-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Get Instant Guidance</h3>
                  <p className="text-green-100 leading-relaxed">
                    Receive personalized health information, recommendations, and guidance on next steps within seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Built for Trust & Safety</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your health information is private and secure. Dr. Andre is designed with your safety in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Private & Secure</h3>
              <p className="text-gray-600 leading-relaxed">
                Your conversations are encrypted and private. We don't store personal health data.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Medically Informed</h3>
              <p className="text-gray-600 leading-relaxed">
                AI trained on verified medical information and continuously updated with latest guidelines.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Clear Limitations</h3>
              <p className="text-gray-600 leading-relaxed">
                Dr. Andre always recommends professional consultation for serious conditions and emergencies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-green-500 to-teal-500">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Start Your Free Health Consultation
          </h2>
          <p className="text-lg md:text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            No downloads, no sign-ups, no waiting rooms. Just open WhatsApp and start chatting with Dr. Andre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/2349012512401"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 font-bold py-4 px-10 rounded-full hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat with Dr. Andre
            </a>
            <a 
              href="/find-hospitals" 
              className="inline-block bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Find a Hospital Near You
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DrAndrePage;
