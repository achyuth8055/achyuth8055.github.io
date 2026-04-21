const items = [
  'Full-Stack Development',
  'iOS · Swift · SwiftUI',
  'AI-Powered Tools',
  'Automation & Scraping',
  'Apache Maven',
  'Checkstyle',
  'React · Next.js',
  'Spring Boot',
  'Node.js · Express',
  'AWS · Docker',
  'Data Pipelines',
  'UX-first Redesigns',
];

export default function MarqueeSection() {
  return (
    <section
      id="marquee"
      className="relative w-full bg-[#07070B] border-y border-[var(--border-soft)] py-8 overflow-hidden"
      aria-label="What I do"
    >
      <div className="marquee-track gap-12 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-12 text-[clamp(18px,2.4vw,32px)]">
            <span className="text-display text-[var(--text)]/80">{item}</span>
            <span className="text-[var(--accent)] text-2xl">✦</span>
          </div>
        ))}
      </div>
    </section>
  );
}
