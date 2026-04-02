import { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import {
  HeroSection,
  CapabilitiesSection,
  ObjectDetectionSection,
  FaceAnalysisSection,
  HandPoseSection,
  SentimentSection,
  PerformanceSection,
  UseCasesSection,
  CTASection,
} from '@/sections';
import './App.css';

function App() {
  // Initialize TensorFlow.js backend
  useEffect(() => {
    const initTF = async () => {
      await tf.ready();
      console.log('TensorFlow.js ready:', tf.getBackend());
    };
    initTF();
  }, []);

  return (
    <main className="relative bg-[#070A12] min-h-screen overflow-x-hidden">
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* Sections */}
      <HeroSection />
      <CapabilitiesSection />
      <ObjectDetectionSection />
      <FaceAnalysisSection />
      <HandPoseSection />
      <SentimentSection />
      <PerformanceSection />
      <UseCasesSection />
      <CTASection />
    </main>
  );
}

export default App;
