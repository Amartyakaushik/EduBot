import { wsService } from '@/services/websocket';
import { useChatStore } from '@/store/chatStore';
import { useEffect, useRef, useState } from 'react';
import { ChatInput } from './ChatInput';
import { Message } from './Message';

export const Chat: React.FC = () => {
  const { messages, isLoading, addMessage, setLoading } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    wsService.connect();
    
    wsService.onMessage((message) => {
      if (message.type === 'message') {
        setIsTyping(false);
        addMessage({
          content: message.payload.content,
          sender: 'ai',
        });
        setLoading(false);
      }
    });

    wsService.onTyping((typing) => {
      setIsTyping(typing);
    });

    return () => {
      wsService.disconnect();
    };
  }, [addMessage, setLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (content: string) => {
    addMessage({
      content,
      sender: 'user',
    });
    
    setLoading(true);
    wsService.sendMessage({
      type: 'message',
      payload: { content },
    });
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-500 text-sm">AI</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-100"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}; 