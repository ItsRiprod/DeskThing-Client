import { OutgoingSocketData, SocketData } from "@src/types";
import { handleServerSocket } from "./serverWebsocketHandler";

type SocketEventListener = (msg: SocketData) => void;
type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';
type StatusListener = (status: ConnectionStatus) => void;

class WebSocketManager {
  private static instance: WebSocketManager
  private socket: WebSocket | null = null;
  private listeners: SocketEventListener[] = [];
  private statusListeners: StatusListener[] = [];
  private reconnecting = false;
  private url: string;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private pongTimeout: NodeJS.Timeout | null = null;
  private missedPongs = 0;
  private readonly MAX_MISSED_PONGS = 3;
  private code = Math.random() * 1000000;

  constructor() {

  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager()
    }

    return WebSocketManager.instance
  }

  async closeExisting() {
    if (this.socket) {
      // Clean up event listeners
      this.socket.onopen = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.onmessage = null;
      
      // Close connection if open
      if (this.socket.readyState === WebSocket.OPEN) {
        await this.socket.close(4000, 'Closing existing connection');
      }
      
      // Clear heartbeat timers
      this.stopHeartbeat();
      
      // Reset state
      this.socket = null;
      this.missedPongs = 0;
    } 
  }
  

  async connect(url?: string) {
    this.url = url || this.url;
    
    if (this.url == undefined || !this.url) {
      console.error("No WebSocket URL provided");
      return;
    }

    
    if (this.url != this.socket?.url) {
      await this.closeExisting();
      this.socket = new WebSocket(this.url);
    }

    this.socket.onopen = () => {
      console.log(`Connected to ${this.url}`);
      this.reconnecting = false;
      this.startHeartbeat()
      this.notifyStatusChange('connected');
    };

    this.socket.onclose = (reason) => {
      console.log("Disconnected, attempting to reconnect...", this.code, reason);
      this.stopHeartbeat()
      this.notifyStatusChange('disconnected');
      this.reconnect();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.app == 'client') {
        if (data.type == "pong") {
          this.resetPongTimeout();
        } else if (data.type == "ping") {
          this.sendMessage({ app: "server", type: "pong" });
        } else {
          handleServerSocket(data)
        }
      }
      

      this.notifyListeners(data);
    };
  }

  disconnect() {
    this.closeExisting()
  }

  reconnect() {
    console.log('Reconnecting in 5s...')
    if (this.reconnecting) return;
    this.reconnecting = true;
    this.notifyStatusChange('reconnecting');

    this.disconnect()

    setTimeout(() => {
      console.log("Conecting...");
      this.connect()
      this.reconnecting = false;
    }, 5000); // Reconnect after 5 seconds
  }

  sendMessage(message: OutgoingSocketData) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  addListener(listener: SocketEventListener) {
    this.listeners.push(listener);
  }

  removeListener(listener: SocketEventListener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  addStatusListener(listener: StatusListener) {
    this.statusListeners.push(listener);
  }

  removeStatusListener(listener: StatusListener) {
    this.statusListeners = this.statusListeners.filter(l => l !== listener);
  }

  private notifyStatusChange(status: ConnectionStatus) {
    this.statusListeners.forEach(listener => listener(status));
  }

  private notifyListeners(data: SocketData) {
    this.listeners.forEach((listener) => listener(data));
  }

  private startHeartbeat() {
    this.stopHeartbeat(); // Clear any existing heartbeat
    this.missedPongs = 0;

    // Send "ping" every 30 seconds
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.sendMessage({ app: 'server', type: "ping" });
        this.startPongTimeout();
      }
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  private startPongTimeout() {
    // If "pong" isn't received within 10 seconds, increment missed pongs
    if (this.pongTimeout) clearTimeout(this.pongTimeout);
    this.pongTimeout = setTimeout(() => {
      this.missedPongs += 1;
      console.warn(`Missed pong ${this.missedPongs}/${this.MAX_MISSED_PONGS}`);
      if (this.missedPongs >= this.MAX_MISSED_PONGS) {
        this.closeExisting()
        this.reconnect();
      }
    }, 10000);
  }

  public static resetInstance() {
    if (WebSocketManager.instance) {
      WebSocketManager.instance.disconnect();
      WebSocketManager.instance = null;
    }
  }

  private resetPongTimeout() {
    this.missedPongs = 0; // Reset missed pong count on successful pong
    if (this.pongTimeout) clearTimeout(this.pongTimeout);
  }
}

export default WebSocketManager

