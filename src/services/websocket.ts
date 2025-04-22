import { generateAIResponse } from './ai';

export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageQueue: string[] = [];
  private isProcessing = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private typingTimeout: NodeJS.Timeout | null = null;

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    try {
      this.socket = new WebSocket(this.url);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.processMessageQueue();
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'user_message') {
          await this.handleUserMessage(message.content);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };
  }

  private async handleUserMessage(content: string) {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Send typing indicator
    this.sendMessage({
      type: 'typing',
      content: true
    });

    try {
      const response = await generateAIResponse(content);
      
      // Clear typing indicator
      this.sendMessage({
        type: 'typing',
        content: false
      });

      // Send AI response
      this.sendMessage({
        type: 'ai_message',
        content: response
      });
    } catch (error) {
      console.error('Error generating AI response:', error);
      this.sendMessage({
        type: 'error',
        content: 'Sorry, I encountered an error while processing your message.'
      });
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      this.sendMessage({
        type: 'error',
        content: 'Connection lost. Please refresh the page.'
      });
    }
  }

  private processMessageQueue() {
    if (this.isProcessing || this.messageQueue.length === 0) return;

    this.isProcessing = true;
    const message = this.messageQueue.shift();

    if (message && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }

    this.isProcessing = false;
    this.processMessageQueue();
  }

  public sendMessage(message: any) {
    const messageString = JSON.stringify(message);
    
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(messageString);
    } else {
      this.messageQueue.push(messageString);
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }
} 