import { useEffect, useRef, useState } from 'react';

// Hand skeleton connections (MediaPipe format)
const handConnections = [
  // Wrist to finger bases
  [0, 1], [0, 5], [0, 9], [0, 13], [0, 17],
  // Thumb
  [1, 2], [2, 3], [3, 4],
  // Index finger
  [5, 6], [6, 7], [7, 8],
  // Middle finger
  [9, 10], [10, 11], [11, 12],
  // Ring finger
  [13, 14], [14, 15], [15, 16],
  // Pinky
  [17, 18], [18, 19], [19, 20],
];

// Mock hand keypoints (normalized 0-100)
const mockKeypoints = [
  { x: 50, y: 75 }, // wrist (0)
  { x: 45, y: 68 }, { x: 40, y: 60 }, { x: 35, y: 52 }, { x: 30, y: 45 }, // thumb (1-4)
  { x: 48, y: 58 }, { x: 46, y: 48 }, { x: 44, y: 38 }, { x: 42, y: 28 }, // index (5-8)
  { x: 52, y: 56 }, { x: 52, y: 44 }, { x: 52, y: 32 }, { x: 52, y: 22 }, // middle (9-12)
  { x: 56, y: 58 }, { x: 58, y: 48 }, { x: 60, y: 38 }, { x: 62, y: 28 }, // ring (13-16)
  { x: 60, y: 62 }, { x: 64, y: 55 }, { x: 68, y: 48 }, { x: 72, y: 42 }, // pinky (17-20)
];

export function HandPoseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [skeletonVisible, setSkeletonVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setSkeletonVisible(true), 300);
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
    >
      {/* Background Image */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-70 scale-110'
      }`}>
        <img 
          src="/hand_reach_scene.jpg" 
          alt="Hand Pose"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A12]/80 via-[#070A12]/30 to-[#070A12]/50" />
      </div>

      {/* Skeleton Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full">
          {/* Connection Lines */}
          {handConnections.map(([start, end], index) => {
            const startPoint = mockKeypoints[start];
            const endPoint = mockKeypoints[end];
            return (
              <line
                key={`${start}-${end}`}
                x1={`${startPoint.x}%`}
                y1={`${startPoint.y}%`}
                x2={`${endPoint.x}%`}
                y2={`${endPoint.y}%`}
                stroke="#00F0FF"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  opacity: skeletonVisible ? 0.8 : 0,
                  strokeDasharray: 100,
                  strokeDashoffset: skeletonVisible ? 0 : 100,
                  transition: `all 0.5s ease ${index * 30}ms`,
                }}
              />
            );
          })}
        </svg>
        
        {/* Joint Points */}
        {mockKeypoints.map((point, index) => (
          <div
            key={index}
            className="absolute w-2.5 h-2.5 rounded-full bg-[#00F0FF] -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              opacity: skeletonVisible ? 1 : 0,
              transform: skeletonVisible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0)',
              boxShadow: '0 0 10px rgba(0,240,255,0.8)',
              transition: `all 0.3s ease ${300 + index * 40}ms`,
            }}
          >
            {/* Inner dot */}
            <div className="absolute inset-1 rounded-full bg-white" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12 z-10">
        {/* Top Status Pill */}
        <div className={`flex justify-end transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className="glass-panel px-4 py-2 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
            <span className="text-sm font-mono">Hand Pose • 21 keypoints</span>
          </div>
        </div>

        {/* Bottom Content */}
        <div className={`transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="glass-card inline-flex items-center gap-4 px-6 py-4 mb-4">
            <div>
              <span className="text-xs text-[#A7B1C8] block mb-1">Gesture</span>
              <span className="text-xl font-semibold">Open palm</span>
            </div>
            <div className="w-px h-10 bg-[rgba(255,255,255,0.1)]" />
            <div>
              <span className="text-xs text-[#A7B1C8] block mb-1">Confidence</span>
              <span className="text-xl font-mono text-[#00F0FF]">0.96</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold">Track every gesture.</h2>
        </div>
      </div>
    </section>
  );
}
