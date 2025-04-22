'use client';

import { KeyboardEvent, useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CHARS = 1000;

  useEffect(() => {
    setCharCount(message.length);
  }, [message]);

  const handleSend = async () => {
    if (message.trim() && !isLoading && !isSending) {
      const messageToSend = message.trim();
      setMessage('');
      setIsSending(true);
      try {
        await onSendMessage(messageToSend);
      } finally {
        setIsSending(false);
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setMessage(value);
      adjustTextareaHeight();
    }
  };

  const clearMessage = () => {
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  return (
    <div className="relative">
      {/* Character counter and suggestions */}
      <div className={`absolute -top-6 right-0 text-sm transition-opacity duration-200 ${isFocused ? 'opacity-100' : 'opacity-0'}`}>
        <span className={`${charCount > MAX_CHARS * 0.8 ? 'text-orange-500' : 'text-gray-400'}`}>
          {charCount}/{MAX_CHARS}
        </span>
      </div>

      {/* Main input container */}
      <div className={`relative bg-white rounded-2xl transition-all duration-300 ${
        isFocused ? 'shadow-lg ring-2 ring-indigo-200' : 'shadow'
      }`}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask me anything..."
          className="w-full resize-none rounded-2xl pl-12 pr-16 py-4 focus:outline-none min-h-[60px] max-h-48 bg-transparent"
          rows={1}
          disabled={isLoading || isSending}
        />

        {/* Left side buttons */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setShowEmoji(!showEmoji)}
            className="p-2 text-gray-400 hover:text-indigo-500 rounded-full hover:bg-indigo-50 transition-colors"
            title="Emoji (coming soon)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Right side buttons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {message && (
            <button
              onClick={clearMessage}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Clear message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading || isSending}
            className={`p-2 rounded-xl flex items-center justify-center transition-all duration-300 ${
              message.trim() && !isLoading && !isSending
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-600 scale-100 hover:scale-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title="Send message"
          >
            {isSending ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Input suggestions */}
      {isFocused && !message && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 animate-fadeIn">
          <p className="text-sm text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Explain quantum computing",
              "How does photosynthesis work?",
              "What is machine learning?",
              "Teach me about DNA"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setMessage(suggestion)}
                className="text-sm px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status indicators */}
      <div className="absolute bottom-full left-0 mb-1">
        {isLoading && (
          <span className="text-xs text-gray-400 flex items-center">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
            AI is thinking...
          </span>
        )}
      </div>
    </div>
  );
}; 