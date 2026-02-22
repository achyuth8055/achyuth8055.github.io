import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const elements = elementsRef.current;

    if (!section || !elements) return;

    const ctx = gsap.context(() => {
      const cards = elements.querySelectorAll('.about-card');
      const decor = elements.querySelector('.decor-square');

      // Initial states
      gsap.set(cards, { opacity: 0, y: 30 });
      gsap.set(decor, { opacity: 0, scale: 0.8 });

      // Reveal animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          once: true
        }
      });

      tl.to(cards, { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          ease: 'power2.out'
        })
        .to(decor, { 
          opacity: 1, 
          scale: 1, 
          duration: 0.5,
          ease: 'back.out(1.5)'
        }, '-=0.3');

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-screen bg-[#0B0B10] z-30 py-20"
    >
      <div ref={elementsRef} className="px-[6vw]">
        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top-left image card */}
          <div 
            className="about-card relative rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.25)] gpu-accelerated"
            style={{ minHeight: '280px' }}
          >
            <img 
              src="/about_workspace.jpg" 
              alt="Workspace" 
              className="absolute inset-0 w-full h-full object-cover img-optimized"
              loading="lazy"
            />
          </div>

          {/* Top-right text card - About */}
          <div 
            className="about-card card-white p-8 flex flex-col justify-center gpu-accelerated"
          >
            <h2 className="text-display text-[clamp(28px,3.5vw,48px)] text-[#0B0B10] mb-4">
              About
            </h2>
            <p className="text-[#6C6C70] text-[clamp(13px,1vw,16px)] leading-relaxed">
              I'm a developer who cares about clarity—clean code, clear UI, and calm user experiences. 
              Master's in Computer and Information Systems from Lewis University (GPA: 3.80/4.00). 
              I bring both technical depth and product thinking to every project.
            </p>
          </div>

          {/* Bottom-left text card - Approach */}
          <div 
            className="about-card card-white p-8 flex flex-col justify-center gpu-accelerated"
          >
            <h2 className="text-display text-[clamp(28px,3.5vw,48px)] text-[#0B0B10] mb-4">
              Approach
            </h2>
            <p className="text-[#6C6C70] text-[clamp(13px,1vw,16px)] leading-relaxed mb-4">
              Prototype early. Test often. Ship with confidence. I collaborate closely and document decisions.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              {[
                'User-centered design thinking',
                'Agile development practices',
                'Continuous integration & delivery',
                'Performance-first mindset'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#FF4D2E] rounded-full" />
                  <span className="text-sm text-[#0B0B10]/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom-right image card */}
          <div 
            className="about-card relative rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.25)] gpu-accelerated"
            style={{ minHeight: '320px' }}
          >
            <img 
              src="/about_outdoor.jpg" 
              alt="Outside code" 
              className="absolute inset-0 w-full h-full object-cover img-optimized"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B10]/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-micro text-[#F4F4F2]/70 block mb-1">Outside code</span>
              <p className="text-[#F4F4F2] text-sm leading-relaxed">
                Cycling, local coffee spots, and weekend side projects keep me balanced and inspired.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative square */}
        <div 
          className="decor-square hidden lg:block absolute w-11 h-11 border-[1.5px] border-[#2A2A35] rounded-[10px]"
          style={{ left: '48vw', top: '46vh' }}
        />
      </div>
    </section>
  );
}
