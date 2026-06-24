import React from 'react';
import PageHeader from '../components/PageHeader';
import { Heart, Hospital, Users, Zap, Shield, Clock, TrendingUp, Globe } from 'lucide-react';

const PhilosophyPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Our Philosophy"
        subtitle="Healthcare is not a privilege—it's a universal right."
      />

      {/* Core Belief Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-lex-light-blue/20 rounded-full mb-6">
              <Heart className="w-10 h-10 text-lex-med-blue" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-lex-dark-blue mb-6">
              Healthcare for <span className="text-lex-bright-blue">Everyone</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We believe that access to quality healthcare should never be determined by location, income, or circumstance. 
              Every person deserves the right to receive timely, efficient, and compassionate care.
            </p>
          </div>

          {/* Two Pillars */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-lex-bg p-8 md:p-10 rounded-2xl shadow-lg border-t-4 border-lex-med-blue hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-lex-med-blue/10 rounded-full flex items-center justify-center mb-6">
                <Hospital className="w-7 h-7 text-lex-med-blue" />
              </div>
              <h3 className="text-2xl font-bold text-lex-dark-blue mb-4">Empowering Hospitals</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                We streamline hospital operations so healthcare providers can focus on what matters most—caring for patients. 
                Our tools eliminate inefficiencies, reduce administrative burden, and help hospitals deliver better outcomes.
              </p>
            </div>

            <div className="bg-lex-bg p-8 md:p-10 rounded-2xl shadow-lg border-t-4 border-lex-bright-blue hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-lex-bright-blue/10 rounded-full flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-lex-bright-blue" />
              </div>
              <h3 className="text-2xl font-bold text-lex-dark-blue mb-4">Bringing Care to Patients</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                We build solutions that bring healthcare services closer to patients—wherever they are. 
                By breaking down barriers to access, we ensure that quality medical guidance is just a message away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Software Philosophy Section */}
      <section className="py-20 bg-lex-dark-blue text-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Software for Critical Sectors Must Be <span className="text-lex-bright-blue">Exceptional</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              When lives depend on technology, there's no room for mediocrity. We hold ourselves to the highest standards 
              because healthcare software isn't just a product—it's a lifeline.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Modern & Up-to-Date', desc: 'Built with the latest technologies to stay ahead of evolving healthcare needs.' },
              { icon: TrendingUp, title: 'Scalable', desc: 'Grows with your institution—from small clinics to large hospital networks.' },
              { icon: Shield, title: 'Powerful & Secure', desc: 'Robust systems that protect sensitive patient data without compromise.' },
              { icon: Clock, title: 'Time-Saving', desc: 'Automates repetitive tasks so staff can focus on patient care.' },
              { icon: Globe, title: 'Economically Efficient', desc: 'Delivers maximum value without straining hospital budgets.' },
              { icon: Heart, title: 'Patient-Centered', desc: 'Every feature designed to improve the patient experience.' },
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-colors duration-300">
                <div className="w-12 h-12 bg-lex-bright-blue/20 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-lex-bright-blue" />
                </div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-gradient-to-br from-lex-dark-blue to-lex-med-blue p-8 md:p-12 rounded-2xl shadow-xl text-white text-center">
            <blockquote className="text-2xl md:text-3xl italic font-light leading-relaxed mb-6">
              "Our mission is simple: streamline activities for hospitals and build solutions that bring healthcare services 
              closer to every patient. Because when healthcare works better, everyone wins."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full"></div>
              <div className="text-left">
                <p className="font-bold text-lg">Maduabuchi Onah</p>
                <p className="text-lex-light-blue">Founder & CEO, Lexrunit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-lex-bg">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-lex-dark-blue mb-6">
            Join Us in Making Healthcare Accessible to All
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/products" className="bg-lex-med-blue text-white font-bold py-3 px-8 rounded-full hover:bg-lex-bright-blue transition-colors duration-300">
              Explore Our Products
            </a>
            <a href="/contact" className="bg-transparent border-2 border-lex-dark-blue text-lex-dark-blue font-bold py-3 px-8 rounded-full hover:bg-lex-dark-blue hover:text-white transition-colors duration-300">
              Partner With Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PhilosophyPage;
