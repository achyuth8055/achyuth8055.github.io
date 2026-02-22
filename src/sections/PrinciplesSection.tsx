import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, Zap, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    number: '01',
    title: 'Clarity first',
    description: 'If users hesitate, the design failed. I prioritize readable layouts and predictable interactions that guide users naturally.',
    icon: Eye
  },
  {
    number: '02',
    title: 'Performance always',
    description: 'Fast loads, smooth animations, and efficient queries aren\'t extras—they\'re baseline. Every millisecond matters.',
    icon: Zap
  },
  {
    number: '03',
    title: 'Collaboration',
    description: 'Great work happens with clear communication, honest feedback, and shared goals. I believe in team success.',
    icon: Users
  }
];

export default function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const elements = elementsRef.current;

    if (!section || !elements) return;

    const ctx = gsap.context(() => {
      const headline = elements.querySelector('.principles-headline');
      const cards = elements.querySelectorAll('.principle-card');

      // Initial states
      gsap.set(headline, { opacity: 0, y: 20 });
      gsap.set(cards, { opacity: 0, y: 30 });

      // Reveal animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          once: true
        }
      });

      tl.to(headline, { opacity: 1, y: 0, duration: 0.5 })
        .to(cards, { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.12,
          ease: 'power2.out'
        }, '-=0.3');

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="principles"
      className="relative w-full min-h-screen bg-[#0B0B10] z-40 py-20"
    >
      <div ref={elementsRef} className="px-[6vw]">
        {/* Headline */}
        <div className="principles-headline mb-12">
          <h2 className="text-display text-[clamp(44px,6vw,96px)] text-[#F4F4F2] mb-2">
            PRINCIPLES
          </h2>
          <p className="text-[#A6A6AA] text-[clamp(16px,1.5vw,22px)]">
            How I build
          </p>
        </div>

        {/* Principle cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <div
                key={principle.number}
                className="principle-card card-white p-8 flex flex-col gpu-accelerated"
                style={{ minHeight: '380px' }}
              >
                {/* Index */}
                <span className="text-micro text-[#0B0B10]/40 mb-6">
                  {principle.number}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-[#0B0B10]/5 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-[#0B0B10]/70" />
                </div>

                {/* Content */}
                <h3 className="text-display text-[clamp(20px,2vw,32px)] text-[#0B0B10] mb-4">
                  {principle.title}
                </h3>
                <p className="text-[#6C6C70] text-[clamp(13px,0.95vw,15px)] leading-relaxed flex-1">
                  {principle.description}
                </p>

                {/* Bottom accent line */}
                <div className="w-full h-1 bg-[#0B0B10]/10 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="h-full bg-[#FF4D2E] rounded-full"
                    style={{ width: `${60 + parseInt(principle.number) * 15}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
