import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ExternalLink,
  Globe,
  FileText,
  Layers,
  Share2,
  PenLine,
  Building2,
  Music2,
  Droplets,
  Apple,
  Sparkles,
  Bot,
} from 'lucide-react';
import Floating3DScene from '../components/Floating3DScene';

gsap.registerPlugin(ScrollTrigger);

type Category = 'All' | 'Web' | 'iOS' | 'AI' | 'Automation';

type Project = {
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  liveUrl: string | null;
  category: Exclude<Category, 'All'>;
  role: string;
  highlight?: string;
  icon: typeof Sparkles;
  accent: string;
  gradient: string;
  extra?: string[];
};

const projects: Project[] = [
  {
    title: 'NovusChat',
    tagline: 'AI-powered customer support that actually works',
    description:
      'An embeddable RAG chatbot that behaves like a real customer-support agent — trained on each client\'s own documents. Website owners upload PDFs, Word docs, and text files; NovusChat builds a private knowledge base (FAISS vector DB, semantic search, real-time streaming) and drops into any site via a one-line widget, REST API, or iOS/Android SDK.',
    tags: ['React', 'Node.js', 'LLM', 'RAG', 'FAISS', 'SaaS'],
    liveUrl: 'https://novuschat.com',
    category: 'AI',
    role: 'Founder · Full-Stack Developer',
    highlight: 'Flagship · Live SaaS',
    icon: Bot,
    accent: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #7B5BFF 100%)',
    extra: [
      'Custom knowledge base — unlimited PDF / Word / text, batch upload',
      'Appointment booking + reminder notifications to the owner',
      'Lead capture, conversation history & bot analytics',
      'Business tone presets, editable system prompts, custom branding',
      'Widget embed, REST API, iOS & Android SDKs',
      'Domain-based protection, usage limits, team access',
    ],
  },
  {
    title: 'SiteWorkThit',
    tagline: 'Full website redesign for a construction-tech platform',
    description:
      'Freelance engagement: rebuilt the product site end-to-end. Restructured information architecture, introduced a reusable component system, and made every flow noticeably more user-friendly without touching the underlying product.',
    tags: ['React', 'Next.js', 'Tailwind', 'UX'],
    liveUrl: 'https://siteworkthit.com',
    category: 'Web',
    role: 'Freelance · Lead Developer',
    highlight: 'Live product',
    icon: Layers,
    accent: '#FF4D2E',
    gradient: 'linear-gradient(135deg, #FF4D2E 0%, #FF8860 100%)',
  },
  {
    title: 'ShareItHub',
    tagline: 'Share-and-discover web platform',
    description:
      'Built a lightweight hub for sharing assets and links. Added authentication, moderation, and an optimized feed pipeline so pages stay fast as the library grows.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    liveUrl: 'https://shareithub.com',
    category: 'Web',
    role: 'Full-Stack Developer',
    highlight: 'Live product',
    icon: Share2,
    accent: '#7B5BFF',
    gradient: 'linear-gradient(135deg, #7B5BFF 0%, #B190FF 100%)',
  },
  {
    title: 'ImageAndPDF',
    tagline: 'File conversion & compression suite',
    description:
      'A full-stack web app for image and PDF processing — conversion, compression, and format manipulation. Deployed on Render with a responsive UI and non-blocking server pipelines for large files.',
    tags: ['React', 'Node.js', 'Express', 'Render'],
    liveUrl: 'https://imageandpdf.com',
    category: 'Web',
    role: 'Full-Stack Developer',
    highlight: 'Deployed',
    icon: FileText,
    accent: '#22D3EE',
    gradient: 'linear-gradient(135deg, #22D3EE 0%, #5EEAD4 100%)',
  },
  {
    title: 'Offline Music Player',
    tagline: 'Premium iOS player with multi-cloud import',
    description:
      'Native iOS music player designed for true offline listening. Users connect Google Drive, OneDrive, and other cloud providers to import tracks, plus sideload local files — then listen without a connection.',
    tags: ['Swift', 'SwiftUI', 'AVFoundation', 'CloudKit', 'iOS'],
    liveUrl: null,
    category: 'iOS',
    role: 'iOS Developer · Solo',
    highlight: 'Native · Offline-first',
    icon: Music2,
    accent: '#FF4D2E',
    gradient: 'linear-gradient(135deg, #FF4D2E 0%, #7B5BFF 100%)',
    extra: [
      'Google Drive · OneDrive · local file import',
      'Favorites, Play Next, Add to Queue',
      'Background audio & lock-screen controls',
      'Offline-first library with smart caching',
    ],
  },
  {
    title: 'HydrateMe',
    tagline: 'iOS water-reminder to stay hydrated',
    description:
      'A gentle native iOS companion that nudges users to drink water across the day. Personalized goals, streaks, and contextual notifications — built to make a healthy habit effortless.',
    tags: ['Swift', 'SwiftUI', 'UserNotifications', 'HealthKit', 'iOS'],
    liveUrl: null,
    category: 'iOS',
    role: 'iOS Developer · Solo',
    highlight: 'Native · Notifications',
    icon: Droplets,
    accent: '#22D3EE',
    gradient: 'linear-gradient(135deg, #22D3EE 0%, #7B5BFF 100%)',
    extra: [
      'Adaptive daily goal (weight · activity)',
      'Smart reminders with quiet hours',
      'Streak tracking & weekly insights',
      'HealthKit sync (optional)',
    ],
  },
  {
    title: 'AI Blog Writer',
    tagline: 'SEO-aware content assistant',
    description:
      'An AI-powered editor that takes raw drafts and returns publish-ready posts. Scores content on SEO, readability, tone, and keyword density — then suggests targeted edits that measurably improve each section.',
    tags: ['React', 'Node.js', 'LLM APIs', 'NLP', 'SEO'],
    liveUrl: null,
    category: 'AI',
    role: 'Builder · Product Owner',
    highlight: 'AI + scoring engine',
    icon: PenLine,
    accent: '#FFB199',
    gradient: 'linear-gradient(135deg, #FF4D2E 0%, #FFB199 100%)',
  },
  {
    title: 'Property Data Automation',
    tagline: 'Parcel PIN, bills & deeds pipeline',
    description:
      'Freelance engagement for a startup tax-appeal firm. Identified a workflow gap where clients struggled to retrieve their parcel PIN — then researched existing tools, found none viable, and built an automated scraping pipeline that pulls the PIN along with historical tax bills and deed records into a single client-ready report.',
    tags: ['Python', 'Automation', 'Scraping', 'Data Pipeline'],
    liveUrl: null,
    category: 'Automation',
    role: 'Freelance · Automation Engineer',
    highlight: 'Client-facing tool',
    icon: Building2,
    accent: '#7B5BFF',
    gradient: 'linear-gradient(135deg, #7B5BFF 0%, #22D3EE 100%)',
  },
];

