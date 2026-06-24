import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import { motion } from 'framer-motion';

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

        <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl"
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary-light">Dr. Andre</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 leading-relaxed drop-shadow-md"
          >
            Pioneering accessible, AI-powered healthcare for everyone, right from their pockets.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-primary-dark">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To democratize access to high-quality healthcare information and guidance through advanced artificial intelligence, ensuring that no one is left without a medical companion.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-primary-dark">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A world where instant, reliable, and empathetic medical assistance is universally accessible, breaking down barriers of cost, geography, and time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-20 bg-page">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-10 shadow-card border border-primary/5"
          >
            <h2 className="text-3xl font-bold text-primary-dark mb-8 text-center">The Story Behind Dr. Andre</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Dr. Andre was born out of a simple observation: millions of people lack immediate access to basic healthcare advice. When medical concerns arise, the gap between the onset of symptoms and speaking to a qualified professional can be daunting, stressful, and sometimes critical.
              </p>
              <p>
                Developed by Lexrunit, Dr. Andre leverages state-of-the-art Large Language Models fine-tuned on extensive medical literature to provide preliminary guidance, answer health-related queries, and offer emotional support in times of uncertainty.
              </p>
              <p>
                We chose WhatsApp as the primary platform because it is where the world already communicates. By integrating directly into a familiar interface, Dr. Andre removes the friction of downloading new apps or learning new systems. Healthcare guidance is now as simple as texting a friend.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
