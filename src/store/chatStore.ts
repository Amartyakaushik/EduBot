import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Message, ChatState } from '@/types';

interface ChatStore extends ChatState {
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

// Create a store with persistence
export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'chat-storage', // unique name for localStorage key
      partialize: (state) => ({ messages: state.messages }), // only persist messages
      version: 1, // version number for future migrations
    }
  )
); 