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

export default function App() {
  const [loading, setLoading] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setLoading(false);
      return;
    }
  }, [reduced]);

  useEffect(() => {
    initLenis();
    // Give layout a moment to settle (fonts, images) before measuring.
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(t);
      destroyLenis();
    };
  }, []);

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

      <Navbar />

      <main id="main-content" className="relative z-[1]">
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
        <Contact />
      </main>

      <Footer />
    </>
  );
}
