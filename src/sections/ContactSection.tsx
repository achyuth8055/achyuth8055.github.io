import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Download,
  Send,
  ArrowUpRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CONTACT_EMAIL = 'ask.achyuthkumar@gmail.com';

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const items = section.querySelectorAll('.anim');
      gsap.set(items, { opacity: 0, y: 22 });
      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = form;
    const body = `Hi Achyuth,%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0A— ${encodeURIComponent(
      name,
    )} (${encodeURIComponent(email)})`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject || 'Portfolio inquiry',
    )}&body=${body}`;
    window.location.href = mailto;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#07070B] py-[14vh] px-[6vw] overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-12 max-w-3xl">
          <span className="anim eyebrow">Get in touch</span>
          <h2 className="anim text-display text-[clamp(48px,8vw,128px)] text-[var(--text)] mt-4 leading-none">
            Let's <span className="gradient-text">build</span>.
          </h2>
          <p className="anim text-[var(--text-mut)] text-[clamp(15px,1.3vw,19px)] leading-relaxed mt-5 max-w-xl">
            Have a project, a role, or an idea? I'm open to freelance, full-time, and
            open-source collabs — usually reply within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Contact info */}
          <div className="anim lg:col-span-2 card-dark p-7 flex flex-col gap-6 gpu">
            <div>
              <span className="eyebrow mb-4">Reach me</span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-4 flex items-center gap-3 text-[var(--text)] hover:text-[var(--accent)] transition-colors group"
              >
                <Mail className="w-4 h-4" />
                <span className="font-mono text-sm break-all">{CONTACT_EMAIL}</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <div className="mt-3 flex items-center gap-3 text-[var(--text)]/90">
                <Phone className="w-4 h-4" />
                <span className="font-mono text-sm">+1 (219) 280-1805</span>
              </div>
              <div className="mt-3 flex items-center gap-3 text-[var(--text)]/90">
                <MapPin className="w-4 h-4" />
                <span className="font-mono text-sm">Illinois, USA</span>
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--border-soft)]">
              <span className="eyebrow mb-3 block">Elsewhere</span>
              <div className="flex gap-2 mt-3">
                <a
                  href="https://www.linkedin.com/in/achyuth07/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[var(--border-mid)] flex items-center justify-center text-[var(--text)] hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/achyuth8055"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[var(--border-mid)] flex items-center justify-center text-[var(--text)] hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            <a
              href="/Achyuth_SWE_Resume.pdf"
              download="Achyuth_Kummari_Resume.pdf"
              className="btn-accent justify-center mt-auto"
            >
              <Download className="w-4 h-4" />
              Download resume
            </a>
          </div>

          {/* Form */}
          <div className="anim lg:col-span-3 card-dark p-7 gpu">
            <h3 className="text-display text-[clamp(20px,1.8vw,26px)] text-[var(--text)]">
              Send a message
            </h3>
            <p className="text-sm text-[var(--text-mut)] mt-1 mb-5">
              Fill this out and your email client will open with the details pre-filled.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-micro text-[var(--text-mut)]">Name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-[#0A0A12] border border-[var(--border-soft)] rounded-full px-4 py-2.5 text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)]/60 transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-micro text-[var(--text-mut)]">Email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@domain.com"
                    className="bg-[#0A0A12] border border-[var(--border-soft)] rounded-full px-4 py-2.5 text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)]/60 transition-colors"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-micro text-[var(--text-mut)]">Subject</span>
                <input
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Project / role / idea"
                  className="bg-[#0A0A12] border border-[var(--border-soft)] rounded-full px-4 py-2.5 text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)]/60 transition-colors"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-micro text-[var(--text-mut)]">Message</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me what you're working on..."
                  className="bg-[#0A0A12] border border-[var(--border-soft)] rounded-2xl px-4 py-3 text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)]/60 transition-colors resize-none"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3 mt-1">
                <button type="submit" className="btn-accent">
                  <Send className="w-4 h-4" />
                  Send message
                </button>
                {sent && (
                  <span className="text-micro text-[var(--accent)]">
                    Opening your email client…
                  </span>
                )}
                <span className="ml-auto text-micro text-[var(--text-mut)]">
                  Response within 24h
                </span>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[var(--border-soft)] flex flex-wrap items-center justify-between gap-3">
          <span className="text-micro text-[var(--text-mut)]">© 2026 Achyuth Kummari</span>
        </div>
      </div>
    </section>
  );
}
