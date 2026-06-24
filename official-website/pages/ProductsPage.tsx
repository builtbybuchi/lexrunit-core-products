
import React from 'react';
import PageHeader from '../components/PageHeader';
import { products } from '../constants';
import { ProductCard } from '../components/ProductCard';

const ProductsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Our Product Ecosystem"
        subtitle="We build healthcare products and non-medical initiatives with the same focus on utility, transparency, and long-term value."
      />
      <section className="py-20 bg-lex-bg">
        <div className="container mx-auto px-6">
          <div className="mb-10 max-w-3xl">
            <h2 className="mt-5 text-3xl font-extrabold text-lex-dark-blue md:text-4xl">Tools for hospitals, patients, and care teams</h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              These products continue our healthcare work across clinical operations, patient access, and AI support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} imageSrc={product.imageSrc} title={product.title} description={product.description} href={product.href} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