const categories: { label: Category; count?: number }[] = [
  { label: 'All' },
  { label: 'Web' },
  { label: 'iOS' },
  { label: 'AI' },
  { label: 'Automation' },
];

function ProjectCard({ project }: { project: Project }) {
  const Icon = project.icon;
  return (
    <article className="card-dark card-dark-hover p-0 overflow-hidden gpu flex flex-col">
      {/* Visual header */}
      <div
        className="relative h-[200px] overflow-hidden"
        style={{ background: project.gradient }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 40%)',
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {project.category === 'iOS' && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm">
                <Apple className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-mono text-white tracking-wider uppercase">
                  iOS
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm">
              <span className="text-[10px] font-mono text-white tracking-wider uppercase">
                {project.category}
              </span>
            </div>
          </div>
          {project.highlight && (
            <span className="text-[10px] font-mono text-white/90 tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm">
              {project.highlight}
            </span>
          )}
        </div>
        <div className="absolute bottom-5 left-5">
          <div className="w-14 h-14 rounded-2xl bg-black/35 border border-white/25 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <h3 className="text-display text-[clamp(22px,2vw,28px)] text-[var(--text)]">
            {project.title}
          </h3>
        </div>
        <p className="text-sm text-[var(--text)]/75 mb-3">{project.tagline}</p>
        <p className="text-sm text-[var(--text-mut)] leading-relaxed mb-4">
          {project.description}
        </p>

        {project.extra && (
          <ul className="mb-4 space-y-1.5">
            {project.extra.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm text-[var(--text-mut)]">
                <span
                  className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                  style={{ background: project.accent }}
                />
                {line}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border-soft)]">
          <span className="text-xs text-[var(--text-dim)]">{project.role}</span>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
            >
              <Globe className="w-4 h-4" />
              Visit
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
              <Sparkles className="w-3.5 h-3.5" style={{ color: project.accent }} />
              Case study on request
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Category>('All');

  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [active],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const title = section.querySelectorAll('.anim');
      gsap.set(title, { opacity: 0, y: 22 });
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(title, {
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

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.querySelectorAll('.card-dark');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out' },
    );
  }, [active]);

  const countFor = (c: Category) =>
    c === 'All' ? projects.length : projects.filter((p) => p.category === c).length;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative w-full bg-[#07070B] py-[14vh] px-[6vw] overflow-hidden"
    >
      <Floating3DScene variant="subtle" />

      <div className="relative max-w-[1280px] mx-auto">
        <div className="mb-10 max-w-3xl">
          <span className="anim eyebrow">Selected work</span>
          <h2 className="anim text-display text-[clamp(40px,6vw,88px)] text-[var(--text)] mt-4">
            Things I've <span className="gradient-text">shipped</span>.
          </h2>
          <p className="anim text-[var(--text-mut)] text-[clamp(15px,1.2vw,18px)] mt-5 max-w-2xl">
            A mix of production SaaS, native iOS apps, AI tooling, and automation built for real
            clients. Each one solved a specific problem end-to-end.
          </p>
        </div>

        <div className="anim flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => setActive(c.label)}
              className={`tab-btn ${active === c.label ? 'is-active' : ''}`}
            >
              {c.label}
              <span className="ml-2 opacity-70 font-mono text-xs">{countFor(c.label)}</span>
            </button>
          ))}
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filtered.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
