export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface User {
  id: string;
  name: string;
}

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'status';
  payload: any;
} 