import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Code,
  Server,
  Layout,
  Database,
  Cloud,
  Smartphone,
  Brain,
  Award,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    icon: Code,
    title: 'Languages',
    skills: ['Java', 'Swift', 'Python', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    icon: Smartphone,
    title: 'iOS',
    skills: ['SwiftUI', 'UIKit', 'AVFoundation', 'UserNotifications', 'HealthKit', 'CloudKit'],
  },
  {
    icon: Server,
    title: 'Backend',
    skills: ['Spring Boot', 'Node.js', 'Express', 'REST', 'Hibernate', 'PHP'],
  },
  {
    icon: Layout,
    title: 'Frontend',
    skills: ['React', 'Next.js', 'Redux', 'Tailwind', 'HTML5', 'CSS3'],
  },
  {
    icon: Database,
    title: 'Data',
    skills: ['MySQL', 'MongoDB', 'DynamoDB', 'Redis', 'Kafka'],
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitHub Actions'],
  },
  {
    icon: Brain,
    title: 'AI & Automation',
    skills: ['LLM APIs', 'NLP', 'Web Scraping', 'SEO Scoring', 'Data Pipelines'],
  },
  {
    icon: Award,
    title: 'Certifications',
    skills: ['AWS Cloud Practitioner'],
  },
];

export default function SkillsSection() {
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
            duration: 0.5,
            stagger: 0.04,
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
      id="skills"
      className="relative w-full bg-[#07070B] py-[14vh] px-[6vw] overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-12 max-w-3xl">
          <span className="anim eyebrow">Toolkit</span>
          <h2 className="anim text-display text-[clamp(40px,6vw,88px)] text-[var(--text)] mt-4">
            Skills &amp; <span className="gradient-text">stack</span>.
          </h2>
          <p className="anim text-[var(--text-mut)] text-[clamp(15px,1.2vw,18px)] mt-5 max-w-2xl">
            A toolkit built over years of shipping production-grade web, iOS, and backend
            systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="anim card-dark card-dark-hover p-6 gpu">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/25 flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <h3 className="text-display text-lg text-[var(--text)] mb-3">{c.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
