import { useEffect, useRef, useState } from 'react';

interface UseCase {
  title: string;
  description: string;
  image: string;
}

const useCases: UseCase[] = [
  {
    title: 'Retail Analytics',
    description: 'Count visitors. Track dwell. Measure conversion.',
    image: '/retail_analytics_scene.jpg',
  },
  {
    title: 'Remote Health',
    description: 'Posture checks. Hand tracking. Patient-guided exercises.',
    image: '/remote_health_scene.jpg',
  },
  {
    title: 'Content Moderation',
    description: 'Detect sensitive imagery before it spreads.',
    image: '/content_moderation_scene.jpg',
  },
];

export function UseCasesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen w-full py-20 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#070A12]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <span className="eyebrow block mb-4">USE CASES</span>
          <h2 className="text-4xl md:text-5xl font-bold">
            Three <span className="text-gradient">lenses.</span>
          </h2>
        </div>

        {/* Accordion Bands */}
        <div className="space-y-4">
          {useCases.map((useCase, index) => (
            <div
              key={useCase.title}
              className={`relative overflow-hidden rounded-[22px] cursor-pointer group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${200 + index * 150}ms`,
                height: activeIndex === index ? '300px' : '120px',
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={useCase.image} 
                  alt={useCase.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    activeIndex === index ? 'scale-105' : 'scale-100'
                  }`}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#070A12]/90 via-[#070A12]/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center p-8">
                <div className="max-w-lg">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{useCase.title}</h3>
                  <p 
                    className={`text-[#A7B1C8] transition-all duration-500 ${
                      activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {useCase.description}
                  </p>
                </div>
                
                {/* Arrow indicator */}
                <div 
                  className={`absolute right-8 w-10 h-10 rounded-full border border-[rgba(255,255,255,0.2)] flex items-center justify-center transition-all duration-300 ${
                    activeIndex === index ? 'bg-[#00F0FF] border-[#00F0FF]' : ''
                  }`}
                >
                  <svg 
                    className={`w-5 h-5 transition-transform duration-300 ${
                      activeIndex === index ? 'rotate-90' : ''
                    }`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Divider line (except last) */}
              {index < useCases.length - 1 && (
                <div className="absolute bottom-0 left-8 right-8 h-px bg-[rgba(255,255,255,0.1)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
