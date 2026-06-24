import { motion } from 'framer-motion';
import { MessageCircle, ClipboardList, Sparkles, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const steps = [
  {
    icon: MessageCircle,
    title: 'Start a Chat',
    description: 'Send a message to Dr. Andre on WhatsApp. No downloads or installations needed.',
    color: 'bg-whatsapp/10 text-whatsapp',
    number: '01',
  },
  {
    icon: ClipboardList,
    title: 'Describe Symptoms',
    description: 'Tell Dr. Andre how you\'re feeling in plain, natural language.',
    color: 'bg-primary/10 text-primary',
    number: '02',
  },
  {
    icon: Sparkles,
    title: 'Get Instant Guidance',
    description: 'Receive quick, reliable health advice anytime, anywhere — day or night.',
    color: 'bg-accent/10 text-accent',
    number: '03',
  },
];

export default function HowItWorks() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="how-it-works" className="relative py-20 lg:py-28 bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-dark tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting health advice has never been easier. Three simple steps to better health.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative group"
              >
                {/* Connector line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px]">
                    <div className="w-full h-full bg-gradient-to-r from-primary/20 to-transparent" />
                    <ArrowRight className="absolute right-0 -top-[7px] w-4 h-4 text-primary/30" />
                  </div>
                )}

                <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-card border border-primary/5 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1">
                  {/* Number + Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-extrabold text-primary/10 group-hover:text-primary/20 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-primary-dark mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* WhatsApp Conversation Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-accent/5 to-whatsapp/5 rounded-[2.5rem] blur-2xl" />

            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[8px] border-white bg-white">
              <img
                src="/images/whatsapp-conversation.jpg"
                alt="WhatsApp conversation with Dr. Andre showing symptom checking"
                className="w-full max-w-[340px] sm:max-w-[380px] h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
