import { create } from 'zustand';
import type { Message, ChatState } from '@/types';

interface ChatStore extends ChatState {
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setLoading: (loading) =>
    set(() => ({
      isLoading: loading,
    })),
  clearMessages: () =>
    set(() => ({
      messages: [],
    })),
})); 