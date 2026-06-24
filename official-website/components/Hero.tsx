import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-lex-dark-blue pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-lex-dark-blue via-[#0a192f] to-lex-dark-blue opacity-90 z-0"></div>
      
      {/* Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-lex-bright-blue/20 blur-[120px] animate-pulse"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-lex-med-blue/20 blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px]"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.05] z-0" 
           style={{backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px'}}>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
          Providing efficient <span className="text-transparent bg-clip-text bg-gradient-to-r from-lex-bright-blue to-lex-light-blue">Healthcare access</span> to <br className="hidden md:block" />
          Everyone, Everywhere!
        </h1>
        
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 mb-12 leading-relaxed drop-shadow-md">
          Utilizing AI and modern techonology to streamline hospital activities and bring access to care to patients where they are. 
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <a href="/products" className="group relative px-8 py-4 bg-lex-bright-blue text-white font-bold rounded-full overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:-translate-y-1">
            <span className="relative z-10 flex items-center gap-2">
              Explore Our Ecosystem
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-lex-med-blue to-lex-bright-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
          
          <a href="/partner" className="px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm hover:-translate-y-1">
            Partner With Us
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero;
