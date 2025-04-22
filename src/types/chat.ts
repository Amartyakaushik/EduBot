export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export type ContextType = 'programming' | 'math' | 'science' | 'general';

export interface AIResponse {
  generated_text?: string;
  text?: string;
  error?: string;
}