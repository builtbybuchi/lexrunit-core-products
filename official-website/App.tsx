import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import PhilosophyPage from './pages/PhilosophyPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import NewsPage from './pages/NewsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import NewsArticlePage from './pages/NewsArticlePage';
import AdminPage from './pages/AdminPage';
import PartnerPage from './pages/PartnerPage';
import LexCareHmsPage from './pages/lexcare-hms/page';
import LexCarePatientsPage from './pages/lexcare-patients/page';
import FindHospitalsPage from './pages/find-hospitals/page';
import WaitlistPage from './pages/WaitlistPage';
import FeedbackPage from './pages/FeedbackPage';
import KernalSystemsPage from './pages/KernalSystemsPage';
import DrAndrePage from './pages/products/dr-andre/page';
import NotFoundPage from './pages/NotFoundPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AccountPage from './pages/AccountPage';
import HigsPage from './pages/HigsPage';
import { initializeData } from './lib/dataService';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.pathname || '/');

  // Initialize data on first load
  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    // Handle back/forward
    const onPop = () => {
      setRoute(window.location.pathname || '/');
      window.scrollTo(0, 0);
    };

    // Intercept in-app link clicks to enable SPA navigation without full reload
    const onLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const a = (target.closest && (target.closest('a') as HTMLAnchorElement)) || null;
      if (!a) return;
      const href = a.getAttribute('href');
      const targetAttr = a.getAttribute('target');
      const download = a.getAttribute('download');
      if (!href) return;
      // Ignore external links, anchors, downloads, or links that open in new tab/window
      if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;
      if (href.startsWith('#')) return; // keep fragment behavior
      if (targetAttr && targetAttr !== '_self') return;
      if (download) return;

      // It's an internal navigation — prevent full page load and use history API
      e.preventDefault();
      const url = new URL(href, window.location.origin);
      const path = url.pathname + url.search + url.hash;
      if (window.location.pathname !== path) {
        history.pushState({}, '', path);
        setRoute(path);
        window.scrollTo(0, 0);
      } else if (url.hash) {
        // Same path, maybe with hash — scroll to element
        const el = document.querySelector(url.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', onPop);
    document.addEventListener('click', onLinkClick);

    // Set initial route
    setRoute(window.location.pathname || '/');

    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onLinkClick);
    };
  }, []);

  const renderPage = () => {
    // Normalize path (remove trailing slash except for root)
    const normalized = (route || '/').replace(/\/+$|(?<!^)\/$/, '') || '/';

    // Blog post route: /blog/:slug
    if (normalized.startsWith('/blog/') && normalized.split('/')[2]) {
      const parts = normalized.split('/');
      return <BlogPostPage slug={parts[2]} />;
    }

    // News article route: /news/:slug
    if (normalized.startsWith('/news/') && normalized.split('/')[2]) {
      const parts = normalized.split('/');
      return <NewsArticlePage slug={parts[2]} />;
    }

    switch (normalized) {
      case '/':
        return <HomePage />;
      case '/about':
        return <AboutPage />;
      case '/products':
        return <ProductsPage />;
      case '/products/dr-andre':
        return <DrAndrePage />;
      case '/philosophy':
        return <PhilosophyPage />;
      case '/careers':
        return <CareersPage />;
      case '/contact':
        return <ContactPage />;
      case '/news':
        return <NewsPage />;
      case '/lexcare-hms':
        return <LexCareHmsPage />;
      case '/lexcare-patients':
        return <LexCarePatientsPage />;
      case '/find-hospitals':
        return <FindHospitalsPage />;
      case '/blog':
        return <BlogPage />;
      case '/lexrunit-admin/new/admin':
        return <AdminPage />;
      case '/partner':
        return <PartnerPage />;
      case '/waitlist':
        return <WaitlistPage />;
      case '/feedback':
        return <FeedbackPage />;
      case '/kernal-systems':
        return <KernalSystemsPage />;
      case '/admin':
        return <AdminPage />;
      case '/sign-in':
        return <SignInPage />;
      case '/sign-up':
        return <SignUpPage />;
      case '/account':
        return <AccountPage />;
      case '/higs':
        return <HigsPage />;
      default:
        // Allow matching product detail paths like /products/dr-andre to render ProductsPage (or a dedicated product page when available)
        if (normalized.startsWith('/products')) {
          return <ProductsPage />;
        }
        // Unknown route -> 404
        return <NotFoundPage />;
    }
  };

  return (
    <div className="bg-white text-gray-800 antialiased">
      <Header />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
