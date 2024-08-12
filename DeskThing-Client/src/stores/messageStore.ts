/**
 * @file messageStore.ts
 * @description This file stores and keeps track of messages and logs.
 * @author Riprod
 * @version 0.8.0
 */
import { SocketData } from '../types';
import webSocketService, { WebSocketService } from '../helpers/WebSocketService';

type MessageCallbacks = (message: string) => void;

export class MessageStore {
  private static instance: MessageStore;
  private messages: string[] = []
  private messageCallbacks: MessageCallbacks[] = [];
  private socket: WebSocketService = null
  private static sqnce = [1, 'u','u','d','d','l','r','l','r']

  private constructor() {
    this.setupWebSocket();
  }

  private async setupWebSocket() {
    this.socket = await webSocketService;
    this.socket.on('client', this.handleMessageData.bind(this))
  }

  static handleNext(int: string): boolean {
    if (this.sqnce[this.sqnce[0]] == int && typeof this.sqnce[0] === 'number') {
      this.sqnce[0]++ 
      if (this.sqnce[0] >= this.sqnce.length) {
        MessageStore.getInstance().sendMessage('Cheatcodes Enabled')
        this.sqnce[0] = 1
      }
      return true
    } else {
      this.sqnce[0] = 1
      return false
    }
  }

  static getInstance(): MessageStore {
    if (!MessageStore.instance) {
        MessageStore.instance = new MessageStore();
    }
    return MessageStore.instance;
  }

  private async handleMessageData(msg: SocketData): Promise<void> {
            if (msg.type == 'message') {
                const message = msg.data.toString()
                this.messages.push(message)
                this.notifyMessage(message)
            }
  }

  private async notifyMessage(message: string): Promise<void> {
    console.log(message)
    this.messageCallbacks.forEach(callback => callback(message));
  }

  onMessage(callback: MessageCallbacks): () => void {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  getMessages(): string[] {
    return this.messages;
  }

  sendMessage(message: string) {
    this.messages.push(message)
    this.notifyMessage(message)
    if (this.socket) {
        this.socket.post({ app: 'server', type: 'message', data: message })
    }
  }

  cleanup(): void {
    this.messageCallbacks = [];
  }
}

export default MessageStore.getInstance();