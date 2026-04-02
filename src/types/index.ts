export interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export interface FaceLandmark {
  x: number;
  y: number;
  z?: number;
}

export interface FaceDetection {
  box: {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
    width: number;
    height: number;
  };
  keypoints: FaceLandmark[];
  score: number;
}

export interface HandKeypoint {
  x: number;
  y: number;
  z?: number;
  name?: string;
}

export interface HandDetection {
  keypoints: HandKeypoint[];
  score: number;
  handedness?: 'Left' | 'Right';
}

export interface SentimentResult {
  label: 'positive' | 'neutral' | 'negative';
  score: number;
  breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface ModelStatus {
  objectDetection: boolean;
  faceDetection: boolean;
  handPose: boolean;
  sentiment: boolean;
}

export interface InferenceStats {
  fps: number;
  latency: number;
  detections: number;
}
