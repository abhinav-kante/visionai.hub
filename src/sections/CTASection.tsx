import { useEffect, useRef, useState } from 'react';
import { Github, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
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
      className="min-h-screen w-full py-20 px-6 md:px-12 relative overflow-hidden flex flex-col justify-center"
      id="pricing"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#070A12]" />
      
      {/* Gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00F0FF]/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* CTA Block */}
        <div className={`transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Start building with
            <br />
            <span className="text-gradient">VisionAI Hub.</span>
          </h2>
          <p className="text-[#A7B1C8] text-lg mb-10 max-w-lg mx-auto">
            Free tier includes 10,000 inferences/month. No credit card required.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button 
              className="bg-[#00F0FF] text-[#070A12] hover:bg-[#00F0FF]/90 font-medium px-8 py-3 rounded-full text-base h-auto"
            >
              Get started
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline"
              className="border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)] font-medium px-8 py-3 rounded-full text-base h-auto"
            >
              <FileText className="w-4 h-4 mr-2" />
              Read the docs
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className={`border-t border-[rgba(255,255,255,0.1)] pt-10 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left - Contact */}
            <div className="flex items-center gap-6">
              <a 
                href="mailto:hello@visionai.example.com" 
                className="text-sm text-[#A7B1C8] hover:text-white transition-colors"
              >
                hello@visionai.example.com
              </a>
            </div>
            
            {/* Right - Links */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-[#A7B1C8] hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-[#A7B1C8] hover:text-white transition-colors">
                Terms
              </a>
              <a 
                href="#" 
                className="text-sm text-[#A7B1C8] hover:text-white transition-colors flex items-center gap-1"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a 
                href="#" 
                className="text-sm text-[#A7B1C8] hover:text-white transition-colors flex items-center gap-1"
              >
                <FileText className="w-4 h-4" />
                Docs
              </a>
            </div>
          </div>
          
          {/* Copyright */}
          <p className="text-xs text-[#A7B1C8]/60 mt-8">
            © 2026 VisionAI Hub. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
