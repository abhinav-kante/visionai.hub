import { useState, useEffect, useRef, useCallback } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import type { Detection } from '@/types';

export function useObjectDetection() {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
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
        
        // Use the lite model for better performance
        const loadedModel = await cocoSsd.load({
          base: 'lite_mobilenet_v2'
        });
        
        if (isMounted) {
          setModel(loadedModel);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load model');
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
      const predictions = await model.detect(videoRef.current);
      
      const formattedDetections: Detection[] = predictions.map(pred => ({
        bbox: pred.bbox as [number, number, number, number],
        class: pred.class,
        score: pred.score
      }));
      
      setDetections(formattedDetections);
    } catch (err) {
      console.error('Detection error:', err);
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
    setDetections([]);
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
    detections,
    isDetecting,
    startDetection,
    stopDetection
  };
}
