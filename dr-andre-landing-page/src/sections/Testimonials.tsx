import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const testimonials = [
  {
    name: 'Chinedu M.',
    location: 'Abuja',
    rating: 5,
    text: 'Dr. Andre helped me understand my symptoms at 2 AM when no hospital was open. The advice was clear and reassuring. Worth every naira!',
  },
  {
    name: 'Amaka O.',
    location: 'Lagos',
    rating: 5,
    text: 'I was skeptical at first, but the medication guidance feature alone has saved me from dangerous drug interactions twice. Incredible service.',
  },
  {
    name: 'Emmanuel K.',
    location: 'Port Harcourt',
    rating: 5,
    text: 'No more sitting in crowded waiting rooms for hours. I get professional health advice right on WhatsApp within seconds. Game changer!',
  },
  {
    name: 'Fatima A.',
    location: 'Kano',
    rating: 5,
    text: 'As a mother of three, having instant access to first-aid guidance gives me so much peace of mind. The wellness tips are also very practical.',
  },
  {
    name: 'Oluwaseun T.',
    location: 'Ibadan',
    rating: 5,
    text: 'The specialist referral feature helped me find the right doctor for my condition. Dr. Andre is like having a personal physician in my pocket.',
  },
  {
    name: 'Blessing N.',
    location: 'Enugu',
    rating: 5,
    text: '₦950 per month is unbelievably affordable compared to hospital consultation fees. The free trial convinced me immediately. Highly recommend!',
  },
];

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-[340px] sm:w-[400px] bg-white rounded-2xl p-6 shadow-card border border-primary/5 mx-3">
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-primary/10 mb-3" />

      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Text */}
      <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-primary/5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-primary-dark text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="relative py-20 lg:py-28 bg-page overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-amber-400/10 text-amber-600 text-sm font-semibold rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-dark tracking-tight mb-4">
            What Our Users Say
          </h2>

          {/* Rating Score */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl font-extrabold text-primary-dark">4.9</span>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Based on 50+ reviews</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative"
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-page to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-page to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {duplicatedTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
