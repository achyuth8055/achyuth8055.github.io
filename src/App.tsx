import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import ExperienceSection from './sections/ExperienceSection';
import OpenSourceSection from './sections/OpenSourceSection';
import SkillsSection from './sections/SkillsSection';
import ContactSection from './sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="relative bg-[#07070B]">
      <div className="noise-overlay" />
      <Navigation />
      <main className="relative">
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <OpenSourceSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
