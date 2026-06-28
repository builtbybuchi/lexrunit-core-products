import { motion } from 'framer-motion';
import { MessageCircle, ShieldCheck, Zap, Clock } from 'lucide-react';
import { WhatsAppMockup } from '@/components/WhatsAppMockup';

const WHATSAPP_LINK = 'https://wa.me/2349012512401';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[95vh] flex items-center overflow-hidden bg-primary-dark pt-32 pb-20 lg:pt-40 lg:pb-32"
    >
      {/* Background Effects: Fine grid and subtle radial gradient using Lexrunit colors */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(10,145,249,0.2)_0%,rgba(2,20,136,1)_70%)] z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(5,70,182,0.3)_0%,transparent_50%)] z-0"></div>
      <div 
        className="absolute inset-0 opacity-[0.03] z-0" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', 
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Left Column: Typography & CTAs */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1] drop-shadow-lg"
            >
              Say Hello to <span className="text-secondary drop-shadow-md">Dr. Andre</span>,<br className="hidden sm:block lg:hidden xl:block" /> Your Personal <span className="text-primary-light drop-shadow-md">AI Doctor</span>.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed drop-shadow-md max-w-2xl"
            >
              More than just answers. Book consultations, order lab tests, and get medications directly from WhatsApp. 
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <a 
                href={WHATSAPP_LINK} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative px-8 py-4 bg-[#25D366] text-white font-bold rounded-full overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Chat with Dr. Andre</span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              
              <a 
                href="#how-it-works" 
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="px-8 py-4 bg-transparent border-2 border-white/20 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm text-center"
              >
                See How it Works
              </a>
            </motion.div>

          </div>

          {/* Right Column: Visual Asset */}
          <div className="w-full lg:w-1/2 relative perspective-1000 flex justify-center lg:justify-end mt-16 lg:mt-0">
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] max-h-[500px] bg-gradient-to-br from-[#0A91F9]/30 to-[#C5ECF4]/20 rounded-full blur-[120px] -z-10" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: 15, rotateX: 5 }}
              animate={{ opacity: 1, scale: 1, rotateY: -15, rotateX: 5 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
              className="relative w-full max-w-[340px] sm:max-w-[380px] transform-gpu hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out z-10"
            >
              {/* Phone Mockup Frame */}
              <div className="bg-black/80 backdrop-blur-md rounded-[3rem] p-3 shadow-[0_30px_60px_-15px_rgba(2,20,136,0.6)] border-[2px] border-white/10">
                <WhatsAppMockup className="w-full shadow-none rounded-[2.5rem] overflow-hidden" />
              </div>
              
              {/* Decorative Medical/AI floating accents */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#0A91F9]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom fade into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-page to-transparent z-20" />
    </section>
  );
}
