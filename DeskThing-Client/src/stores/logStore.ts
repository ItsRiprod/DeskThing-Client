/**
 * @file LogStore.ts
 * @description This file stores and keeps track of messages and logs.
 * @author Riprod
 * @version 0.8.0
 */
import { SocketData } from '../types';
import webSocketService, { WebSocketService } from '../helpers/WebSocketService';

type LogCallbacks = (log: log) => void;

export type LOG_TYPES = 'error' | 'message' | 'log' | 'all'

export type log = {
  app: string
  type: LOG_TYPES
  payload: string
}

export class LogStore {
  private static instance: LogStore;
  private logs: log[] = []
  private logCallbacks: { [key in LOG_TYPES]: LogCallbacks[] } = {
    error: [],
    message: [],
    log: [],
    all: []
};
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
        LogStore.getInstance().sendMessage('mainframe', 'Cheatcodes Enabled')
        this.sqnce[0] = 1
      }
      return true
    } else {
      this.sqnce[0] = 1
      return false
    }
  }

  static getInstance(): LogStore {
    if (!LogStore.instance) {
        LogStore.instance = new LogStore();
    }
    return LogStore.instance;
  }

  private async handleMessageData(msg: SocketData): Promise<void> {
            if (msg.type == 'message' || msg.type == 'log' || msg.type == 'error') {
                const message = msg.payload.toString()
                const type = msg.type.toString() as LOG_TYPES
                const app = msg.app.toString()
                const log: log = {
                    app: app,
                    type: type,
                    payload: message
                }
                this.addLog(log)
                this.notifyLog(log)
            }
  }

  private addLog(log: log): void {
    this.logs.push(log);
    this.notifyLog(log);
    // Trim logs if they exceed 500 items
    if (this.logs.length > 200) {
      this.logs.splice(0, 100); // Remove the oldest 250 logs
    }
  }

  private async notifyLog(log: log): Promise<void> {
    this.logCallbacks[log.type].forEach(callback => callback(log));
    this.logCallbacks['all'].forEach(callback => callback(log));
  }

  on(type: LOG_TYPES, callback: LogCallbacks): () => void {
    if (!this.logCallbacks[type]) {
      this.logCallbacks[type] = [];
    }
    this.logCallbacks[type].push(callback);
    return () => {
      this.logCallbacks[type] = this.logCallbacks[type].filter(cb => cb !== callback);
    };
  }

  getAllLogs(): log[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }

  getLogs(): log[] {
    return this.logs.filter(log => log.type === 'log');
  }
  
  getMessages(): log[] {
    return this.logs.filter(log => log.type === 'message');
  }
  
  getErrors(): log[] {
    return this.logs.filter(log => log.type === 'error');
  }

  sendLog(app: string, message: string) {
    const log: log = {
      app: app,
      type: 'log',
      payload: message
  }
    this.addLog(log)
    if (this.socket) {
        this.socket.post({ app: 'server', type: log.type, payload: log.payload })
    }
  }

  sendMessage(app: string, message: string) {
    const log: log = {
        app: app,
        type: 'message',
        payload: message
    }
    this.addLog(log)
    if (this.socket) {
        this.socket.post({ app: 'server', type: log.type, payload: log.payload })
    }
  }
  sendError(app: string, error: string) {
    const log: log = {
        app: app,
        type: 'error',
        payload: error
    }
    this.addLog(log)
    if (this.socket) {
        this.socket.post({ app: 'server', type: log.type, payload: log.payload })
    }
  }

  cleanup(): void {
    this.logCallbacks = {
      error: [],
      message: [],
      log: [],
      all: []
  };
  }
}

export default LogStore.getInstance();