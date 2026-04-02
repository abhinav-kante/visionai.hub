import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceDetection from '@tensorflow-models/face-detection';
import * as tf from '@tensorflow/tfjs';
import type { FaceDetection as FaceDetectionType } from '@/types';

export function useFaceDetection() {
  const [model, setModel] = useState<faceDetection.FaceDetector | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faces, setFaces] = useState<FaceDetectionType[]>([]);
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
        
        const modelConfig = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig = {
          runtime: 'tfjs' as const,
          modelType: 'short' as const,
          maxFaces: 5,
        };
        
        const detector = await faceDetection.createDetector(modelConfig, detectorConfig);
        
        if (isMounted) {
          setModel(detector);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load face detection model');
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
      const predictions = await model.estimateFaces(videoRef.current, {
        flipHorizontal: false
      });
      
      const formattedFaces: FaceDetectionType[] = predictions.map((face: any) => ({
        box: face.box,
        keypoints: face.keypoints || [],
        score: face.score
      }));
      
      setFaces(formattedFaces);
    } catch (err) {
      console.error('Face detection error:', err);
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
    setFaces([]);
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
    faces,
    isDetecting,
    startDetection,
    stopDetection
  };
}
