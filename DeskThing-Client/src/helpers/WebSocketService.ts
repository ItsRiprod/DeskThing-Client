import ManifestStore, { ServerManifest } from "../stores/manifestStore";
import { SocketData } from "../types";
// Computer local IP
//const BASE_URL = 'ws://192.168.159.100:8891';

// Car thing IP
//const BASE_URL = 'ws://192.168.7.1:8891';

// ADB IP
//const BASE_URL = 'ws://localhost:8891';

type SocketEventListener = (msg: SocketData) => void;

class WebSocketService {
  private static instance: WebSocketService
  listeners: { [app: string]: SocketEventListener[] } = {};
  webSocket: WebSocket;

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
      this.reconnect();
    }
  }

  private initializeSocket(): void {
    if (this.webSocket) {
      this.webSocket.close();
    }

    try {
      this.webSocket = create_socket();
      if (this.webSocket) {
        this.connect(this.webSocket);
      }
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }

  private reconnect(): void {
    this.connect(create_socket());
  }

  connect(webSocket: WebSocket): void {
    this.webSocket = webSocket;
    // browser socket, WebSocket IPC transport
    webSocket.onopen = (): void => {
      this.registerEventHandler();
    };

    webSocket.onclose = () => {
      this.webSocket.close();
      setTimeout(this.reconnect.bind(this), 1000);
      return;
    };
    webSocket.onerror = () => {
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
}

function create_socket(): WebSocket {
  const manifest = ManifestStore.getManifest();
  if (manifest) {
    const { ip, port } = manifest;
    const BASE_URL = `ws://${ip}:${port}`;
    return new WebSocket(BASE_URL);
  } else {
    throw new Error('Manifest is not available.');
  }
}

export default WebSocketService.getInstance()