import { WebSocketMessage } from '@/types';

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

  public sendMessage(message: WebSocketMessage) {
    // Simulate AI response after 1 second
    setTimeout(() => {
      const aiResponse = this.generateAIResponse(message.payload.content);
      this.callbacks.forEach(callback => 
        callback({
          type: 'message',
          payload: { content: aiResponse }
        })
      );
    }, 1000);
  }

  public onMessage(callback: (message: WebSocketMessage) => void) {
    this.callbacks.push(callback);
  }

  public onTyping(callback: (isTyping: boolean) => void) {
    // Simulate typing indicator
    callback(true);
    setTimeout(() => callback(false), 800);
  }

  private generateAIResponse(userMessage: string): string {
    // Simple response generation based on user input
    const responses = [
      `I understand your point about "${userMessage}". Let me explain further...`,
      `That's an interesting perspective on "${userMessage}". Here's what I think...`,
      `Regarding "${userMessage}", let me share some educational insights...`,
      `Your question about "${userMessage}" is important. Here's what you need to know...`,
      `Let's explore "${userMessage}" in more detail...`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const wsService = WebSocketService.getInstance(); 