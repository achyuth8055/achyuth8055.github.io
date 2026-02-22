import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    title: 'Languages',
    skills: ['Java', 'Python', 'SQL', 'JavaScript']
  },
  {
    title: 'Backend & Frameworks',
    skills: ['Spring Boot', 'Hibernate', 'REST APIs', 'Node.js', 'Express', 'PHP']
  },
  {
    title: 'Frontend',
    skills: ['React.js', 'HTML5', 'CSS3', 'Bootstrap', 'Redux']
  },
  {
    title: 'System Design',
    skills: ['Microservices', 'Domain-Driven Design', 'Event-Driven Systems', 'Design Patterns']
  },
  {
    title: 'Databases',
    skills: ['MySQL', 'MongoDB', 'DynamoDB', 'Redis', 'Kafka']
  },
  {
    title: 'Cloud & DevOps',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'Jenkins', 'GitHub Actions']
  },
  {
    title: 'Core CS',
    skills: ['Data Structures & Algorithms', 'OOP', 'DBMS', 'Operating Systems']
  },
  {
    title: 'Certifications',
    skills: ['AWS Certified Cloud Practitioner']
  }
];

export default function SkillsSection() {
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

      // Cards batch animation
      cards.forEach((card, i) => {
        gsap.set(card, { opacity: 0, y: 20 });
        
        ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              delay: (i % 4) * 0.05,
              ease: 'power2.out'
            });
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
      id="skills"
      className="relative w-full bg-[#0B0B10] z-55 py-[8vh] px-[6vw]"
    >
      {/* Title */}
      <h2 
        ref={titleRef}
        className="text-display text-[clamp(44px,6vw,96px)] text-[#F4F4F2] mb-4"
      >
        Skills
      </h2>
      <p className="text-[#A6A6AA] text-[clamp(14px,1.2vw,18px)] mb-12 max-w-xl">
        A comprehensive toolkit built over years of building production-grade applications.
      </p>

      {/* Skills grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl">
        {skillCategories.map((category, idx) => (
          <div
            key={category.title}
            ref={el => { cardRefs.current[idx] = el; }}
            className="card-white p-6 card-white-hover gpu-accelerated"
          >
            <h3 className="text-display text-[clamp(16px,1.3vw,20px)] text-[#0B0B10] mb-4">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span 
                  key={skill}
                  className="px-2.5 py-1 bg-[#0B0B10]/5 rounded-full text-xs text-[#0B0B10]/80
                             hover:bg-[#FF4D2E]/10 hover:text-[#FF4D2E] transition-colors duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
