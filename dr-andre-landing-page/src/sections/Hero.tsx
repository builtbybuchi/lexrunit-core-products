import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle2 } from 'lucide-react';

const WHATSAPP_LINK = 'https://wa.me/2349012512401';


export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-primary-dark pt-32 pb-20"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-primary-dark via-[#021B4A] to-[#011233] opacity-90 z-0"></div>
      
      {/* Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-light/20 blur-[120px] animate-pulse"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-whatsapp/10 blur-[100px]"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.05] z-0" 
           style={{backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px'}}>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-whatsapp animate-pulse" />
            AI-Powered Healthcare
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 tracking-tight leading-tight drop-shadow-2xl"
        >
          Say Hello to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary-light">Dr. Andre</span><br className="hidden md:block" />
          Your Personal AI Doctor
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-2xl max-w-3xl mx-auto text-gray-300 mb-12 leading-relaxed drop-shadow-md"
        >
          Fast, private, and always available on WhatsApp. Get expert health guidance in seconds, not hours.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16"
        >
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="group relative px-8 py-4 bg-whatsapp text-white font-bold rounded-full overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:-translate-y-1">
            <span className="relative z-10 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat with Dr. Andre
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-whatsapp-dark to-whatsapp opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
          
          <a href="#how-it-works" onClick={(e) => {
              e.preventDefault();
              document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }} className="px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm hover:-translate-y-1">
            See How it Works
          </a>
        </motion.div>

        {/* WhatsApp Mockup Display */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative max-w-4xl mx-auto perspective-1000"
        >
          {/* Glow behind the mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-br from-primary-light/30 via-accent/20 to-whatsapp/20 rounded-full blur-[100px] -z-10" />

          <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[4px] border-white/10 backdrop-blur-sm bg-black/40 mx-auto w-fit rotate-x-12 transform-gpu hover:rotate-x-0 transition-transform duration-700 ease-out">
            <img
              src="/images/hero-whatsapp-mockup.jpg"
              alt="Dr. Andre WhatsApp Chat Interface"
              className="w-[280px] sm:w-[320px] lg:w-[400px] h-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              loading="eager"
            />
          </div>
          
          {/* Floating badge - Privacy */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute left-0 lg:-left-12 top-1/4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-white/20"
          >
            <div className="w-8 h-8 rounded-full bg-whatsapp flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white">Encrypted</p>
              <p className="text-[10px] text-gray-300">End-to-end</p>
            </div>
          </motion.div>

          {/* Floating badge - Response Time */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute right-0 lg:-right-12 bottom-1/4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-white/20"
          >
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white">Instant Reply</p>
              <p className="text-[10px] text-gray-300">Under 5 seconds</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-page to-transparent z-10" />
    </section>
  );
}
