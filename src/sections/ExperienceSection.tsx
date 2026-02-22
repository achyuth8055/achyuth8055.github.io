import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    company: 'Code Mania',
    role: 'Full Stack Developer',
    period: 'July 2022 – June 2023',
    location: 'Hyderabad, India',
    achievements: [
      'Developed and maintained responsive web applications using React.js, improving user engagement by 20%',
      'Built scalable backend services using Node.js and Express, implementing RESTful APIs and authentication mechanisms',
      'Designed and managed MongoDB and SQL database schemas, optimizing queries to reduce load time by 30%',
      'Implemented data validation and sanitization to enhance application security and prevent common vulnerabilities',
      'Deployed applications to cloud platforms (Heroku, DigitalOcean) and managed version control using Git in Agile development cycles'
    ]
  },
  {
    company: 'GenY Medium',
    role: 'Jr. Web Developer Intern',
    period: 'April 2022 – June 2022',
    location: 'Hyderabad, India',
    achievements: [
      'Developed responsive web interfaces using Bootstrap, improving usability and cross-device compatibility',
      'Assisted in building server-side functionalities using PHP and SQL, handling form processing and database operations',
      'Participated in code reviews to maintain code quality and adherence to best practices',
      'Collaborated with team members to troubleshoot production issues and implement timely solutions'
    ]
  }
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardRefs.current.filter((c): c is HTMLDivElement => c !== null);

    if (!section || !title || cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.set(title, { opacity: 0, y: 20 });
      ScrollTrigger.create({
        trigger: title,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          });
        },
        once: true
      });

      // Cards animation
      cards.forEach((card, i) => {
        gsap.set(card, { opacity: 0, y: 30 });
        
        ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: i * 0.15,
              ease: 'power2.out'
            });

            // Animate bullets after card appears
            const bullets = card.querySelectorAll('.achievement-item');
            gsap.fromTo(bullets,
              { opacity: 0, x: -8 },
              { 
                opacity: 1, 
                x: 0, 
                stagger: 0.04, 
                duration: 0.3, 
                delay: 0.2 + i * 0.15
              }
            );
          },
          once: true
        });
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="experience"
      className="relative w-full bg-[#0B0B10] z-50 py-[8vh] px-[6vw]"
    >
      {/* Title */}
      <h2 
        ref={titleRef}
        className="text-display text-[clamp(44px,6vw,96px)] text-[#F4F4F2] mb-16"
      >
        Experience
      </h2>

      {/* Experience cards */}
      <div className="space-y-8 max-w-5xl">
        {experiences.map((exp, idx) => (
          <div
            key={exp.company}
            ref={el => { cardRefs.current[idx] = el; }}
            className="relative"
          >
            {/* Card */}
            <div className="card-white p-8 card-white-hover gpu-accelerated">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="w-5 h-5 text-[#FF4D2E]" />
                    <h3 className="text-display text-[clamp(24px,2.5vw,36px)] text-[#0B0B10]">
                      {exp.company}
                    </h3>
                  </div>
                  <p className="text-[#0B0B10]/80 font-medium text-lg">
                    {exp.role}
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-sm text-[#6C6C70]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {exp.period}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {exp.location}
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <ul className="space-y-3">
                {exp.achievements.map((achievement, j) => (
                  <li 
                    key={j}
                    className="achievement-item flex items-start gap-3"
                  >
                    <span className="w-1.5 h-1.5 bg-[#FF4D2E] rounded-full mt-2 flex-shrink-0" />
                    <span className="text-[#6C6C70] text-[clamp(13px,1vw,15px)] leading-relaxed">
                      {achievement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
