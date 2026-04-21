import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Download, Mail, Sparkles, MapPin } from 'lucide-react';
import Floating3DScene from '../components/Floating3DScene';
import { useTilt } from '../hooks/use-tilt';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const portraitTiltRef = useTilt<HTMLDivElement>({ max: 6, perspective: 1200 });

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const items = content.querySelectorAll('.anim');
      gsap.set(items, { opacity: 0, y: 24 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power3.out',
        delay: 0.15,
      });

      gsap.to(content, {
        y: -40,
        opacity: 0.6,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-screen flex items-center bg-[#07070B] overflow-hidden"
    >
      <Floating3DScene variant="hero" />

      <div
        ref={contentRef}
        className="relative w-full max-w-[1280px] mx-auto px-[6vw] py-24 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center"
      >
        {/* Left column */}
        <div className="lg:col-span-7 flex flex-col gap-7">
          <span className="anim eyebrow">Portfolio · 2026</span>

          <h1 className="anim text-display text-[clamp(56px,10vw,148px)]">
            <span className="block text-[var(--text)]">Hi, I'm</span>
            <span className="block">
              <span className="gradient-text">Achyuth.</span>
            </span>
          </h1>

          <p className="anim text-[clamp(18px,2vw,26px)] font-medium text-[var(--text)]/90 max-w-2xl">
            Full-Stack &amp; iOS developer — shipping polished products, AI tooling, and
            automation that solves real problems.
          </p>

          <p className="anim text-[clamp(14px,1.1vw,17px)] text-[var(--text-mut)] max-w-xl leading-relaxed">
            I build across the stack: responsive web apps, native iOS experiences, and
            data pipelines. Currently contributing to{' '}
            <span className="text-[var(--text)]">Apache Maven</span> and{' '}
            <span className="text-[var(--text)]">Checkstyle</span>.
          </p>

          <div className="anim flex flex-wrap items-center gap-3 pt-2">
            <button onClick={() => scrollTo('contact')} className="btn-accent">
              <Mail className="w-4 h-4" />
              Contact me
            </button>
            <a
              href="/Achyuth_SWE_Resume.pdf"
              download="Achyuth_Kummari_Resume.pdf"
              className="btn-ghost"
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
            <button
              onClick={() => scrollTo('projects')}
              className="flex items-center gap-2 text-[var(--text-mut)] hover:text-[var(--accent)] transition-colors ml-1"
            >
              <span className="text-micro">See projects</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="anim flex flex-wrap items-center gap-6 pt-6 border-t border-[var(--border-soft)]">
            <span className="chip">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available for work
            </span>
            <span className="flex items-center gap-2 text-sm text-[var(--text-mut)]">
              <MapPin className="w-4 h-4" />
              Illinois, USA
            </span>
            <span className="flex items-center gap-2 text-sm text-[var(--text-mut)]">
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              Web · iOS · AI · Automation
            </span>
          </div>
        </div>

        {/* Right column - portrait */}
        <div className="lg:col-span-5 relative">
          <div
            ref={portraitTiltRef}
            className="anim portrait-frame accent-ring aspect-[4/5] w-full max-w-[420px] mx-auto gpu"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <img
              src="/myself.jpg"
              alt="Achyuth Kummari"
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'contrast(1.02) saturate(1.05)' }}
            />
            {/* Overlay frame elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07070B] via-transparent to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-micro text-white">Online</span>
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <div className="text-display text-xl text-white">Achyuth K.</div>
                <div className="text-micro text-white/70 mt-1">SWE · Builder</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Floating info cards around portrait */}
          <div className="anim hidden md:flex absolute -bottom-4 -left-2 card-dark px-4 py-3 gap-3 items-center float-y-slow">
            <div className="w-9 h-9 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 flex items-center justify-center">
              <span className="text-[var(--accent)] font-bold text-sm">AM</span>
            </div>
            <div>
              <div className="text-xs text-[var(--text-mut)]">Contributing to</div>
              <div className="text-sm font-medium text-[var(--text)]">Apache Maven</div>
            </div>
          </div>

          <div className="anim hidden md:flex absolute -top-4 -right-2 card-dark px-4 py-3 gap-3 items-center float-y">
            <div className="w-9 h-9 rounded-full bg-[var(--violet)]/15 border border-[var(--violet)]/40 flex items-center justify-center">
              <span className="text-[var(--violet)] font-bold text-xs">OSS</span>
            </div>
            <div>
              <div className="text-xs text-[var(--text-mut)]">Checkstyle</div>
              <div className="text-sm font-medium text-[var(--text)]">8.4k+ ★</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
