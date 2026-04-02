import { useState, useEffect, useRef, useCallback } from 'react';
import type { SentimentResult } from '@/types';

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// Simple sentiment analysis using keyword-based approach
const positiveWords = ['good', 'great', 'excellent', 'amazing', 'awesome', 'fantastic', 'wonderful', 'love', 'happy', 'best', 'perfect', 'brilliant', 'outstanding', 'superb', 'impressive', 'down', 'reduce', 'improve', 'better', 'success', 'win', 'positive', 'excited'];
const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'disappointing', 'poor', 'fail', 'error', 'problem', 'issue', 'bug', 'crash', 'slow', 'broken', 'negative', 'sad', 'angry', 'frustrated'];

function analyzeSentiment(text: string): SentimentResult {
  const words = text.toLowerCase().split(/\s+/);
  let positive = 0;
  let negative = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positive++;
    if (negativeWords.some(nw => word.includes(nw))) negative++;
  });
  
  const total = words.length;
  const neutral = Math.max(0, total - positive - negative);
  
  const positiveScore = total > 0 ? positive / total : 0;
  const negativeScore = total > 0 ? negative / total : 0;
  const neutralScore = total > 0 ? neutral / total : 1;
  
  let label: 'positive' | 'neutral' | 'negative' = 'neutral';
  let score = 0;
  
  if (positiveScore > negativeScore && positiveScore > 0.1) {
    label = 'positive';
    score = positiveScore;
  } else if (negativeScore > positiveScore && negativeScore > 0.1) {
    label = 'negative';
    score = -negativeScore;
  } else {
    label = 'neutral';
    score = neutralScore;
  }
  
  return {
    label,
    score,
    breakdown: {
      positive: Math.round(positiveScore * 100),
      neutral: Math.round(neutralScore * 100),
      negative: Math.round(negativeScore * 100)
    }
  };
}

export function useSpeechRecognition() {
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [sentiment, setSentiment] = useState<SentimentResult>({
    label: 'neutral',
    score: 0,
    breakdown: { positive: 0, neutral: 100, negative: 0 }
  });
  const [history, setHistory] = useState<string[]>([]);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      
      if (final) {
        setTranscript(prev => {
          const newTranscript = prev ? prev + ' ' + final : final;
          const sentimentResult = analyzeSentiment(newTranscript);
          setSentiment(sentimentResult);
          
          // Add to history
          const sentences = final.split(/[.!?]+/).filter(s => s.trim());
          setHistory(prev => [...prev.slice(-2), ...sentences].slice(-3));
          
          return newTranscript;
        });
      }
      
      setInterimTranscript(interim);
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setIsSupported(false);
      }
    };
    
    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && isSupported) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setHistory([]);
    setSentiment({
      label: 'neutral',
      score: 0,
      breakdown: { positive: 0, neutral: 100, negative: 0 }
    });
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    sentiment,
    history,
    startListening,
    stopListening,
    reset
  };
}
