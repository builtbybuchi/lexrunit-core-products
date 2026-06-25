import React from 'react';

import { ArrowRight, Globe2, Users, Lightbulb } from 'lucide-react';

const HigsSection: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden font-montserrat border-y border-gray-100">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#C5ECF4]/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0A91F9]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="max-w-xl">
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#021488] leading-tight mb-6">
              Our Commitment to Health Education
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Building software isn't enough. We believe in educating and connecting the ecosystem. 
              True innovation happens when technology builders and medical experts understand each other's worlds.
            </p>

            <a 
              href="/higs" 
              className="inline-flex items-center gap-2 bg-[#021488] hover:bg-[#0546B6] text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Discover HIGS
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Right Column: Visual/Bento Element */}
          <div className="relative">
            {/* Main Visual Card */}
            <div className="bg-gradient-to-br from-[#021488] to-[#0546B6] p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
              
              <h4 className="text-3xl font-extrabold mb-4 relative z-10">Stop building in the dark.</h4>
              <p className="text-[#C5ECF4] mb-8 relative z-10 text-lg">
                Join our next session and learn what hospitals actually need.
              </p>
              
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl">
                  <div className="text-2xl font-bold mb-1">1.5k+</div>
                  <div className="text-sm text-white/80">Professionals Reached</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl">
                  <div className="text-2xl font-bold mb-1">Monthly</div>
                  <div className="text-sm text-white/80">Virtual Sessions</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Partner/Sponsor Banner */}
        <div className="mt-24 border-t border-gray-100 pt-12 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
            Powered in partnership with our amazing network
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos (Using generic SVGs or styled text for now) */}
            <a href="https://www.canva.com/design/DAHLjXTp_qI/_TiYnkjoRwZQCQ2SfODbCg/view?utlId=h8ad144e98d" target="_blank" rel="noopener noreferrer" className="font-extrabold text-2xl tracking-tighter flex items-center gap-2 hover:text-[#0546B6] transition-colors">
              <Globe2 className="w-8 h-8" />
              BE OUR
            </a>
            <a href="https://www.canva.com/design/DAHLjXTp_qI/_TiYnkjoRwZQCQ2SfODbCg/view?utlId=h8ad144e98d" target="_blank" rel="noopener noreferrer" className="font-extrabold text-2xl tracking-tighter flex items-center gap-2 hover:text-[#0546B6] transition-colors">
              <div className="w-8 h-8 bg-current rounded-md rotate-45"></div>
              FIRST
            </a>
            <a href="https://www.canva.com/design/DAHLjXTp_qI/_TiYnkjoRwZQCQ2SfODbCg/view?utlId=h8ad144e98d" target="_blank" rel="noopener noreferrer" className="font-extrabold text-2xl tracking-tighter flex items-center gap-2 hover:text-[#0546B6] transition-colors">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/></svg>
              PARTNER
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HigsSection;
