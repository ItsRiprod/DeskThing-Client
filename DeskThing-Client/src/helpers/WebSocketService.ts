import MessageStore from "../stores/messageStore"
import ManifestStore, { ServerManifest } from "../stores/manifestStore";
import { SocketData } from "../types";
// Computer local IP
//const BASE_URL = 'ws://192.168.159.100:8891';

// Car thing IP
//const BASE_URL = 'ws://192.168.7.1:8891';

// ADB IP
//const BASE_URL = 'ws://localhost:8891';

type SocketEventListener = (msg: SocketData) => void;

export class WebSocketService {
  private static instance: WebSocketService
  listeners: { [app: string]: SocketEventListener[] } = {};
  webSocket: WebSocket;
  private ipList: string[] = [
    'localhost',
    '192.168.7.1'
  ];

  private attempts: number = 0
  private currentIpIndex: number = 0;

  constructor() {
    ManifestStore.on((manifest) => this.handleManifestChange(manifest));
    this.initializeSocket()
  }

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private handleManifestChange(manifest: ServerManifest | null): void {
    if (manifest) {
      console.log('Reconnecting due to manifest update')
      MessageStore.sendMessage(`WS: Reconnecting Websocket to port ${manifest.ip}`)
      this.reconnect(manifest.ip);
    }
  }

  private initializeSocket(): void {
    if (this.webSocket) {
      this.webSocket.close();
    }

    try {
      this.webSocket = this.createSocket();
      if (this.webSocket) {
        this.connect(this.webSocket);
      }
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      MessageStore.sendMessage(`WS: Failed to initialize websocket`)
    }
  }

  private reconnect(manifestIp: string | null = null): void {
    if (manifestIp && !this.ipList.includes(manifestIp)) {
      this.ipList.push(manifestIp);
    }
    this.currentIpIndex = (this.currentIpIndex + 1) % this.ipList.length;
    this.connect(this.createSocket());
  }

  connect(webSocket: WebSocket): void {
    this.webSocket = webSocket;
    // browser socket, WebSocket IPC transport
    webSocket.onopen = (): void => {
      this.attempts = 0
      MessageStore.sendMessage(`WS: Connected`)
      this.registerEventHandler();
    };

    webSocket.onclose = () => {
      this.webSocket.close();
      this.attempts++;
      MessageStore.sendMessage(`WS: Unable to connect to ${this.ipList[this.currentIpIndex]}`)
      setTimeout(this.reconnect.bind(this), this.attempts * 1000);
      return;
    };
    webSocket.onerror = () => {
      MessageStore.sendMessage(`WS: Encountered an error`);
      //setTimeout(this.reconnect.bind(this), 1000);
      this.webSocket.close();
      return;
    };
  }

  is_ready(): boolean {
    return this.webSocket.readyState > 0;
  }

  post(body: SocketData): void {
    if (this.is_ready()) {
      this.webSocket.send(JSON.stringify(body));
    } else {
      console.error('WebSocket is not ready.');
    }
  }

  registerEventHandler = (): void => {
    this.webSocket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data.toString());
        const { app } = msg
        
        if (!this.listeners[app]) {
          this.listeners[app] = [];
        }
        // console.log('WEBSOCKET', msg)
        this.listeners[app].forEach((listener: SocketEventListener) => listener(msg as SocketData));
      } catch (e) {
        console.error(e);
      }
    };
  };

  // This is what should be used. Returns a function that can be used to remove the socket
  on(app: string, listener: SocketEventListener): () => void {
    if (!this.listeners[app]) {
      this.listeners[app] = [];
    }
    this.listeners[app].push(listener);
    // Return a function that removes this listener
    return () => {
      this.removeSocketEventListener(app, listener);
    };
  }

  addSocketEventListener(app: string, listener: SocketEventListener) {
    if (!this.listeners[app]) {
      this.listeners[app] = [];
    }
    this.listeners[app].push(listener);
  }

  removeSocketEventListener(app: string, listener: SocketEventListener) {
    const index = this.listeners[app]?.indexOf(listener);
    if (index !== undefined && index !== -1) {
      this.listeners[app].splice(index, 1);
    }
  }
  private createSocket(): WebSocket {
    const manifest = ManifestStore.getManifest();
    if (manifest) {
      const { ip, port } = manifest;
      if (!this.ipList.includes(ip)) {
        this.ipList.push(ip);
        this.currentIpIndex = this.ipList.length -1
      }
      if (this.attempts > 5) {
        const oldip = this.ipList[this.currentIpIndex];
        const BASE_URL = `ws://${oldip}:${port}`;
        MessageStore.sendMessage(`WS: Starting on port ${BASE_URL} attempt #${this.attempts}`);
        return new WebSocket(BASE_URL);
      } else {
        const BASE_URL = `ws://${ip}:${port}`;
        MessageStore.sendMessage(`WS: Starting on port ${BASE_URL} attempt #${this.attempts}`);
        return new WebSocket(BASE_URL);
      }
    } else {
      MessageStore.sendMessage(`WS: Manifest not available!`);
      throw new Error('Manifest is not available.');
    }
  }
}

export default WebSocketService.getInstance()