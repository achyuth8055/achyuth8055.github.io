import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Calendar, MapPin, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  type: 'Freelance' | 'Full-time' | 'Internship';
  achievements: string[];
};

const experiences: Experience[] = [
  {
    company: 'Independent Freelance',
    role: 'Full-Stack & iOS Developer · Automation Engineer',
    period: 'June 2023 — Present',
    location: 'Remote · USA / India',
    type: 'Freelance',
    achievements: [
      'Founded and shipped NovusChat.com — an embeddable RAG chatbot that trains on each client\'s own documents to behave like their actual customer-support agent; features appointment booking, owner reminders, lead capture, analytics, and widget / REST / iOS & Android SDK distribution.',
      'Led a complete website redesign for SiteWorkThit.com — restructured information architecture and component system for a noticeably more user-friendly, on-brand experience.',
      'Shipped ShareItHub.com and contributed to ImageAndPDF.com, owning full-stack delivery from architecture to production deployment.',
      'Built an AI-powered blog writer that ingests raw drafts and returns publish-ready content with SEO, readability, and keyword-density scoring.',
      'Designed and shipped two native iOS apps: a premium offline music player with multi-cloud import (Google Drive, OneDrive, local) and a water-reminder companion for daily hydration.',
      'Engaged by a startup tax-appeal firm: identified that clients struggled to retrieve their parcel PIN, evaluated existing solutions, and — finding none — built an automated scraping pipeline that pulls PIN, historical tax bills, and deed records into a single client-ready report.',
    ],
  },
  {
    company: 'Code Mania',
    role: 'Full-Stack Developer',
    period: 'July 2022 — June 2023',
    location: 'Hyderabad, India',
    type: 'Full-time',
    achievements: [
      'Developed and maintained responsive web applications using React.js, improving user engagement by 20%.',
      'Built scalable backend services with Node.js and Express, implementing RESTful APIs and authentication.',
      'Designed and managed MongoDB and SQL schemas, optimizing queries to reduce load time by 30%.',
      'Deployed applications to Heroku and DigitalOcean and managed Git in Agile cycles.',
    ],
  },
  {
    company: 'GenY Medium',
    role: 'Jr. Web Developer Intern',
    period: 'April 2022 — June 2022',
    location: 'Hyderabad, India',
    type: 'Internship',
    achievements: [
      'Developed responsive interfaces using Bootstrap, improving cross-device compatibility.',
      'Built server-side functionality with PHP and SQL, handling form processing and database ops.',
      'Participated in code reviews and collaborated on production troubleshooting.',
    ],
  },
];

export default function ExperienceSection() {
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
            stagger: 0.06,
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
      id="experience"
      className="relative w-full bg-[#07070B] py-[14vh] px-[6vw] overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-14 max-w-3xl">
          <span className="anim eyebrow">Career</span>
          <h2 className="anim text-display text-[clamp(40px,6vw,88px)] text-[var(--text)] mt-4">
            Experience.
          </h2>
          <p className="anim text-[var(--text-mut)] text-[clamp(15px,1.2vw,18px)] mt-5 max-w-2xl">
            Freelance engagements, product roles, and early-career work — all centered on
            turning fuzzy requirements into reliable, shipped software.
          </p>
        </div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="hidden md:block absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--accent)]/40 via-[var(--border-mid)] to-transparent"
            aria-hidden
          />

          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={`${exp.company}-${exp.period}`} className="anim relative">
                {/* Timeline dot */}
                <div
                  className="hidden md:block absolute left-0 top-8 w-4 h-4 rounded-full border-2 border-[var(--accent)] bg-[#07070B]"
                  aria-hidden
                />
                <div className="md:pl-12">
                  <div className="card-dark card-dark-hover p-7 md:p-9 gpu">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-1.5">
                          <Briefcase className="w-4 h-4 text-[var(--accent)]" />
                          <h3 className="text-display text-[clamp(20px,2vw,28px)] text-[var(--text)]">
                            {exp.company}
                          </h3>
                          <span className="chip chip-accent">{exp.type}</span>
                        </div>
                        <p className="text-[var(--text)]/80 font-medium">{exp.role}</p>
                      </div>
                      <div className="flex flex-col gap-1 text-sm text-[var(--text-mut)] md:text-right">
                        <span className="flex items-center gap-2 md:justify-end">
                          <Calendar className="w-4 h-4" />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-2 md:justify-end">
                          <MapPin className="w-4 h-4" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2.5">
                      {exp.achievements.map((a, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <ChevronRight className="w-4 h-4 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[var(--text-mut)] leading-relaxed">
                            {a}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
