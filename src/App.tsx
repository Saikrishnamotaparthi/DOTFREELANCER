import { useEffect, useState } from 'react';
import { ScrollTrigger } from './lib/gsap';
import { initLenis, destroyLenis } from './lib/lenis';
import { useReducedMotion } from './hooks/useReducedMotion';

import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IdentitySection from './components/IdentitySection';
import Ecosystem from './components/Ecosystem';
import ServiceList from './components/ServiceList';
import ProcessTimeline from './components/ProcessTimeline';
import ProjectShowcase from './components/ProjectShowcase';
import TechSection from './components/TechSection';
import WhyDotFreelancer from './components/WhyDotFreelancer';
import About from './components/About';
import Proof from './components/Proof';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import DataDeletion from './components/DataDeletion';
import NotFound from './components/NotFound';

type Route = 'home' | 'privacy' | 'data-deletion' | 'not-found';

function getInitialRoute(): Route {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const hash = window.location.hash.toLowerCase();

  if (
    path === '/data-deletion' ||
    path === '/data-deletion-request' ||
    path === '/data-deletion-instructions' ||
    path === '/deletion' ||
    hash === '#data-deletion' ||
    hash === '#data-deletion-request' ||
    hash === '#data-deletion-instructions' ||
    hash === '#deletion'
  ) {
    return 'data-deletion';
  }

  if (path === '/privacy-policy' || path === '/privacy' || hash === '#privacy-policy' || hash === '#privacy') {
    return 'privacy';
  }

  if (path === '/' || path === '' || path === '/index.html') {
    return 'home';
  }

  return 'not-found';
}

export default function App() {
  const [route, setRoute] = useState<Route>(getInitialRoute);
  const [loading, setLoading] = useState(() => getInitialRoute() === 'home');
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setLoading(false);
      return;
    }
  }, [reduced]);

  // Synchronize route with browser history (back/forward buttons and hash navigation)
  useEffect(() => {
    const onLocationChange = () => {
      const newRoute = getInitialRoute();
      setRoute(newRoute);
      if (newRoute === 'privacy' || newRoute === 'data-deletion' || newRoute === 'not-found') {
        const hash = window.location.hash;
        if (hash) {
          setTimeout(() => {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    };

    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, []);

  useEffect(() => {
    initLenis();
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(t);
      destroyLenis();
    };
  }, [route]);

  const navigateToPrivacy = () => {
    setRoute('privacy');
    if (window.location.pathname !== '/privacy-policy') {
      window.history.pushState({}, '', '/privacy-policy');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setRoute('home');
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => ScrollTrigger.refresh(), 200);
  };

  const navigateToContact = () => {
    setRoute('home');
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      window.history.pushState({}, '', '/#contact');
    }
    setTimeout(() => {
      const el = document.querySelector('#contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      ScrollTrigger.refresh();
    }, 150);
  };

  return (
    <>
      <div className="grain" />
      <div className="grid-backdrop" />
      <CustomCursor />
      {loading && <Loader onComplete={() => setLoading(false)} />}

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10001] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-[#0a0a0a]"
      >
        Skip to content
      </a>

      <Navbar
        currentRoute={route}
        onNavigateHome={navigateToHome}
        onNavigateContact={navigateToContact}
      />

      <main id="main-content" className="relative z-[1]">
        {route === 'privacy' ? (
          <PrivacyPolicy onBackToHome={navigateToHome} />
        ) : route === 'data-deletion' ? (
          <DataDeletion onBackToHome={navigateToHome} />
        ) : route === 'not-found' ? (
          <NotFound onBackToHome={navigateToHome} onNavigateContact={navigateToContact} />
        ) : (
          <>
            <Hero introReady={!loading} />
            <IdentitySection />
            <Ecosystem />
            <ServiceList />
            <ProcessTimeline />
            <ProjectShowcase />
            <TechSection />
            <WhyDotFreelancer />
            <About />
            <Proof />
            <Contact onNavigatePrivacy={navigateToPrivacy} />
          </>
        )}
      </main>

      <Footer
        onNavigatePrivacy={navigateToPrivacy}
        onNavigateHome={navigateToHome}
      />
    </>
  );
}
