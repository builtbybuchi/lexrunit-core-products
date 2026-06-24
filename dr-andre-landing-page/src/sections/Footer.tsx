import { motion } from 'framer-motion';
import { MessageCircle, Stethoscope, ArrowRight, Heart } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const WHATSAPP_LINK = 'https://wa.me/2349012512401';

const footerLinks = [
  { label: 'About', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Disclaimer', href: '#' },
  { label: 'Contact', href: WHATSAPP_LINK },
];

export default function Footer() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <footer className="relative bg-gradient-to-b from-[#EAF2FA] to-[#D6E8F7] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-primary/5 to-transparent rounded-full blur-[100px]" />
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 lg:py-28" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-primary-dark tracking-tight mb-6">
            Ready for Smart<br className="hidden sm:block" /> Healthcare?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of users already getting instant health guidance on WhatsApp.
          </p>

          {/* Main CTA Button */}
          <motion.a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-whatsapp hover:bg-whatsapp-dark text-white text-lg font-semibold rounded-full transition-all duration-300 hover:shadow-glow-green-lg"
          >
            <MessageCircle className="w-6 h-6" />
            Chat with Dr. Andre
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>

          <p className="text-sm text-muted-foreground mt-4">
            Start your 7-day free trial. No credit card required.
          </p>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-primary/10" />
      </div>

      {/* Footer Links */}
      <div className="relative z-10 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-primary-dark">Dr. Andre</span>
              <span className="text-sm text-muted-foreground">by Lexrunit</span>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Lexrunit. All rights reserved.
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-2 max-w-lg mx-auto leading-relaxed">
                Disclaimer: Dr. Andre is an AI-powered health assistant and does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice because of information you received from Dr. Andre.
              </p>
            </div>

            {/* Made with love */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
              <span>Made with</span>
              <Heart className="w-3 h-3 fill-red-400 text-red-400" />
              <span>for better healthcare in Africa</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
