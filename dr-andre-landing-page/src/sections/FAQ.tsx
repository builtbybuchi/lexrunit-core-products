import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const faqs = [
  {
    question: 'How much does Dr. Andre cost?',
    answer: 'Dr. Andre offers a 7-day free trial, after which you can subscribe for just ₦950 per month. That\'s less than the cost of a single hospital consultation.',
  },
  {
    question: 'Is Dr. Andre a real doctor?',
    answer: 'Dr. Andre is an AI-powered health assistant. It provides general health information, symptom analysis, and wellness guidance, but it is not a replacement for a licensed medical professional. Always consult a doctor for serious medical conditions.',
  },
  {
    question: 'Is my data safe with Dr. Andre?',
    answer: 'Absolutely. Dr. Andre follows strict data protection guidelines, including NDPC Nigeria, GDPR, and HIPAA compliance. All conversations are end-to-end encrypted, and your data is never sold or shared with third parties.',
  },
  {
    question: 'Can Dr. Andre diagnose diseases?',
    answer: 'Dr. Andre can help analyze symptoms and provide possible explanations based on medical knowledge. However, it does not provide official medical diagnoses. We always recommend consulting a qualified healthcare provider for professional diagnosis and treatment.',
  },
  {
    question: 'What kind of health questions can I ask?',
    answer: 'You can ask about symptoms, first aid, medications, wellness tips, nutrition, fitness, mental health, and general health concerns. Dr. Andre is designed to handle a wide range of health-related queries.',
  },
  {
    question: 'How do I start using Dr. Andre?',
    answer: 'Simply click the WhatsApp button on this page and start chatting with Dr. Andre instantly. No downloads, no registration — just send a message and you\'re connected.',
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="border-b border-primary/10 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 lg:py-6 text-left group"
      >
        <span className="text-base lg:text-lg font-semibold text-primary-dark pr-8 group-hover:text-primary transition-colors">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors"
        >
          <Plus className="w-4 h-4 text-primary" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 lg:pb-6 text-muted-foreground leading-relaxed pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="faq" className="relative py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-dark tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Dr. Andre.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="bg-page rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-primary/5">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
