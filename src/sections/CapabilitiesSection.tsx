import { useEffect, useRef, useState } from 'react';
import { Camera, ScanFace, Hand, MessageSquare, Database, Workflow } from 'lucide-react';

const capabilities = [
  {
    icon: Camera,
    title: 'Object Detection',
    description: 'COCO-SSD / 90 classes',
    color: '#00F0FF',
  },
  {
    icon: ScanFace,
    title: 'Face Mesh',
    description: '468 landmarks + iris',
    color: '#B829F7',
  },
  {
    icon: Hand,
    title: 'Hand Pose',
    description: '21 keypoints + gestures',
    color: '#FF2BD6',
  },
  {
    icon: MessageSquare,
    title: 'Sentiment',
    description: 'Text + speech polarity',
    color: '#C7FF1A',
  },
  {
    icon: Database,
    title: 'Embeddings',
    description: 'Vector search ready',
    color: '#FFB800',
  },
  {
    icon: Workflow,
    title: 'Pipelines',
    description: 'Compose multi-step flows',
    color: '#00F0FF',
  },
];

export function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
      id="models"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-[#0B0F1C] via-[#070A12] to-[#070A12] opacity-50" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column - Title */}
          <div className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}>
            <span className="eyebrow block mb-4">CAPABILITIES</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              One stack.
              <br />
              <span className="text-gradient">Four models.</span>
            </h2>
            <p className="text-[#A7B1C8] text-lg leading-relaxed max-w-md">
              Load only what you need. Each model runs on-device with WebGL acceleration.
            </p>
          </div>

          {/* Right Column - Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {capabilities.map((cap, index) => (
              <div
                key={cap.title}
                className={`glass-card p-6 hover:translate-y-[-6px] transition-all duration-300 cursor-pointer group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: isVisible ? `${150 + index * 80}ms` : '0ms',
                }}
              >
                {/* Status Dot */}
                <div 
                  className="absolute top-4 right-4 w-2 h-2 rounded-full"
                  style={{ backgroundColor: cap.color, boxShadow: `0 0 8px ${cap.color}` }}
                />
                
                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${cap.color}15` }}
                >
                  <cap.icon className="w-6 h-6" style={{ color: cap.color }} />
                </div>
                
                {/* Content */}
                <h3 className="font-semibold text-lg mb-1">{cap.title}</h3>
                <p className="text-sm text-[#A7B1C8]">{cap.description}</p>
                
                {/* Accent Line */}
                <div 
                  className="w-10 h-0.5 mt-4 transition-all duration-300 group-hover:w-16"
                  style={{ backgroundColor: cap.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
