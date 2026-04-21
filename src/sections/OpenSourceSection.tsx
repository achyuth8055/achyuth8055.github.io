import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GitBranch, CheckCircle2, Star, ExternalLink, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type Contribution = {
  project: string;
  tagline: string;
  description: string;
  status: 'Active contributor';
  repo: string;
  stars: string;
  accent: string;
  focus: string[];
};

const contributions: Contribution[] = [
  {
    project: 'Apache Maven',
    tagline: 'Build & dependency management for the JVM',
    description:
      'Contributing to core tooling — investigating issues, proposing fixes, and helping refine developer-facing behavior in one of the most widely used build systems in the Java ecosystem.',
    status: 'Active contributor',
    repo: 'apache/maven',
    stars: '4.3k+',
    accent: '#FF4D2E',
    focus: ['Java', 'Build systems', 'DX'],
  },
  {
    project: 'Checkstyle',
    tagline: 'Static analysis for Java code quality',
    description:
      'Ongoing contributor — shipping bug fixes, refining rule behavior, and helping keep one of the most used Java linting tools stable and consistent for teams worldwide.',
    status: 'Active contributor',
    repo: 'checkstyle/checkstyle',
    stars: '8.4k+',
    accent: '#7B5BFF',
    focus: ['Java', 'Static analysis', 'Rules engine'],
  },
];

export default function OpenSourceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const items = section.querySelectorAll('.anim');
      gsap.set(items, { opacity: 0, y: 22 });
      ScrollTrigger.create({
        trigger: section,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.55,
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
      id="open-source"
      className="relative w-full bg-[#07070B] py-[14vh] px-[6vw] overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-12 max-w-3xl">
          <span className="anim eyebrow">Open Source</span>
          <h2 className="anim text-display text-[clamp(40px,6vw,88px)] text-[var(--text)] mt-4">
            Giving back to <span className="gradient-text">the stack</span>.
          </h2>
          <p className="anim text-[var(--text-mut)] text-[clamp(15px,1.2vw,18px)] mt-5 max-w-2xl">
            I contribute to the tools I use every day — reviewing issues, submitting patches,
            and helping keep these JVM projects reliable for the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {contributions.map((c) => (
            <div key={c.project} className="anim card-dark card-dark-hover p-7 gpu flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${c.accent}14`,
                    border: `1px solid ${c.accent}45`,
                  }}
                >
                  <GitBranch className="w-5 h-5" style={{ color: c.accent }} />
                </div>
                <span
                  className="chip"
                  style={{
                    background: `${c.accent}12`,
                    color: c.accent,
                    borderColor: `${c.accent}40`,
                  }}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {c.status}
                </span>
              </div>

              <h3 className="text-display text-[clamp(22px,2vw,28px)] text-[var(--text)] mb-1">
                {c.project}
              </h3>
              <p className="text-sm text-[var(--text)]/75 mb-3">{c.tagline}</p>
              <p className="text-sm text-[var(--text-mut)] leading-relaxed mb-5 flex-1">
                {c.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {c.focus.map((f) => (
                  <span key={f} className="chip">
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-soft)]">
                <div className="flex items-center gap-2 text-sm text-[var(--text-mut)]">
                  <Star className="w-4 h-4" style={{ color: c.accent }} />
                  <span className="font-mono">{c.stars}</span>
                  <span className="font-mono text-xs text-[var(--text-dim)] ml-1">{c.repo}</span>
                </div>
                <a
                  href={`https://github.com/${c.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Repo
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
