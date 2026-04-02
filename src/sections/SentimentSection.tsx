import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeechRecognition } from '@/hooks';

export function SentimentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [gaugeValue, setGaugeValue] = useState(0);
  
  const { 
    isSupported, 
    isListening, 
    transcript, 
    interimTranscript, 
    sentiment, 
    history,
    startListening, 
    stopListening,
    reset 
  } = useSpeechRecognition();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate gauge
          setTimeout(() => setGaugeValue(78), 500);
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

  // Update gauge when sentiment changes
  useEffect(() => {
    if (sentiment) {
      setGaugeValue(sentiment.breakdown.positive);
    }
  }, [sentiment]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Calculate gauge stroke
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (gaugeValue / 100) * circumference;

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen w-full py-20 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#070A12]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Panel - Transcript */}
          <div className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}>
            <span className="eyebrow block mb-4">SENTIMENT ANALYSIS</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Understand the tone.
            </h2>
            <p className="text-[#A7B1C8] text-lg mb-8">
              Transcribe speech and score tone in real time.
            </p>
            
            {/* Control Button */}
            <div className="mb-6">
              {!isSupported ? (
                <div className="glass-panel p-4 text-amber-400 text-sm">
                  Speech recognition is not supported in this browser.
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={toggleListening}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                      isListening 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                        : 'bg-[#00F0FF] text-[#070A12] hover:bg-[#00F0FF]/90'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isListening ? 'Stop Listening' : 'Start Listening'}
                  </Button>
                  {transcript && (
                    <Button
                      onClick={reset}
                      variant="outline"
                      className="border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {/* Transcript Display */}
            <div className="glass-card p-5 min-h-[200px]">
              <span className="text-xs text-[#A7B1C8] block mb-3">TRANSCRIPT</span>
              
              {/* History */}
              <div className="space-y-2 mb-3">
                {history.map((line, index) => (
                  <p key={index} className="text-sm text-[#A7B1C8] border-l-2 border-[#00F0FF]/30 pl-3">
                    {line}
                  </p>
                ))}
              </div>
              
              {/* Current transcript */}
              {transcript && !interimTranscript && (
                <p className="text-sm border-l-2 border-[#00F0FF] pl-3">{transcript}</p>
              )}
              
              {/* Interim */}
              {interimTranscript && (
                <p className="text-sm text-[#A7B1C8] italic border-l-2 border-[#00F0FF]/50 pl-3">
                  {interimTranscript}
                </p>
              )}
              
              {!transcript && !interimTranscript && (
                <p className="text-sm text-[#A7B1C8] italic">
                  {isListening ? 'Listening...' : 'Click "Start Listening" to begin'}
                </p>
              )}
            </div>
          </div>

          {/* Right Panel - Sentiment Gauge */}
          <div className={`transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`}>
            <div className="glass-card p-8">
              {/* Gauge */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={sentiment.label === 'positive' ? '#00F0FF' : sentiment.label === 'negative' ? '#FF2BD6' : '#FFB800'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                  </svg>
                  
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${
                      sentiment.label === 'positive' ? 'text-[#00F0FF]' : 
                      sentiment.label === 'negative' ? 'text-[#FF2BD6]' : 'text-[#FFB800]'
                    }`}>
                      {sentiment.label.charAt(0).toUpperCase() + sentiment.label.slice(1)}
                    </span>
                    <span className="text-sm text-[#A7B1C8] mt-1">
                      {sentiment.score > 0 ? `+${sentiment.score.toFixed(2)}` : sentiment.score.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Distribution Bars */}
              <div className="space-y-4">
                <span className="text-xs text-[#A7B1C8] block">DISTRIBUTION</span>
                
                {/* Positive */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Positive</span>
                    <span className="font-mono">{sentiment.breakdown.positive}%</span>
                  </div>
                  <div className="h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00F0FF] rounded-full transition-all duration-500"
                      style={{ width: `${sentiment.breakdown.positive}%` }}
                    />
                  </div>
                </div>
                
                {/* Neutral */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Neutral</span>
                    <span className="font-mono">{sentiment.breakdown.neutral}%</span>
                  </div>
                  <div className="h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FFB800] rounded-full transition-all duration-500"
                      style={{ width: `${sentiment.breakdown.neutral}%` }}
                    />
                  </div>
                </div>
                
                {/* Negative */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Negative</span>
                    <span className="font-mono">{sentiment.breakdown.negative}%</span>
                  </div>
                  <div className="h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF2BD6] rounded-full transition-all duration-500"
                      style={{ width: `${sentiment.breakdown.negative}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
