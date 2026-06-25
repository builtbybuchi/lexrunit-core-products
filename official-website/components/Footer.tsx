
import React, { useState } from 'react';
import { LexrunitLogoIcon } from './icons/LexrunitLogo';
import { TwitterIcon, LinkedInIcon, FacebookIcon } from './icons/SocialIcons';

const Footer: React.FC = () => {
  const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Kernal Systems', href: '/kernal-systems' },
    { name: 'Products', href: '/products' },
    { name: 'Philosophy', href: '/philosophy' },
    { name: 'Careers', href: '/careers' },
    { name: 'News', href: '/news' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const productLinks = [
    { name: 'Dr. Andre', href: '/products/dr-andre' },
    { name: "L'Hopital", href: '/lexcare-hms' },
    { name: 'LexCare', href: '/lexcare-patients' },
    { name: 'Find Hospitals', href: '/find-hospitals' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
  ];

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // simple client-side validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const { databases, DATABASE_ID, COLLECTIONS } = await import('../lib/appwrite');
      const { ID } = await import('appwrite');

      // Check if email already exists (optional, but good practice if you can query)
      // For now, we'll just try to create. If you have a unique index on email, it will fail.
      // Assuming no unique index for simplicity or handling error if it exists.

      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.SUBSCRIPTIONS,
        ID.unique(),
        {
          email: email,
        }
      );

      setStatus('success');
      setMessage('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error: any) {
      console.error('Error subscribing:', error);
      setStatus('error');
      // Check for duplicate error if applicable, otherwise generic
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  return (
    <footer className="bg-[#021488] text-white">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div>
            <h3 className="text-lg font-bold mb-4 font-montserrat">COMPANY</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-white transition-colors font-montserrat">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 font-montserrat">PRODUCTS</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-white transition-colors font-montserrat">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 font-montserrat">LEGAL</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-white transition-colors font-montserrat">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col justify-left md:items-start bg-[#021488] p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4 font-montserrat text-center md:text-left">Subscribe to our newsletters</h3>
            <p className="text-gray-300 mb-4 font-montserrat text-center md:text-left">
              Stay updated with the latest news, features, and developments from Lexrunit
            </p>

            <form onSubmit={handleSubscribe} className="max-w-md w-full">
              <div className="w-full flex flex-row justify-start items-center gap-2 px-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-2/4 md:flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-black"
                  required
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>

            {message && (
              <p className={`mt-3 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'} font-montserrat`}>
                {message}
              </p>
            )}

            <p className="text-xs text-gray-300 mt-4 font-montserrat text-center md:text-left">
              By subscribing, you consent to receive updates from Lexrunit.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full py-12 flex justify-center items-center bg-[#021488]">
        <img src="https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1775343834/compressed_logo_nndg36.png" alt="Lexrunit" className="w-full h-auto" />
      </div>

      <div className="w-full bg-[#021488] border-t border-white/20">
        <div className="container mx-auto py-6 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm font-montserrat mb-4 md:mb-0">
            © {new Date().getFullYear()} Lexrunit Limited(RC: 8030673). All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="https://www.facebook.com/profile.php?id=61573935397981" className="text-gray-300 hover:text-white" aria-label="Facebook" target="_blank" rel="noreferrer">
              <FacebookIcon />
            </a>
            <a href="https://x.com/lexrunit" className="text-gray-300 hover:text-white" aria-label="X" target="_blank" rel="noreferrer">
              <TwitterIcon />
            </a>
            <a href="https://instagram.com/lexrunit" className="text-gray-300 hover:text-white" aria-label="Instagram" target="_blank" rel="noreferrer">
              {/* Instagram icon not available in icons file; reuse TwitterIcon as placeholder */}
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="#fff" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="#fff" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/lexrunit" className="text-gray-300 hover:text-white" aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
