import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'ImageAndPDF',
    description: 'A full-stack web application for image and PDF processing. Contributed to development and successfully deployed on Render. Features include file conversion, compression, and format manipulation.',
    image: '/project_chat.jpg',
    tags: ['React', 'Node.js', 'Express', 'Render'],
    liveUrl: 'https://imageandpdf.com/',
    githubUrl: null
  },
  {
    title: 'API Rate Limiting Gateway',
    description: 'Built lightweight API gateway implementing token bucket rate limiting per user and per endpoint to prevent abuse under concurrent traffic. Integrated Redis for distributed state management with thread-safe operations.',
    image: '/project_marketplace.jpg',
    tags: ['Java', 'Spring Boot', 'Redis', 'JWT'],
    liveUrl: null,
    githubUrl: 'https://github.com'
  },
  {
    title: 'InterviewHub – Coding Practice Backend',
    description: 'Designed scalable RESTful backend with role-based access control. Implemented Redis caching for leaderboard computation, decreasing database reads by 60%. Optimized queries reducing response time from 220ms to 130ms.',
    image: '/project_cms.jpg',
    tags: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    liveUrl: null,
    githubUrl: 'https://github.com'
  },
  {
    title: 'CloudCostX – Cloud Cost Analyzer',
    description: 'Developed backend system to simulate cloud resource usage and compute monthly cost projections. Implemented cost optimization recommendation engine based on usage thresholds and anomaly detection rules.',
    image: '/about_workspace.jpg',
    tags: ['Java', 'Spring Boot', 'MySQL', 'AWS'],
    liveUrl: null,
    githubUrl: 'https://github.com'
  }
];

export default function ProjectsSection() {
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
              delay: i * 0.1,
              ease: 'power2.out'
            });

            // Animate tags after card appears
            const tags = card.querySelectorAll('.tag-item');
            gsap.fromTo(tags,
              { opacity: 0, y: 8 },
              { 
                opacity: 1, 
                y: 0, 
                stagger: 0.03, 
                duration: 0.3, 
                delay: 0.2 + i * 0.1
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
      id="projects"
      className="relative w-full bg-[#0B0B10] z-60 py-[8vh] px-[6vw]"
    >
      {/* Title */}
      <h2 
        ref={titleRef}
        className="text-display text-[clamp(44px,6vw,96px)] text-[#F4F4F2] mb-16"
      >
        Selected Work
      </h2>

      {/* Project cards */}
      <div className="space-y-12 max-w-6xl">
        {projects.map((project, idx) => (
          <div
            key={project.title}
            ref={el => { cardRefs.current[idx] = el; }}
            className="card-white overflow-hidden group card-white-hover gpu-accelerated"
          >
            <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
              {/* Image */}
              <div className="lg:w-[45%] h-[250px] lg:h-[320px] overflow-hidden relative">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover img-optimized 
                             group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Live badge */}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 left-4 px-3 py-1 bg-[#FF4D2E] text-white text-xs font-medium rounded-full
                               flex items-center gap-1.5 hover:bg-[#e64428] transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    Live
                  </a>
                )}
              </div>

              {/* Content */}
              <div className="lg:w-[55%] p-8 lg:p-10 flex flex-col justify-center">
                <h3 className="text-display text-[clamp(22px,2.2vw,32px)] text-[#0B0B10] mb-4
                               group-hover:text-[#FF4D2E] transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-[#6C6C70] text-[clamp(14px,1vw,16px)] leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="tag-item px-3 py-1.5 bg-[#0B0B10]/5 rounded-full 
                                 text-micro text-[#0B0B10]/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action links */}
                <div className="flex items-center gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#0B0B10] font-medium
                                 hover:text-[#FF4D2E] transition-colors duration-300"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">Visit Project</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#0B0B10] font-medium
                                 hover:text-[#FF4D2E] transition-colors duration-300"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm">View Code</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
