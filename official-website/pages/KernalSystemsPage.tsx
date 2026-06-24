import React from 'react';
import PageHeader from '../components/PageHeader';

const KernalSystemsPage: React.FC = () => {
  const capabilities = [
    {
      title: 'Internal Tools & Business Systems',
      summary: 'Custom systems that replace fragile spreadsheet workflows and reduce operational risk.',
    },
    {
      title: 'MVP & Platform Development',
      summary: 'Production-ready MVPs with strong foundations for scale, reliability, and maintainability.',
    },
    {
      title: 'Systems Integration & Maintenance',
      summary: 'Reliable integrations between tools with clear monitoring and long-term support.',
    },
    {
      title: 'System Architecture',
      summary: 'Scalable architecture design with observability, bounded contexts, and low operational friction.',
    },
    {
      title: 'Financial Infrastructure',
      summary: 'Robust payment and ledger workflows built with idempotency and failure-safe handling.',
    },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <PageHeader
        title="Kernal Systems"
        subtitle="Production-ready infrastructure for teams navigating technical complexity."
      />

      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-3xl md:text-5xl font-serif text-gray-800 leading-tight max-w-4xl mx-auto">
            Engineering services built for reliability and long-term growth.
          </h2>
          <p className="mt-5 text-center text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kernal Systems partners with teams to build, integrate, and maintain critical software infrastructure.
          </p>
        </div>
      </section>

      <section className="py-20 bg-lex-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold uppercase text-lex-med-blue tracking-widest mb-2">Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-lex-dark-blue">What Kernal Systems Delivers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((item) => (
              <article key={item.title} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h4 className="text-xl font-bold text-lex-dark-blue mb-3">{item.title}</h4>
                <p className="text-gray-700 leading-relaxed">{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-lex-dark-blue text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for longevity</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Explore Kernal Systems and connect with the team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://kernal.lexrunit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-lex-bright-blue text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-lex-bright-blue transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Visit Kernal Systems
            </a>
            <a
              href="/contact"
              className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-lex-dark-blue transition-all duration-300"
            >
              Contact Lexrunit
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default KernalSystemsPage;