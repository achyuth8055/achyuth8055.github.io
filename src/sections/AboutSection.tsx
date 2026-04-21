import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Code2, Rocket, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  {
    icon: GraduationCap,
    value: 'M.S.',
    label: 'Computer & Information Systems',
    sub: 'Lewis University · GPA 3.80',
  },
  {
    icon: Code2,
    value: '3+ yrs',
    label: 'Building production software',
    sub: 'Web · iOS · Cloud',
  },
  {
    icon: Rocket,
    value: '7+',
    label: 'Products shipped',
    sub: 'Freelance & full-time',
  },
  {
    icon: Award,
    value: 'AWS',
    label: 'Cloud Practitioner',
    sub: 'Certified',
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const items = section.querySelectorAll('.anim');
      gsap.set(items, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.07,
            ease: 'power3.out',
          });
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-[#07070B] py-[14vh] px-[6vw] overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-14 max-w-3xl">
          <span className="anim eyebrow">About</span>
          <h2 className="anim text-display text-[clamp(40px,6vw,88px)] text-[var(--text)] mt-4">
            A builder who cares about <span className="gradient-text">craft</span>.
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Portrait + highlights column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="anim portrait-frame aspect-[4/5] w-full max-w-[440px] gpu">
              <img
                src="/myself.jpg"
                alt="Achyuth Kummari portrait"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070B]/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="text-display text-2xl text-white">Achyuth Kummari</div>
                <div className="text-micro text-white/70 mt-1">Illinois, USA</div>
              </div>
            </div>
          </div>

          {/* Bio + stats */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="space-y-4 text-[var(--text-mut)] text-[clamp(15px,1.2vw,18px)] leading-relaxed">
              <p className="anim">
                I'm a software engineer who gravitates toward clarity — in code, in UI, and in
                user experience. My work spans full-stack web products, native iOS apps, and the
                quiet automation that makes real businesses faster.
              </p>
              <p className="anim">
                I've redesigned production sites for freelance clients, shipped standalone
                products like <span className="text-[var(--text)]">NovusChat</span> — an
                embeddable RAG chatbot that turns any team's docs into a real customer-support
                agent —{' '}
                <span className="text-[var(--text)]">ShareItHub</span>,{' '}
                <span className="text-[var(--text)]">SiteWorkThit</span>, and{' '}
                <span className="text-[var(--text)]">ImageAndPDF</span>, and built iOS apps — a
                premium offline music player with multi-cloud import and a water-reminder app
                that keeps people hydrated.
              </p>
              <p className="anim">
                On the open-source side, I contribute to{' '}
                <span className="text-[var(--text)]">Apache Maven</span> and{' '}
                <span className="text-[var(--text)]">Checkstyle</span> — giving back to the JVM
                tools I use every day.
              </p>
            </div>

            <div className="anim grid grid-cols-2 gap-4">
              {highlights.map((h) => {
                const Icon = h.icon;
                return (
                  <div key={h.label} className="card-dark card-dark-hover p-5 gpu">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[var(--accent)]/12 border border-[var(--accent)]/30 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[var(--accent)]" />
                      </div>
                      <div className="text-display text-xl text-[var(--text)]">{h.value}</div>
                    </div>
                    <div className="text-sm text-[var(--text)] font-medium">{h.label}</div>
                    <div className="text-xs text-[var(--text-dim)] mt-1">{h.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
