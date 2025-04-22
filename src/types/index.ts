export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
  category?: 'programming' | 'math' | 'science' | 'general';
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export interface User {
  id: string;
  name: string;
}

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'status';
  payload: any;
} 