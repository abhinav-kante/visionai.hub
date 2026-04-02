import { useState, useEffect, useRef, useCallback } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs';
import type { HandDetection } from '@/types';

export function useHandPose() {
  const [model, setModel] = useState<handPoseDetection.HandDetector | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hands, setHands] = useState<HandDetection[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const animationRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load model
  useEffect(() => {
    let isMounted = true;
    
    const loadModel = async () => {
      try {
        setIsLoading(true);
        await tf.ready();
        
        const modelConfig = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
          runtime: 'tfjs' as const,
          modelType: 'lite' as const,
          maxHands: 2,
        };
        
        const detector = await handPoseDetection.createDetector(modelConfig, detectorConfig);
        
        if (isMounted) {
          setModel(detector);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load hand pose model');
          setIsLoading(false);
        }
      }
    };

    loadModel();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Detection loop
  const detect = useCallback(async () => {
    if (!model || !videoRef.current || videoRef.current.paused || videoRef.current.ended) {
      return;
    }

    try {
      const predictions = await model.estimateHands(videoRef.current, {
        flipHorizontal: false
      });
      
      const formattedHands: HandDetection[] = predictions.map((hand: any) => ({
        keypoints: hand.keypoints.map((kp: any) => ({
          x: kp.x,
          y: kp.y,
          z: kp.z,
          name: kp.name
        })),
        score: hand.score,
        handedness: hand.handedness
      }));
      
      setHands(formattedHands);
    } catch (err) {
      console.error('Hand pose detection error:', err);
    }
  }, [model]);

  const startDetection = useCallback((video: HTMLVideoElement) => {
    videoRef.current = video;
    setIsDetecting(true);
    
    const loop = async () => {
      if (!isDetecting) return;
      await detect();
      animationRef.current = requestAnimationFrame(loop);
    };
    
    loop();
  }, [detect]);

  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    videoRef.current = null;
    setHands([]);
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    model,
    isLoading,
    error,
    hands,
    isDetecting,
    startDetection,
    stopDetection
  };
}
