import React from 'react';
import PageHeader from '../components/PageHeader';
import { Helmet } from 'react-helmet-async';
import { Target, Lightbulb, Users, Shield, Zap, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>About Us - Lexrunit, the leading HealthTech company in Africa.</title>
        <meta name="description" content="Learn about Lexrunit's mission, vision, and the team building the digital infrastructure redefining healthcare accessibility." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-24 bg-lex-dark-blue text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            On journey to streamline hospital operations and  <span className="text-lex-bright-blue">bring easier access to the patients</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            One hospital, one patient at a time
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img
                src="https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1775347685/this_is_engineering-woman-8499932_1920_vhwpbn.jpg"
                alt="Team working together"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-sm font-bold uppercase text-lex-med-blue tracking-widest mb-2">Our Story</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-lex-dark-blue mb-6">The steps!</h3>
              <p className="text-gray-600 leading-relaxed mb-4 text-lg">
                Lexrunit began with a simple yet powerful idea: hospitals should have strong, modern and efficient
                tools to streamline operations, and patients should be able to access healthcare services easily.
                
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our journey is defined by a relentless pursuit of excellence. We saw the gaps in existing digital
                solutions—clunky interfaces, unreliable systems, expensive to run and maintain and lack of 
                support—and we set out to fill them.
                Today, we are proud to be a trusted partner to health institutions looking to embrace the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-lex-bg">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white p-10 rounded-2xl shadow-lg border-t-4 border-lex-med-blue hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-lex-light-blue/20 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-lex-med-blue" />
              </div>
              <h3 className="text-2xl font-bold text-lex-dark-blue mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To engineer a unified global ecosystem of agile software, precision hardware, 
                and next-generation infrastructure that redefines the standards of healthcare 
                and enterprise efficiency.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-10 rounded-2xl shadow-lg border-t-4 border-lex-bright-blue hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-lex-light-blue/20 rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-lex-bright-blue" />
              </div>
              <h3 className="text-2xl font-bold text-lex-dark-blue mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To pioneer a seamless future where technology and care are one—connecting everything
                from personal wearables to smart hospitals into a single, intelligent, and universal 
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold uppercase text-lex-med-blue tracking-widest mb-2">Our Values</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-lex-dark-blue">What Drives Us</h3>
            <p className="text-gray-600 mt-4 text-lg">
              Our culture is built on a foundation of principles that guide every decision we make and every product we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Trust', desc: 'We build products you can rely on, prioritizing security and stability above all.' },
              { icon: Zap, title: 'Innovation', desc: 'We constantly push boundaries to find better, faster, and smarter ways to solve problems.' },
              { icon: Users, title: 'User-Centric', desc: 'We design for people. Every feature is crafted with the end-user experience in mind.' },
              { icon: Heart, title: 'Integrity', desc: 'We believe in honest, transparent partnerships with our clients and our team.' },
            ].map((value, index) => (
              <div key={index} className="text-center p-6 group">
                <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-lex-med-blue transition-colors duration-300">
                  <value.icon className="w-8 h-8 text-lex-dark-blue group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-bold text-lex-dark-blue mb-2">{value.title}</h4>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-lex-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-lex-dark-blue mb-4">Meet the Leadership</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              The visionary minds steering LexRunIt towards a future of limitless possibilities.
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="h-64 overflow-hidden bg-gray-200">
                <img
                  src="https://storage.lexrunit.com/v1/storage/buckets/website-images/files/693614d1000d7bc41c0a/view?project=68e67ffd0007ce1f504f"
                  alt="Maduabuchi Onah"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-lex-dark-blue mb-1">Maduabuchi Onah</h3>
                <p className="text-lex-med-blue font-semibold mb-4">Founder & CEO</p>
                <p className="text-gray-600 text-sm">
                  Driving the strategic vision of Lexrunit with a passion for technology and healthcare innovation.
                </p>
              </div>
            </div>

         
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="h-64 overflow-hidden bg-gray-200">
                <img
                  src="https://storage.lexrunit.com/v1/storage/buckets/website-images/files/693614d1000d7bc41c0a/view?project=68e67ffd0007ce1f504f"
                  alt="Ugwuoke Chinecherem Sussan"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-lex-dark-blue mb-1">Ugwuoke Chinecherem</h3>
                <p className="text-lex-med-blue font-semibold mb-4">Co-founder & Medical Expert</p>
                <p className="text-gray-600 text-sm">
                  Overseeing the clinical useability and appropriateness of the technologies, ensuring it improves hospital operation and help patients. 
                </p>
              </div>
            </div>

            
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="h-64 overflow-hidden bg-gray-200">
                <img
                  src="https://storage.lexrunit.com/v1/storage/buckets/website-images/files/693614d1000d7bc41c0a/view?project=68e67ffd0007ce1f504f"
                  alt="Nwankwo Benson"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-lex-dark-blue mb-1">Benson Nwankwo</h3>
                <p className="text-lex-med-blue font-semibold mb-4">Software Engineer</p>
                <p className="text-gray-600 text-sm">
                  Leading our engineering teams to build robust, scalable, and cutting-edge software solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-lex-dark-blue text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Build the Future?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Whether you're looking for a technology partner or a new career challenge, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/contact" className="bg-lex-bright-blue text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-lex-bright-blue transition-all duration-300 shadow-lg hover:shadow-xl">
              Contact Us
            </a>
            <a href="/careers" className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-lex-dark-blue transition-all duration-300">
              Join Our Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
