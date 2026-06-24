import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileCheck } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const complianceBadges = [
  { label: 'NDPC Nigeria', abbr: 'NDPC' },
  { label: 'GDPR Compliant', abbr: 'GDPR' },
  { label: 'HIPAA Aligned', abbr: 'HIPAA' },
];

const privacyFeatures = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'All conversations are encrypted using industry-standard protocols.',
  },
  {
    icon: Eye,
    title: 'Privacy by Design',
    description: 'Your data is never sold or shared with third parties.',
  },
  {
    icon: FileCheck,
    title: 'Triple-Lock Approach',
    description: 'Multi-layered security ensures your health data stays protected.',
  },
];

export default function Privacy() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="privacy" className="relative py-20 lg:py-28 bg-primary-dark overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          >
            {/* Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-6">
              <Lock className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                Privacy &amp; Security
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
              Your privacy is our{' '}
              <span className="text-accent">priority</span>
            </h2>

            <p className="text-lg text-white/70 leading-relaxed mb-10">
              Dr. Andre prioritizes your privacy and data security. All conversations are encrypted, and your health data is protected with industry-standard security measures. We comply with NDPC Nigeria, GDPR, and HIPAA guidelines to ensure your information remains safe and confidential.
            </p>

            {/* Privacy Features */}
            <div className="space-y-5">
              {privacyFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-white/60">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Compliance Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-3 mt-10"
            >
              {complianceBadges.map((badge) => (
                <div
                  key={badge.abbr}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl"
                >
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-white/90">
                    {badge.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Shield Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="flex justify-center items-center"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[100px]" />

              {/* Shield image */}
              <img
                src="/images/privacy-shield.png"
                alt="Medical Data Security Shield"
                className="relative z-10 w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] object-contain drop-shadow-[0_0_60px_rgba(10,145,249,0.3)]"
                loading="lazy"
              />

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 right-0 lg:right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-lg"
              >
                <Lock className="w-5 h-5 text-accent" />
              </motion.div>

              <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-12 left-0 lg:left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-lg"
              >
                <FileCheck className="w-5 h-5 text-accent" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
