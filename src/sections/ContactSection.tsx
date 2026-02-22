import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Linkedin, Github, Download, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const elements = elementsRef.current;

    if (!section || !elements) return;

    const ctx = gsap.context(() => {
      const items = elements.querySelectorAll('.animate-item');

      // Initial states
      gsap.set(items, { opacity: 0, y: 20 });

      // Reveal animation
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter: () => {
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out'
          });
        },
        once: true
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#F4F4F2] z-70 py-[10vh] px-[6vw]"
    >
      <div ref={elementsRef} className="max-w-5xl">
        {/* Big headline */}
        <h2 
          className="animate-item text-display text-[clamp(56px,9vw,140px)] text-[#0B0B10] mb-6"
        >
          LET'S BUILD.
        </h2>

        {/* Body */}
        <p 
          className="animate-item text-[#6C6C70] text-[clamp(16px,1.3vw,20px)] leading-relaxed max-w-lg mb-8"
        >
          Have a project, role, or idea? I'm open to new opportunities and always excited 
          to work on challenging problems.
        </p>

        {/* CTA buttons */}
        <div className="animate-item flex flex-wrap gap-4 mb-12">
          <a 
            href="mailto:ask.achyuthkumar@gmail.com"
            className="btn-accent flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Email me
          </a>
          <a 
            href="/Achyuth_SWE_Resume.pdf"
            download="Achyuth_Kummari_Resume.pdf"
            className="flex items-center gap-2 px-6 py-3 rounded-full
                       border-2 border-[#0B0B10] text-[#0B0B10] font-medium
                       hover:bg-[#0B0B10] hover:text-[#F4F4F2] transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            Download resume
          </a>
        </div>

        {/* Contact details */}
        <div className="space-y-4 mb-12">
          <a 
            href="mailto:ask.achyuthkumar@gmail.com"
            className="animate-item flex items-center gap-3 text-[#0B0B10] 
                       hover:text-[#FF4D2E] transition-colors duration-200 group"
          >
            <Mail className="w-5 h-5" />
            <span className="font-mono text-sm">ask.achyuthkumar@gmail.com</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <div className="animate-item flex items-center gap-3 text-[#0B0B10]">
            <Phone className="w-5 h-5" />
            <span className="font-mono text-sm">+1 (219) 280-1805</span>
          </div>
          <div className="animate-item flex items-center gap-3 text-[#0B0B10]">
            <MapPin className="w-5 h-5" />
            <span className="font-mono text-sm">Illinois, USA</span>
          </div>
        </div>

        {/* Social links */}
        <div className="animate-item flex gap-4">
          <a 
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#0B0B10] flex items-center justify-center
                       text-[#F4F4F2] hover:bg-[#FF4D2E] transition-colors duration-300 gpu-accelerated"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a 
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#0B0B10] flex items-center justify-center
                       text-[#F4F4F2] hover:bg-[#FF4D2E] transition-colors duration-300 gpu-accelerated"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-[6vw] right-[6vw] flex items-center justify-between">
        <span className="text-micro text-[#6C6C70]">
          © 2025 Achyuth Kummari
        </span>
        <span className="text-micro text-[#6C6C70]">
          Built with React + GSAP
        </span>
      </div>
    </section>
  );
}
