
import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-sm font-bold uppercase text-lex-bright-blue tracking-widest mb-2">Redefinition</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-lex-dark-blue mb-6">A New Trajectory</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our future depends on our ability to give life another chance at attaining the “impossible”. We believe trust drives adoption. Our approach is to launch projects that can be distributed to a large audience – tools that people use on a daily basis and enterprises can trust.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The trust in our products that their life doesn’t depend on can buy us the trust in things that “determine how long they live” – like our medical applications.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img src="https://picsum.photos/id/17/800/600" alt="Innovation at Lexrunit" className="rounded-2xl shadow-xl w-full h-auto object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
