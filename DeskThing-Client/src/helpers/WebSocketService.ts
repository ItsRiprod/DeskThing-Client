import LogStore from "../stores/logStore"
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
  private useProxy: boolean = false; // flag
  private manifest: ServerManifest | null = null

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
      LogStore.sendMessage('WS', `Reconnecting Websocket to port ${manifest.ip}`)
      this.reconnect(manifest.ip);
      this.manifest = manifest
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
      LogStore.sendError('WS', `Failed to initialize WebSocket: ${error.message}`)
    }
  }

  private async startReverseProxy(): Promise<void> {
    try {
      LogStore.sendMessage('Proxy', 'Attempting to start reverse proxy...');
      await import('./reverse-proxy');
      LogStore.sendMessage('Proxy', 'Reverse proxy started successfully.');
    } catch (error) {
      LogStore.sendError('Proxy', `Failed to start reverse proxy: ${error.message}`);
    }
  }

  reconnect(manifestIp: string | null = null): void {
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
      LogStore.sendMessage('WS', `Connected to ${this.ipList[this.currentIpIndex]}`)
      this.registerEventHandler();
      this.post({app: 'server', payload: this.manifest, type: 'manifest'})
    };

    webSocket.onclose = async (event: CloseEvent): Promise<void> => {
      this.webSocket.close();
      LogStore.sendError('WS', `WebSocket closed, Code: ${event.code}, Reason: ${event.reason || 'Unknown reason'}`)
      this.attempts++;

      if (this.attempts > 3 && !this.useProxy) {
        this.useProxy = true;
        await this.startReverseProxy();
      }

      setTimeout(this.reconnect.bind(this), this.attempts > 5 ? 30000 : 2000);
      return;
    };
    webSocket.onerror = (event: Event) => {
      console.error(`WebSocket error: ${event}`);
      LogStore.sendError('WS', `WebSocket encountered an error: ${event.type}`);

      if (event.type === 'ECONNREFUSED') {
        LogStore.sendError('WS', `Connection refused: Check if the server is running and accepting connections.`);
      } else if (event.type === 'EHOSTUNREACH') {
        LogStore.sendError('WS', `Host unreachable: Verify if the IP address ${this.ipList[this.currentIpIndex]} is correct and reachable.`);
      } else if (event.type === 'ETIMEOUT') {
        LogStore.sendError('WS', `Connection timeout: It may be blocked by a firewall or network issue.`);
      }
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
      this.manifest = manifest
      const { ip, port } = manifest;
      if (!this.ipList.includes(ip)) {
        this.ipList.push(ip);
        this.currentIpIndex = this.ipList.length -1
      }
      if (this.attempts > 5) {
        const oldip = this.ipList[this.currentIpIndex];
        const BASE_URL = `ws://${oldip}:${port}`;
        LogStore.sendMessage('WS', `Starting on port ${BASE_URL} attempt #${this.attempts}`);
        return new WebSocket(BASE_URL);
      } else {
        const BASE_URL = `ws://${ip}:${port}`;
        LogStore.sendMessage('WS', `Starting on port ${BASE_URL} attempt #${this.attempts}`);
        return new WebSocket(BASE_URL);
      }
    } else {
      LogStore.sendError('WS', `Manifest not available!`);
      throw new Error('Manifest is not available.');
    }
  }
}

export default WebSocketService.getInstance()