
export interface SignInterpretation {
  text: string;
  confidence: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
  LISTENING = 'LISTENING',
  INTERPRETING = 'INTERPRETING',
  SPEAKING = 'SPEAKING',
  ERROR = 'ERROR'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
