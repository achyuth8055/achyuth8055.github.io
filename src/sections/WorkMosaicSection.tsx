import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WorkMosaicSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const elements = elementsRef.current;

    if (!section || !elements) return;

    const ctx = gsap.context(() => {
      const cards = elements.querySelectorAll('.work-card');
      const label = elements.querySelector('.work-label');

      // Initial states
      gsap.set(label, { opacity: 0, y: -10 });
      gsap.set(cards, { opacity: 0, y: 40 });

      // Simple reveal animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          once: true
        }
      });

      tl.to(label, { opacity: 1, y: 0, duration: 0.5 })
        .to(cards, { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          ease: 'power2.out'
        }, '-=0.3');

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="work-mosaic"
      className="relative w-full min-h-screen bg-[#0B0B10] z-20 py-20"
    >
      <div ref={elementsRef} className="px-[6vw]">
        {/* Micro label */}
        <span 
          className="work-label block text-micro text-[#A6A6AA] mb-8"
        >
          SELECTED WORK
        </span>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left big card - Products */}
          <div 
            className="work-card card-white p-8 flex flex-col justify-between lg:row-span-2 gpu-accelerated"
            style={{ minHeight: '400px' }}
          >
            <div>
              <h2 className="text-display text-[clamp(32px,4vw,56px)] text-[#0B0B10] mb-4">
                Products
              </h2>
              <p className="text-[#6C6C70] text-[clamp(14px,1.1vw,16px)] leading-relaxed max-w-sm">
                End-to-end apps—frontend polish, backend resilience. 
                Building scalable solutions that users love.
              </p>
            </div>
            <div className="flex items-center gap-2 text-micro text-[#0B0B10]/60 mt-6">
              <span className="w-2 h-2 bg-[#FF4D2E] rounded-full" />
              12+ Projects Delivered
            </div>
          </div>

          {/* Right top card - Systems */}
          <div 
            className="work-card card-white p-8 flex flex-col justify-between gpu-accelerated"
          >
            <div>
              <h2 className="text-display text-[clamp(28px,3.5vw,48px)] text-[#0B0B10] mb-3">
                Systems
              </h2>
              <p className="text-[#6C6C70] text-[clamp(13px,1vw,15px)] leading-relaxed max-w-md">
                Design systems, APIs, and component libraries that scale with your team.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap mt-4">
              {['React', 'Spring Boot', 'AWS', 'Docker'].map((tech) => (
                <span 
                  key={tech}
                  className="px-3 py-1.5 bg-[#0B0B10]/5 rounded-full text-micro text-[#0B0B10]/70"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right bottom image card - Experiments */}
          <div 
            className="work-card relative rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.25)] gpu-accelerated"
            style={{ minHeight: '250px' }}
          >
            <img 
              src="/hero_portrait.jpg" 
              alt="Experiments" 
              className="absolute inset-0 w-full h-full object-cover img-optimized"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B10]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-micro text-[#F4F4F2]/70 block mb-1">Experiments</span>
              <p className="text-[#F4F4F2] text-sm leading-relaxed">
                Prototypes, interactions, performance tests. Always exploring new technologies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
