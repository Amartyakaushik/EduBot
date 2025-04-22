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
    <div className="flex items-end space-x-2 border-t p-4 bg-white">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        className="flex-1 resize-none rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        rows={1}
        disabled={isLoading || isSending}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || isLoading || isSending}
        className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300"
        aria-label="Send message"
      >
        {isLoading ? '...' : '➤'}
      </button>
    </div>
  );
}; 