import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const shapes = shapesRef.current;

    if (!section || !content || !shapes) return;

    const ctx = gsap.context(() => {
      const elements = content.querySelectorAll('.animate-item');
      const shapeElements = shapes.querySelectorAll('.ambient-shape');

      // Initial states
      gsap.set(elements, { opacity: 0, y: 20 });
      gsap.set(shapeElements, { opacity: 0, scale: 0.9 });

      // Load animation - simple fade in
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.2
      });

      gsap.to(shapeElements, {
        opacity: 0.6,
        scale: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.4
      });

      // Simple parallax on scroll - no pin, just fade out
      gsap.to(content, {
        y: -50,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToWork = () => {
    const workSection = document.getElementById('work-mosaic');
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'auto' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center bg-[#0B0B10] z-10"
    >
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,11,16,0.4)_100%)] pointer-events-none" />
      
      {/* Ambient shapes - reduced count */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="ambient-shape w-16 h-16 top-[12%] left-[8%]" />
        <div className="ambient-shape w-24 h-24 top-[75%] left-[5%] rotate-12" />
        <div className="ambient-shape w-20 h-20 top-[15%] right-[10%] -rotate-6" />
      </div>

      {/* Center Card */}
      <div 
        ref={contentRef}
        className="relative w-[min(78vw,1100px)] bg-[#F4F4F2] rounded-[28px] 
                   shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                   flex flex-col justify-between p-[6%] my-20 gpu-accelerated"
      >
        {/* Arrow icon */}
        <div 
          className="absolute top-[12%] right-[6%] w-10 h-10 
                     flex items-center justify-center
                     border border-[#0B0B10]/20 rounded-full
                     text-[#0B0B10] animate-item"
        >
          <ArrowUpRight className="w-5 h-5" />
        </div>

        {/* Main content */}
        <div className="flex flex-col gap-4">
          <h1 
            className="text-display text-[clamp(48px,10vw,140px)] text-[#0B0B10] animate-item"
          >
            ACHYUTH
          </h1>
          <p 
            className="text-[clamp(18px,2.5vw,32px)] font-medium text-[#0B0B10]/90 animate-item"
          >
            Full Stack Developer
          </p>
          <p 
            className="text-[clamp(14px,1.2vw,18px)] text-[#6C6C70] max-w-md leading-relaxed animate-item"
          >
            I build fast, accessible interfaces and scalable systems with precision and passion.
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between mt-8">
          <span 
            className="text-micro text-[#6C6C70] animate-item"
          >
            Based in Illinois, USA
          </span>
          <button 
            onClick={scrollToWork}
            className="btn-accent flex items-center gap-2 animate-item"
          >
            Explore work
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
