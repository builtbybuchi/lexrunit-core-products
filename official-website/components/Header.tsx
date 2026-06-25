
import React, { useState, useEffect } from 'react';
import { navLinks } from '../constants';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-lex-dark-blue shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center">
            <img src="https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1775343834/compressed_logo_nndg36.png" alt="Lexrunit" className="h-8 w-auto" />
          </a>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.id} href={`/${link.id}`} className="text-white hover:text-lex-bright-blue font-semibold transition-colors duration-300">
                {link.title}
              </a>
            ))}
             <a href="/lexcare-patients" className="text-white hover:text-lex-bright-blue font-semibold transition-colors duration-300">
                LexCare
             </a>
             <a href="/partner" className="text-white hover:text-lex-bright-blue font-semibold transition-colors duration-300">
                Partner Portal
             </a>
              <SignedIn>
                 <UserButton afterSignOutUrl="/" />
                 <a href="/account" className="text-white hover:text-lex-bright-blue font-semibold transition-colors duration-300">Account</a>
              </SignedIn>
              <SignedOut>
                 <a href="/sign-up" className="bg-lex-med-blue text-white font-bold py-2 px-6 rounded-full hover:bg-lex-bright-blue transition-colors duration-300 shadow-md">
                   Create Free Account
                 </a>
              </SignedOut>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-lex-dark-blue rounded-lg p-4 shadow-lg border border-lex-med-blue/30">
            {navLinks.map((link) => (
              <a key={link.id} href={`/${link.id}`} onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 text-white hover:bg-white/10 rounded-md transition-colors duration-300">
                {link.title}
              </a>
            ))}
            <a href="/lexcare-patients" onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 text-white hover:bg-white/10 rounded-md transition-colors duration-300">
              LexCare
            </a>
            <a href="/partner" onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 text-white hover:bg-white/10 rounded-md transition-colors duration-300">
              Partner Portal
            </a>
            <SignedIn>
               <a href="/account" onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 text-white hover:bg-white/10 rounded-md transition-colors duration-300">
                 Account
               </a>
            </SignedIn>
            <SignedOut>
               <a href="/sign-up" onClick={() => setIsMenuOpen(false)} className="block w-full text-center mt-4 bg-lex-med-blue text-white font-bold py-3 px-4 rounded-full hover:bg-lex-bright-blue transition-colors duration-300">
                 Create Free Account
               </a>
            </SignedOut>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
