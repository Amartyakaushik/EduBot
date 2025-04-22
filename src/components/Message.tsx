import { Message as MessageType } from '@/types';
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex items-start space-x-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className="flex-shrink-0">
        {isAI ? (
          <ComputerDesktopIcon className="h-8 w-8 text-blue-500" />
        ) : (
          <UserCircleIcon className="h-8 w-8 text-gray-500" />
        )}
      </div>
      <div
        className={`flex max-w-[80%] rounded-lg px-4 py-2 ${
          isAI ? 'bg-blue-100' : 'bg-gray-100'
        }`}
      >
        <p className="text-sm text-gray-800">{message.content}</p>
      </div>
      <span className="text-xs text-gray-400">
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
}; 