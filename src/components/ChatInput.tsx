'use client';

import { KeyboardEvent, useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (message.trim() && !isLoading && !isSending) {
      const messageToSend = message.trim();
      setMessage('');
      setIsSending(true);
      try {
        await onSendMessage(messageToSend);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        className="w-full resize-none rounded-2xl border border-gray-200 pl-6 pr-16 py-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none min-h-[60px] max-h-32 bg-white/50 backdrop-blur-sm transition-all duration-200"
        rows={1}
        disabled={isLoading || isSending}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || isLoading || isSending}
        className="absolute right-3 bottom-3 p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  );
}; 