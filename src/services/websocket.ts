import { WebSocketMessage } from '@/types';
import { generateAIResponse } from './ai';

class WebSocketService {
  private static instance: WebSocketService;
  private callbacks: ((message: WebSocketMessage) => void)[] = [];

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect() {
    console.log('Simulated connection established');
  }

  public disconnect() {
    console.log('Simulated connection closed');
  }

  public async sendMessage(message: WebSocketMessage) {
    try {
      // Show typing indicator
      this.callbacks.forEach(callback => 
        callback({
          type: 'typing',
          payload: { isTyping: true }
        })
      );

      // Generate AI response
      const aiResponse = await generateAIResponse(message.payload.content);

      // Hide typing indicator and send response
      this.callbacks.forEach(callback => {
        callback({
          type: 'typing',
          payload: { isTyping: false }
        });
        callback({
          type: 'message',
          payload: { content: aiResponse }
        });
      });
    } catch (error) {
      console.error('Error in sendMessage:', error);
      this.callbacks.forEach(callback => 
        callback({
          type: 'message',
          payload: { content: "I apologize, there was an error generating a response. Please try again." }
        })
      );
    }
  }

  public onMessage(callback: (message: WebSocketMessage) => void) {
    this.callbacks.push(callback);
  }

  public onTyping(callback: (isTyping: boolean) => void) {
    // Handled through regular message callbacks now
  }
}

export const wsService = WebSocketService.getInstance(); 