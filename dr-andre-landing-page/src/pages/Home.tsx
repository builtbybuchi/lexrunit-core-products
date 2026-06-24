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

export default function Home() {
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
