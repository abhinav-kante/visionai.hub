import { useEffect, useRef, useState } from 'react';

interface DetectionItem {
  label: string;
  confidence: number;
  color: string;
  bbox: { x: number; y: number; width: number; height: number };
}

const mockDetections: DetectionItem[] = [
  { label: 'person', confidence: 0.97, color: '#00F0FF', bbox: { x: 35, y: 45, width: 12, height: 35 } },
  { label: 'car', confidence: 0.94, color: '#B829F7', bbox: { x: 55, y: 55, width: 20, height: 15 } },
  { label: 'traffic light', confidence: 0.91, color: '#FFB800', bbox: { x: 72, y: 25, width: 4, height: 12 } },
  { label: 'sign', confidence: 0.88, color: '#FF2BD6', bbox: { x: 15, y: 30, width: 8, height: 10 } },
];

export function ObjectDetectionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [boxesDrawn, setBoxesDrawn] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setBoxesDrawn(true), 300);
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
      className="section-pinned relative w-full h-screen overflow-hidden"
      id="demos"
    >
      {/* Background Image */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-60 scale-110'
      }`}>
        <img 
          src="/objdet_urban_scene.jpg" 
          alt="Urban Scene"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070A12]/70 via-transparent to-[#070A12]/50" />
      </div>

      {/* Bounding Boxes Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {mockDetections.map((det, index) => (
          <div
            key={det.label}
            className="absolute transition-all duration-700"
            style={{
              left: `${det.bbox.x}%`,
              top: `${det.bbox.y}%`,
              width: `${det.bbox.width}%`,
              height: `${det.bbox.height}%`,
              opacity: boxesDrawn ? 1 : 0,
              transform: boxesDrawn ? 'scale(1)' : 'scale(0.9)',
              transitionDelay: `${index * 150}ms`,
            }}
          >
            {/* Bounding Box */}
            <div 
              className="absolute inset-0 border-2"
              style={{ 
                borderColor: det.color,
                boxShadow: `0 0 15px ${det.color}40, inset 0 0 15px ${det.color}20`,
              }}
            >
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: det.color }} />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: det.color }} />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: det.color }} />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: det.color }} />
            </div>
            
            {/* Label */}
            <div 
              className="absolute -top-7 left-0 px-2 py-0.5 text-xs font-mono font-medium rounded"
              style={{ 
                backgroundColor: det.color,
                color: '#070A12',
              }}
            >
              {det.label} {(det.confidence * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12 z-10">
        {/* Top Label */}
        <div className={`transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <span className="eyebrow">OBJECT DETECTION</span>
        </div>

        {/* Bottom Content */}
        <div className={`transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">See the scene.</h2>
          
          {/* Inference Bar */}
          <div className="glass-card p-4 max-w-2xl">
            <div className="flex flex-wrap gap-4">
              {mockDetections.map((det, index) => (
                <div 
                  key={det.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#070A12]/50"
                  style={{
                    opacity: boxesDrawn ? 1 : 0,
                    transform: boxesDrawn ? 'translateY(0)' : 'translateY(10px)',
                    transition: `all 0.5s ease ${400 + index * 100}ms`,
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: det.color, boxShadow: `0 0 6px ${det.color}` }}
                  />
                  <span className="text-sm font-mono capitalize">{det.label}</span>
                  <span className="text-sm font-mono text-[#A7B1C8]">{det.confidence.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
