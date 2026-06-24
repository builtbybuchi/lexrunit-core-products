
import React from 'react';

const Philosophy: React.FC = () => {
  return (
    <section id="philosophy" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-lex-bright-blue rounded-full blur-3xl"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-lex-med-blue rounded-full blur-3xl translate-y-1/2 translate-x-1/4"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
             <span className="py-1 px-3 rounded-full bg-lex-bright-blue/10 text-lex-med-blue text-sm font-bold tracking-wider uppercase">
               Our Philosophy
             </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight">
            Healthcare is not a privilege, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lex-med-blue to-lex-bright-blue">
              it is a right.
            </span>
          </h2>
          
          <div className="relative">
            <svg className="absolute -top-8 -left-4 md:-left-12 w-16 h-16 text-gray-200 transform -scale-x-100 opacity-50" fill="currentColor" viewBox="0 0 24 24">
               <path d="M14.017 21L14.017 18C14.017 16.0547 15.3738 14.5547 17.2305 14.5547C18.0918 14.5547 18.8047 14.9609 19.1523 15.6445C19.2422 15.8242 19.2891 16.0156 19.2891 16.2188C19.2891 16.9375 18.7031 17.5234 17.9844 17.5234C17.6328 17.5234 17.3047 17.3906 17.0469 17.1562C16.9453 17.0625 16.875 17.0547 16.7891 17.0547C16.5 17.0547 16.2656 17.2891 16.2656 17.5781C16.2656 17.7109 16.3125 17.8359 16.3984 17.9375C16.6797 18.2891 17.1094 18.5 17.5781 18.5C18.8438 18.5 19.875 17.4688 19.875 16.2031C19.875 15.2266 19.2812 14.3594 18.3984 13.9844C18.8594 13.375 19.5625 13 20.3281 13C21.6406 13 22.7031 14.0625 22.7031 15.375V21H14.017ZM8.01719 21L8.01719 18C8.01719 16.0547 9.37383 14.5547 11.2305 14.5547C12.0918 14.5547 12.8047 14.9609 13.1523 15.6445C13.2422 15.8242 13.2891 16.0156 13.2891 16.2188C13.2891 16.9375 12.7031 17.5234 11.9844 17.5234C11.6328 17.5234 11.3047 17.3906 11.0469 17.1562C10.9453 17.0625 10.875 17.0547 10.7891 17.0547C10.5 17.0547 10.2656 17.2891 10.2656 17.5781C10.2656 17.7109 10.3125 17.8359 10.3984 17.9375C10.6797 18.2891 11.1094 18.5 11.5781 18.5C12.8438 18.5 13.875 17.4688 13.875 16.2031C13.875 15.2266 13.2812 14.3594 12.3984 13.9844C12.8594 13.375 13.5625 13 14.3281 13C15.6406 13 16.7031 14.0625 16.7031 15.375V21H8.01719Z" />
            </svg>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
              "We believe that healthcare should be accessible to everyone, regardless of their financial status. We are committed to providing affordable and quality healthcare services to all patients."
            </p>
          </div>
          
          <div className="mt-10 flex justify-center">
            <div className="h-1 w-20 bg-gradient-to-r from-lex-med-blue to-lex-bright-blue rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
