import { useEffect, useRef, useState } from 'react';
import { Zap, Package, Clock } from 'lucide-react';

const stats = [
  {
    icon: Zap,
    value: '~30',
    unit: 'FPS',
    description: 'Face mesh on laptop',
    color: '#00F0FF',
  },
  {
    icon: Package,
    value: '< 15',
    unit: 'MB',
    description: 'Total model payload',
    color: '#B829F7',
  },
  {
    icon: Clock,
    value: '< 20',
    unit: 'ms',
    description: 'Inference latency',
    color: '#C7FF1A',
  },
];

export function PerformanceSection() {
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
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen w-full py-20 px-6 md:px-12 relative overflow-hidden flex items-center"
    >
      {/* Background Grid */}
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,240,255,0.3)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <span className="eyebrow block mb-4">PERFORMANCE</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Built for <span className="text-gradient">speed.</span>
          </h2>
          <p className="text-[#A7B1C8] text-lg max-w-xl mx-auto">
            TensorFlow.js + WebGL backend. GPU-accelerated on most devices.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.unit}
              className={`glass-card p-8 text-center hover:translate-y-[-6px] transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              {/* Icon */}
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
              </div>
              
              {/* Value */}
              <div className="mb-2">
                <span className="text-5xl md:text-6xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="text-2xl font-medium text-[#A7B1C8] ml-1">{stat.unit}</span>
              </div>
              
              {/* Description */}
              <p className="text-sm text-[#A7B1C8]">{stat.description}</p>
              
              {/* Decorative line */}
              <div 
                className="w-12 h-0.5 mx-auto mt-6"
                style={{ backgroundColor: stat.color }}
              />
            </div>
          ))}
        </div>

        {/* Trust Bar */}
        <div className={`transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-center text-sm text-[#A7B1C8] mb-6">Powered by</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {['TensorFlow.js', 'WebGL', 'MediaPipe', 'ONNX', 'WebGPU'].map((tech) => (
              <div 
                key={tech}
                className="text-[#A7B1C8]/60 hover:text-[#A7B1C8] transition-colors text-sm font-mono"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
