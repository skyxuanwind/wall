export interface Message {
  id: string;
  name: string;
  message: string;
  dream: string;
  position: {
    x: number;
    y: number;
  };
  timestamp: number;
} 