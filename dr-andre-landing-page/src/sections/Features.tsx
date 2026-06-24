import { motion } from 'framer-motion';
import {
  MessageCircleQuestion,
  HeartPulse,
  Stethoscope,
  Activity,
  Sparkles,
  Pill,
} from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const features = [
  {
    icon: MessageCircleQuestion,
    title: 'Answer Health Questions',
    description: 'Explain symptoms, conditions, and treatment options in plain language.',
    image: null,
    gradient: 'from-[#EAF2FA] to-[#D6E8F7]',
    colSpan: 'md:col-span-1',
    rowSpan: '',
  },
  {
    icon: HeartPulse,
    title: 'First-Aid Guidance',
    description: 'Get instant first-aid instructions in emergencies before professional help arrives.',
    image: '/images/bento-stethoscope.jpg',
    gradient: '',
    colSpan: 'md:col-span-2',
    rowSpan: '',
  },
  {
    icon: Stethoscope,
    title: 'Recommend Specialists',
    description: 'Receive guidance on when to see a specialist and what type of doctor to consult.',
    image: null,
    gradient: 'from-[#FFF8E7] to-[#FDECC8]',
    colSpan: 'md:col-span-1',
    rowSpan: '',
  },
  {
    icon: Activity,
    title: 'Symptom Checker',
    description: 'Check your symptoms and receive potential causes with recommended next steps.',
    image: null,
    gradient: 'from-[#FFF0F0] to-[#FDD8D8]',
    colSpan: 'md:col-span-1',
    rowSpan: '',
  },
  {
    icon: Sparkles,
    title: 'Health & Wellness Tips',
    description: 'Daily wellness tips, fitness advice, and nutrition guidance tailored for you.',
    image: '/images/bento-health-tech.jpg',
    gradient: '',
    colSpan: 'md:col-span-2',
    rowSpan: '',
  },
  {
    icon: Pill,
    title: 'Medication Guidance',
    description: 'Get information on dosages, side effects, and potential drug interactions.',
    image: null,
    gradient: 'from-[#E8F8E8] to-[#D0F0D0]',
    colSpan: 'md:col-span-1',
    rowSpan: '',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] },
  },
};

export default function Features() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="features" className="relative py-20 lg:py-28 bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-dark tracking-tight mb-4">
            What Can Dr. Andre Do For You?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From answering health questions to providing first-aid guidance, Dr. Andre is your comprehensive healthcare companion.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const hasImage = !!feature.image;
            const hasGradient = !!feature.gradient;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className={`group relative ${feature.colSpan} overflow-hidden rounded-2xl lg:rounded-3xl cursor-default transition-all duration-500 hover:-translate-y-2 hover:shadow-card-hover`}
              >
                {/* Background layer */}
                <div
                  className={`absolute inset-0 ${
                    hasImage
                      ? ''
                      : hasGradient
                      ? `bg-gradient-to-br ${feature.gradient}`
                      : 'bg-white'
                  }`}
                >
                  {hasImage && (
                    <img
                      src={feature.image!}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  {/* Overlay for image cards */}
                  {hasImage && (
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/50 to-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 lg:p-8 min-h-[220px] flex flex-col justify-end">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                      hasImage
                        ? 'bg-white/20 backdrop-blur-sm'
                        : hasGradient
                        ? 'bg-white/80 shadow-sm'
                        : 'bg-primary/10'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        hasImage ? 'text-white' : 'text-primary'
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-bold mb-2 ${
                      hasImage ? 'text-white' : 'text-primary-dark'
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      hasImage ? 'text-white/80' : 'text-muted-foreground'
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Border */}
                {!hasImage && (
                  <div className="absolute inset-0 rounded-2xl lg:rounded-3xl border border-primary/5 pointer-events-none group-hover:border-primary/15 transition-colors duration-300" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
