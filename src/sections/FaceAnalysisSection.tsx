import { useEffect, useRef, useState, useMemo } from 'react';

interface Metric {
  label: string;
  value: string;
}

const metrics: Metric[] = [
  { label: 'Face detected', value: 'Yes' },
  { label: 'Landmarks', value: '468' },
  { label: 'Iris tracking', value: 'On' },
  { label: 'Emotion', value: 'Neutral → Happy' },
  { label: 'Latency', value: '12 ms' },
];

// Generate mock face mesh points
const generateMeshPoints = () => {
  const points: { x: number; y: number; id: number }[] = [];
  const centerX = 72;
  const centerY = 45;
  
  // Face outline
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2;
    const radius = 18 + Math.sin(angle * 3) * 2;
    points.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius * 1.3,
      id: i,
    });
  }
  
  // Eyes
  const leftEyeX = centerX - 8;
  const rightEyeX = centerX + 8;
  const eyeY = centerY - 4;
  
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    points.push({ x: leftEyeX + Math.cos(angle) * 4, y: eyeY + Math.sin(angle) * 2.5, id: 60 + i });
    points.push({ x: rightEyeX + Math.cos(angle) * 4, y: eyeY + Math.sin(angle) * 2.5, id: 76 + i });
  }
  
  // Nose
  for (let i = 0; i < 20; i++) {
    const t = i / 20;
    points.push({
      x: centerX + (Math.random() - 0.5) * 4,
      y: centerY + 2 + t * 10,
      id: 92 + i,
    });
  }
  
  // Mouth
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    points.push({
      x: centerX + Math.cos(angle) * 7,
      y: centerY + 12 + Math.sin(angle) * 3,
      id: 112 + i,
    });
  }
  
  // Eyebrows
  for (let i = 0; i < 20; i++) {
    const t = i / 20;
    points.push({ x: leftEyeX - 5 + t * 10, y: eyeY - 6 + Math.sin(t * Math.PI) * 2, id: 132 + i });
    points.push({ x: rightEyeX - 5 + t * 10, y: eyeY - 6 + Math.sin(t * Math.PI) * 2, id: 152 + i });
  }
  
  // Fill remaining to 468
  for (let i = points.length; i < 468; i++) {
    points.push({
      x: centerX + (Math.random() - 0.5) * 30,
      y: centerY + (Math.random() - 0.5) * 40,
      id: i,
    });
  }
  
  return points;
};

export function FaceAnalysisSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [pointsVisible, setPointsVisible] = useState(false);
  
  const meshPoints = useMemo(() => generateMeshPoints(), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setPointsVisible(true), 400);
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
      className="min-h-screen w-full py-20 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#070A12]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Panel - Metrics */}
          <div className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}>
            <span className="eyebrow block mb-4">FACE ANALYSIS</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Face Analysis
            </h2>
            <p className="text-[#A7B1C8] text-lg mb-8">
              Landmarks, iris, and emotion—at 30+ FPS.
            </p>
            
            {/* Metrics List */}
            <div className="space-y-3">
              {metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="glass-panel p-4 flex items-center justify-between"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `all 0.5s ease ${200 + index * 80}ms`,
                  }}
                >
                  <span className="text-sm text-[#A7B1C8]">{metric.label}</span>
                  <span className="text-sm font-mono font-medium">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Face with Mesh */}
          <div className={`relative transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`}>
            <div className="relative rounded-[22px] overflow-hidden aspect-[4/3]">
              {/* Face Image */}
              <img 
                src="/face_portrait_closeup.jpg" 
                alt="Face Portrait"
                className="w-full h-full object-cover"
              />
              
              {/* Mesh Overlay */}
              <div className="absolute inset-0">
                {/* Triangle Mesh (simplified) */}
                <svg className="absolute inset-0 w-full h-full opacity-30">
                  <defs>
                    <pattern id="mesh-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path 
                        d="M0,10 L10,0 L20,10 L10,20 Z" 
                        fill="none" 
                        stroke="rgba(0,240,255,0.15)" 
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mesh-pattern)" />
                </svg>
                
                {/* Key Points */}
                {meshPoints.slice(0, 80).map((point, index) => (
                  <div
                    key={point.id}
                    className="absolute w-1 h-1 rounded-full bg-[#00F0FF]"
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      transform: 'translate(-50%, -50%)',
                      opacity: pointsVisible ? 0.8 : 0,
                      boxShadow: '0 0 4px rgba(0,240,255,0.6)',
                      transition: `opacity 0.3s ease ${index * 5}ms`,
                    }}
                  />
                ))}
                
                {/* Face Bounding Box */}
                <div 
                  className="absolute border-2 border-[#00F0FF] rounded-lg"
                  style={{
                    left: '45%',
                    top: '15%',
                    width: '35%',
                    height: '70%',
                    opacity: pointsVisible ? 1 : 0,
                    boxShadow: '0 0 20px rgba(0,240,255,0.2), inset 0 0 20px rgba(0,240,255,0.1)',
                    transition: 'opacity 0.5s ease 0.3s',
                  }}
                >
                  {/* Corner brackets */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#00F0FF]" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#00F0FF]" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#00F0FF]" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#00F0FF]" />
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <div 
              className="absolute top-4 right-4 glass-panel px-3 py-1.5 flex items-center gap-2"
              style={{
                opacity: pointsVisible ? 1 : 0,
                transform: pointsVisible ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'all 0.5s ease 0.5s',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
              <span className="text-xs font-mono">Tracking Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
