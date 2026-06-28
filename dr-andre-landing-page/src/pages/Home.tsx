import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import Features from '@/sections/Features';
import Privacy from '@/sections/Privacy';
import HowItWorks from '@/sections/HowItWorks';
import Pricing from '@/sections/Pricing';
import Testimonials from '@/sections/Testimonials';
import BlogPreview from '@/sections/BlogPreview';
import FAQ from '@/sections/FAQ';
import Footer from '@/sections/Footer';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const target = document.querySelector(location.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <main className="min-h-screen bg-page">
      <Navigation />
      <Hero />
      <Features />
      <Privacy />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <BlogPreview />
      <FAQ />
      <Footer />
    </main>
  );
}
