import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, Download } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: 'Work', href: '#work-mosaic' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' }
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show navigation after scrolling past hero
    ScrollTrigger.create({
      trigger: '#work-mosaic',
      start: 'top 80%',
      onEnter: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false)
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === '#work-mosaic') st.kill();
      });
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Fixed header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] px-6 py-4 
                    transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="text-display text-xl text-[#F4F4F2] hover:text-[#FF4D2E] transition-colors"
          >
            AK
          </a>

          {/* Menu button */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full
                       bg-[#F4F4F2]/10 backdrop-blur-sm border border-[#F4F4F2]/20
                       text-[#F4F4F2] text-sm font-medium
                       hover:bg-[#F4F4F2]/20 transition-all duration-300"
          >
            <Menu className="w-4 h-4" />
            Menu
          </button>
        </div>
      </header>

      {/* Full-screen menu overlay */}
      <div 
        className={`fixed inset-0 z-[200] bg-[#0B0B10] transition-all duration-500
                    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div className="h-full flex flex-col px-8 py-6">
          {/* Menu header */}
          <div className="flex items-center justify-between mb-12">
            <span className="text-display text-xl text-[#F4F4F2]">AK</span>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-full
                         bg-[#F4F4F2]/10 text-[#F4F4F2] text-sm font-medium
                         hover:bg-[#F4F4F2]/20 transition-all duration-300"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 flex flex-col justify-center">
            <ul className="space-y-4">
              {navItems.map((item, i) => (
                <li 
                  key={item.label}
                  className={`transform transition-all duration-500 delay-${i * 50}
                              ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-display text-[clamp(32px,6vw,64px)] text-[#F4F4F2]
                               hover:text-[#FF4D2E] transition-colors duration-300
                               flex items-center gap-4 group"
                  >
                    <span className="text-micro text-[#A6A6AA] opacity-0 group-hover:opacity-100 transition-opacity">
                      0{i + 1}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Menu footer */}
          <div className="flex items-center justify-between pt-8 border-t border-[#2A2A35]">
            <div className="flex flex-col gap-1">
              <span className="text-micro text-[#A6A6AA]">Get in touch</span>
              <a 
                href="mailto:ask.achyuthkumar@gmail.com"
                className="text-[#F4F4F2] hover:text-[#FF4D2E] transition-colors"
              >
                ask.achyuthkumar@gmail.com
              </a>
            </div>
            <a
              href="/Achyuth_SWE_Resume.pdf"
              download="Achyuth_Kummari_Resume.pdf"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF4D2E] 
                         text-white font-medium hover:scale-105 transition-transform duration-300"
              title="Download Resume"
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
