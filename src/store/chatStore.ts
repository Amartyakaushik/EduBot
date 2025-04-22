import { ChatState, Message } from '@/types/chat';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatStore extends ChatState {
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  updateMessage: (id: number, updates: Partial<Message>) => void;
  deleteMessage: (id: number) => void;
}

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
      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        })),
      deleteMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== id),
        })),
    }),
    {
      name: 'chat-store',
      version: 1,
    }
  )
); 