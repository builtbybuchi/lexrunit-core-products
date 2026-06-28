import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

const NAV_LINKS = [
  { label: 'Home', href: './' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const WHATSAPP_LINK = 'https://wa.me/2349012512401';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);

    // Home link
    if (href === './' || href === '/' || href === '#hero') {
      if (location.pathname !== '/') {
        navigate('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Hash links for Home page sections
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/' + href);
      } else {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      return;
    }

    // Standard page navigation
    navigate(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-2xl shadow-sm border-b border-primary/5 py-2'
            : 'bg-white/50 backdrop-blur-md border-b border-white/20 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Prominent Logo */}
            <a
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="flex items-center gap-3 group z-10"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all" />
                <img 
                  src="https://res.cloudinary.com/dlvffw5wt/image/upload/v1782541050/2-removebg-preview_yei74a.png" 
                  alt="Dr. Andre Logo" 
                  className={`relative object-contain transition-all duration-300 ${scrolled ? 'w-10 h-10' : 'w-12 h-12 md:w-14 md:h-14'}`} 
                />
              </div>
              <div className="flex flex-col">
                <span className={`font-extrabold tracking-tight text-primary-dark transition-all duration-300 ${scrolled ? 'text-lg' : 'text-xl md:text-2xl'}`}>
                  Dr. Andre
                </span>
                <span className="text-[10px] md:text-xs text-primary font-semibold uppercase tracking-wider -mt-1 opacity-80">
                  by Lexrunit
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 bg-white/40 p-1.5 rounded-full border border-white/50 shadow-inner backdrop-blur-md">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-white rounded-full transition-all duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
              <a
                href="/about"
                onClick={(e) => handleNavClick(e, '/about')}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-white rounded-full transition-all duration-300 relative group"
              >
                About
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://lexrunit.com/blog"
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-white rounded-full transition-all duration-300 relative group"
              >
                Blog
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            {/* CTA Button & Mobile Menu Toggle */}
            <div className="flex items-center gap-3 z-10">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-whatsapp to-[#20B058] text-white text-sm font-bold rounded-full shadow-lg hover:shadow-xl hover:shadow-whatsapp/30 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                Try it Free
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 bg-white/80 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-[72px] left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-primary/10 shadow-2xl z-40 overflow-hidden"
          >
            <div className="flex flex-col px-4 py-6 gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-3 text-base font-semibold text-slate-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/about"
                onClick={(e) => handleNavClick(e, '/about')}
                className="px-4 py-3 text-base font-semibold text-slate-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
              >
                About
              </a>
              <a
                href="/blog"
                onClick={(e) => handleNavClick(e, '/blog')}
                className="px-4 py-3 text-base font-semibold text-slate-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
              >
                Blog
              </a>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-whatsapp text-white text-base font-bold rounded-2xl shadow-lg hover:shadow-whatsapp/30 transition-all"
                >
                  Get Started on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
