import { motion } from 'framer-motion';
import { MessageCircle, ClipboardList, Sparkles, Building2 } from 'lucide-react';
import { WhatsAppMockup } from '@/components/WhatsAppMockup';

const steps = [
  {
    icon: MessageCircle,
    title: 'Start a Chat',
    description: 'Send a message to Dr. Andre on WhatsApp. No downloads or complex sign-ups needed. Just say hi!',
    color: 'bg-whatsapp/10 text-whatsapp',
    number: '01',
  },
  {
    icon: ClipboardList,
    title: 'Describe Symptoms',
    description: 'Tell Dr. Andre how you\'re feeling in plain, natural language. Our AI securely analyzes your medical concerns instantly.',
    color: 'bg-primary-light/10 text-primary-light',
    number: '02',
  },
  {
    icon: Sparkles,
    title: 'Get Instant Guidance',
    description: 'Receive quick, reliable health advice, book consultations, or order lab tests anytime, anywhere — day or night.',
    color: 'bg-secondary/50 text-primary',
    number: '03',
  },
  {
    icon: Building2,
    title: 'Connect to Your Hospital',
    description: 'Seamlessly link your profile with your primary healthcare provider to share records and schedule in-person visits.',
    color: 'bg-primary/10 text-primary-dark',
    number: '04',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 bg-page overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4"
          >
            Simple Process
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-dark tracking-tight mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Getting health advice has never been easier. Three simple steps to better health.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Left Column: Phone Mockup */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start perspective-1000">
            <motion.div
              initial={{ opacity: 0, x: -40, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 10 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full max-w-[340px] sm:max-w-[380px] transform-gpu hover:rotate-y-0 transition-transform duration-700 ease-out z-10"
            >
              {/* Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary-light/20 to-whatsapp/20 rounded-full blur-[100px] -z-10" />

              <div className="bg-black/90 backdrop-blur-md rounded-[3rem] p-3 shadow-[0_20px_60px_-15px_rgba(2,20,136,0.3)] border-[2px] border-white/20">
                <WhatsAppMockup rotate={false} className="w-full shadow-none rounded-[2.5rem] overflow-hidden" />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Stacked Cards */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="flex flex-col pb-12 pt-4 px-2 w-full max-w-lg">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                    className={`group relative p-6 md:p-8 rounded-[2rem] shadow-[0_-10px_30px_rgba(2,20,136,0.05)] bg-white border border-primary/10 transition-all duration-500 hover:z-50 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(2,20,136,0.12)] cursor-pointer ${
                      index > 0 ? '-mt-6' : ''
                    }`}
                    style={{ zIndex: index * 10 }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl ${step.color} flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                        <Icon className="w-7 h-7 md:w-8 md:h-8" />
                      </div>
                      
                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between w-full">
                          <h3 className="text-xl md:text-2xl font-bold text-primary-dark">
                            {step.title}
                          </h3>
                          <span className="text-3xl md:text-4xl font-extrabold text-page group-hover:text-primary/10 transition-colors duration-500">
                            {step.number}
                          </span>
                        </div>
                        
                        {/* Accordion Content */}
                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                          <div className="overflow-hidden">
                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                              {step.description}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
