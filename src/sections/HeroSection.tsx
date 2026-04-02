import { useEffect, useRef, useState } from 'react';
import { Camera, ScanFace, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="section-pinned relative w-full h-screen overflow-hidden"
      id="hero"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/hero_camera_feed.jpg" 
          alt="AI Vision Background"
          className={`w-full h-full object-cover transition-all duration-1000 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070A12]/60 via-[#070A12]/30 to-[#070A12]/80" />
      </div>

      {/* Navigation */}
      <nav className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6 transition-all duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F0FF] to-[#B829F7] flex items-center justify-center">
            <Camera className="w-4 h-4 text-[#070A12]" />
          </div>
          <span className="font-semibold text-lg tracking-tight">VisionAI Hub</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#models" className="text-sm text-[#A7B1C8] hover:text-white transition-colors">Models</a>
          <a href="#demos" className="text-sm text-[#A7B1C8] hover:text-white transition-colors">Demos</a>
          <a href="#docs" className="text-sm text-[#A7B1C8] hover:text-white transition-colors">Docs</a>
          <a href="#pricing" className="text-sm text-[#A7B1C8] hover:text-white transition-colors">Pricing</a>
        </div>
        
        <Button 
          className="bg-[#00F0FF] text-[#070A12] hover:bg-[#00F0FF]/90 font-medium px-5 py-2 rounded-full text-sm"
        >
          Start free
        </Button>
      </nav>

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
        <div className={`text-center transition-all duration-700 delay-200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[0.95]">
            Real-time AI
            <br />
            <span className="text-gradient">vision.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#A7B1C8] max-w-xl mx-auto leading-relaxed">
            Run object detection, face mesh, hand pose, and sentiment—directly in the browser.
          </p>
        </div>
      </div>

      {/* HUD Cards */}
      <div className={`absolute bottom-8 left-0 right-0 z-10 px-6 md:px-12 transition-all duration-700 delay-400 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          {/* Object Detection Card */}
          <div className="glass-card flex-1 p-5 hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center">
                <Camera className="w-5 h-5 text-[#00F0FF]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Object Detection</h3>
                <div className="w-8 h-0.5 bg-[#00F0FF] mt-1" />
              </div>
            </div>
            <p className="text-xs text-[#A7B1C8]">90 COCO classes</p>
          </div>

          {/* Face Mesh Card */}
          <div className="glass-card flex-1 p-5 hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#B829F7]/10 flex items-center justify-center">
                <ScanFace className="w-5 h-5 text-[#B829F7]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Face Mesh</h3>
                <div className="w-8 h-0.5 bg-[#B829F7] mt-1" />
              </div>
            </div>
            <p className="text-xs text-[#A7B1C8]">468 landmarks</p>
          </div>

          {/* Hand Pose Card */}
          <div className="glass-card flex-1 p-5 hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF2BD6]/10 flex items-center justify-center">
                <Hand className="w-5 h-5 text-[#FF2BD6]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Hand Pose</h3>
                <div className="w-8 h-0.5 bg-[#FF2BD6] mt-1" />
              </div>
            </div>
            <p className="text-xs text-[#A7B1C8]">21 keypoints</p>
          </div>
        </div>
      </div>
    </section>
  );
}
