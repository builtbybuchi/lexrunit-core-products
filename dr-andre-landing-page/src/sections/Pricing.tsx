import { motion } from 'framer-motion';
import { Clock, CalendarDays, MessageSquareOff, Wallet, Sparkles, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const WHATSAPP_LINK = 'https://wa.me/2349012512401';

const pricingFeatures = [
  {
    icon: Wallet,
    title: 'Save Time & Money',
    description: 'Affordable healthcare at your fingertips. No hospital queues, no transport costs.',
    gradient: 'from-[#EAF2FA] to-[#D6E8F7]',
  },
  {
    icon: CalendarDays,
    title: '7 Days FREE Trial',
    description: 'Explore Dr. Andre for free before you subscribe. Experience the full service risk-free.',
    gradient: 'from-[#E8F8E8] to-[#D0F0D0]',
    highlight: true,
  },
  {
    icon: MessageSquareOff,
    title: 'Cancel Anytime',
    description: 'No commitments. Stay in control of your subscription with one-tap cancellation.',
    gradient: 'from-[#FFF0F0] to-[#FDD8D8]',
  },
];

const includedFeatures = [
  'Unlimited health questions',
  'Symptom checking',
  'First-aid guidance',
  'Medication information',
  'Wellness tips & advice',
  'Specialist referrals',
];

export default function Pricing() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="pricing" className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/30 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-whatsapp/10 text-whatsapp text-sm font-semibold rounded-full mb-4">
            Affordable Healthcare
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-dark tracking-tight mb-4">
            Your Personal Doctor.
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ₦950
            </span>
            <span className="text-xl sm:text-2xl text-muted-foreground font-medium">
              / month
            </span>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Less than the cost of a single hospital visit. Quality healthcare, always within reach.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-14">
          {pricingFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl lg:rounded-3xl p-6 lg:p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-card-hover ${
                  feature.highlight
                    ? 'bg-gradient-to-br from-whatsapp/5 to-whatsapp/10 border-2 border-whatsapp/30 shadow-glow-green'
                    : 'bg-gradient-to-br ' + feature.gradient + ' border border-primary/5 shadow-card'
                }`}
              >
                {feature.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-whatsapp text-white text-xs font-bold rounded-full">
                      <Sparkles className="w-3 h-3" />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                    feature.highlight ? 'bg-whatsapp/10' : 'bg-white/80'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      feature.highlight ? 'text-whatsapp' : 'text-primary'
                    }`}
                  />
                </div>

                <h3 className="text-xl font-bold text-primary-dark mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-page rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-primary/5">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-primary-dark">What's Included</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {includedFeatures.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-whatsapp/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3 h-3 text-whatsapp" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-whatsapp hover:bg-whatsapp-dark text-white font-semibold rounded-full transition-all duration-300 hover:shadow-glow-green-lg hover:scale-[1.03]"
              >
                Start Your Free Trial
              </a>
              <p className="text-xs text-muted-foreground mt-3">
                7 days free. Cancel anytime. No credit card required.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
