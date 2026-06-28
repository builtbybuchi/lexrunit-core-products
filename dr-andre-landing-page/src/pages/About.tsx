import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Heart } from 'lucide-react';

const LOGO_PLACEHOLDER = 'https://res.cloudinary.com/dlvffw5wt/image/upload/v1782541050/2-removebg-preview_yei74a.png';

export default function About() {
  return (
    <main className="min-h-screen bg-page">
      <Navigation />
      
      {/* About Hero */}
      <section className="pt-32 pb-20 bg-primary-dark text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#021B4A] to-[#011233] z-0"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-light/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px]"></div>

        <div className="container mx-auto px-6 relative z-10 max-w-5xl text-center flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl"
          >
            On a journey to bring <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary-light">easier access to patients</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed drop-shadow-md"
          >
            Leading accessible, AI-powered healthcare for everyone, right from their pockets. One patient at a time.
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <img
                src={LOGO_PLACEHOLDER}
                alt="Story Placeholder"
                className="rounded-3xl shadow-2xl w-full h-[400px] object-contain bg-primary/5 p-10 border border-primary/10"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-sm font-bold uppercase text-primary tracking-widest mb-2">Our Story</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-primary-dark mb-6">The Steps!</h3>
              <p className="text-gray-600 leading-relaxed mb-4 text-lg">
                Dr. Andre began with a simple yet powerful idea: patients should be able to access healthcare services easily and intuitively without downloading complex apps or facing technical hurdles.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg mb-4">
                Our journey is defined by a relentless pursuit of excellence and mass adoption. We saw the gaps in existing digital healthcare solutions: clunky interfaces, expensive subscriptions, poor user experience, and steep learning curves, and we set out to fill them by integrating directly into WhatsApp.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Today, Dr. Andre leverages state-of-the-art AI technology to democratize healthcare for thousands of daily users, acting as a trusted partner for health institutions looking to embrace the future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-page">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-3xl shadow-card border-t-4 border-primary hover:-translate-y-2 transition-transform duration-300 flex flex-col"
            >
              <h3 className="text-2xl font-bold text-primary-dark mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed flex-grow">
                To engineer a unified global ecosystem that redefines the standards of healthcare accessibility, ensuring that no one is left without a medical companion.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-10 rounded-3xl shadow-card border-t-4 border-accent hover:-translate-y-2 transition-transform duration-300 flex flex-col"
            >
              <h3 className="text-2xl font-bold text-primary-dark mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed flex-grow">
                To pioneer a seamless future where technology and care are one—connecting every patient to instant, intelligent, and universal medical assistance regardless of geography or time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Dr. Andre Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold uppercase text-primary tracking-widest mb-2">Why Choose Dr. Andre?</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-primary-dark">Built for Mass Adoption</h3>
            <p className="text-gray-600 mt-4 text-lg">
              Our infrastructure is built on a foundation of principles that guide every decision we make, ensuring healthcare is accessible, secure, and user-friendly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Trust & Privacy', desc: 'We build products you can rely on. Your conversations are secured with our 3-layer encryption system.' },
              { icon: Zap, title: 'Instant Innovation', desc: 'No waiting rooms. We push boundaries to provide faster and smarter health answers in under 5 seconds.' },
              { icon: Users, title: 'User-Centric', desc: 'No new apps to learn. Integrated directly into WhatsApp for maximum adoption and ease of use.' },
              { icon: Heart, title: 'Integrity', desc: 'We provide honest, medically-informed guidance with clear limitations for your safety.' },
            ].map((value, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-page rounded-3xl border border-primary/5 hover:border-primary/20 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 shadow-sm">
                  <value.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-bold text-primary-dark mb-3">{value.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
