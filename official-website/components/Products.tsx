import React from 'react';
import { products } from '../constants';
import { ProductCard } from './ProductCard';

const Products: React.FC = () => {
  return (
    <section id="products" className="py-24 bg-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(#0f2444 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block bg-lex-bright-blue/10 text-lex-bright-blue font-bold px-4 py-1 rounded-full text-sm uppercase tracking-wide mb-4">
            Our Ecosystem
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-lex-dark-blue mb-6">
            Solutions Built for <span className="text-lex-bright-blue">Impact</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We're building a connected ecosystem of tools designed for reliability, efficiency, and trust.
            Discover how our products can transform your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {products.map((product) => (
            <div key={product.id} className="transform hover:-translate-y-2 transition-transform duration-300">
              <ProductCard
                imageSrc={product.imageSrc}
                title={product.title}
                description={product.description}
                href={product.href}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
