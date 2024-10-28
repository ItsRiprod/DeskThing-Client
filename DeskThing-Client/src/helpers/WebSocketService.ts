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
  webSocket: WebSocket | null = null;
  private ipList: string[] = [
    'localhost',
    '192.168.7.1'
  ];
  private attempts: number = 0
  private currentIpIndex: number = 0;
  private reconnecting: boolean = false;
  private manifest: ServerManifest | null = null
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private heartbeatTimeout: NodeJS.Timeout | null = null;
  private live = false;
  private missedHeartBeats: number = 0;

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
      this.webSocket = null;
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

  reconnect(manifestIp: string | null = null): void {
    if (this.reconnecting) {
      return;
    }

    this.reconnecting = true;

    if (this.webSocket) {
      this.webSocket.close(1000, "Reconnecting...");
      this.webSocket = null;
    }

    if (manifestIp && !this.ipList.includes(manifestIp)) {
      this.ipList.push(manifestIp);
    }
    this.currentIpIndex = (this.currentIpIndex + 1) % this.ipList.length;
    setTimeout(() => {
      try {
        this.webSocket = this.createSocket();
        if (this.webSocket) {
          this.connect(this.webSocket);
        }
      } catch (error) {
        console.error('Failed to reconnect WebSocket:', error);
        LogStore.sendError('WS', `Failed to reconnect WebSocket: ${error.message}`);
        this.attempts++;
        setTimeout(() => this.reconnect(manifestIp), this.attempts > 5 ? 30000 : 5000);
      } finally {
        this.reconnecting = false;
      }
    }, 1000);
  }

  connect(webSocket: WebSocket): void {
    this.webSocket = webSocket;
    // browser socket, WebSocket IPC transport
    webSocket.onopen = (): void => {
      this.attempts = 0
      LogStore.sendMessage('WS', `Connected to ${this.ipList[this.currentIpIndex]}`)
      this.registerEventHandler();
      this.startHeartbeat();
      this.post({app: 'server', payload: this.manifest, type: 'manifest'})
    };

    webSocket.onclose = async (event: CloseEvent): Promise<void> => {
      LogStore.sendError('WS', `WebSocket closed, Code: ${event.code}, Reason: ${event.reason || 'Unknown reason'}`)
      if (event.code == 1000) return
      this.attempts++;
      setTimeout(() => {
        LogStore.sendLog('WS', `Attempting to reconnect to ${this.ipList[this.currentIpIndex]}`);
        this.reconnect(this.ipList[this.currentIpIndex]);
      }, this.attempts > 5 ? 30000 : 5000);
    };

    webSocket.onerror = (event: Event) => {
      console.error(`WebSocket error: ${event}`);
      LogStore.sendError('WS', `WebSocket encountered an error: ${event.type}`);

      if (event instanceof ErrorEvent) {
        if (event.message.includes('ECONNREFUSED')) {
          LogStore.sendError('WS', `Connection refused: Check if the server is running and accepting connections.`);
        } else if (event.message.includes('EHOSTUNREACH')) {
          LogStore.sendError('WS', `Host unreachable: Verify if the IP address ${this.ipList[this.currentIpIndex]} is correct and reachable.`);
        } else if (event.message.includes('ETIMEOUT')) {
          LogStore.sendError('WS', `Connection timeout: It may be blocked by a firewall or network issue.`);
        }
      }
      
      if (this.webSocket) {
        this.webSocket.close();
      }
    };
  }

  is_ready(): boolean {
    return this.webSocket !== null && this.webSocket.readyState === WebSocket.OPEN;
  }

  post(body: SocketData): void {
    if (this.is_ready() && this.live) {
      this.webSocket!.send(JSON.stringify(body));
    } else {
      console.error('WebSocket is not ready.');
    }
  }

  pong(): void {
    if (this.is_ready() && this.live) {
      this.webSocket!.send(JSON.stringify({ app: 'server', type: 'pong', payload: this.manifest.ip || '' }));
    } else {
      console.error('WebSocket is not ready.');
    }
  }

  registerEventHandler = (): void => {
    if (this.webSocket) {
      this.webSocket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data.toString()) as SocketData;
          const { app } = msg
          
          if (app === 'client') {
            if (msg.type == 'heartbeat') {
              this.resetHeartbeatTimeout();
              return;
            } else if (msg.type == 'ping') {
                this.pong();
                LogStore.sendLog('WS', `Received pong from ${this.ipList[this.currentIpIndex]}`)
                LogStore.sendMessage('WS', 'Pong!')
                return;
            } else if (msg.type == 'get' && msg.request == 'manifest') {
              this.post({app: 'server', payload: this.manifest, type: 'manifest'})
              LogStore.sendLog('WS', `Sent manifest to ${this.ipList[this.currentIpIndex]}`)
              return;
            }
          }
          if (!this.listeners[app]) {
            this.listeners[app] = [];
          }
          // console.log('WEBSOCKET', msg)
          this.listeners[app].forEach((listener: SocketEventListener) => listener(msg as SocketData));
        } catch (e) {
          console.error(e);
        }
      };
    }
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

  private startHeartbeat(): void {
    this.missedHeartBeats = 0
    this.live = true
    this.notifyLiveState()

    this.heartbeatInterval = setInterval(() => {
      if (this.is_ready()) {
        this.post({ app: 'server', type: 'heartbeat', payload: null });
      }
    }, 30000); // Send heartbeat every 30 seconds

    this.resetHeartbeatTimeout();
  }

  private resetHeartbeatTimeout(): void {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
    }

    this.heartbeatTimeout = setTimeout(() => {
      this.handleMissedHeartbeat();
    }, 45000); // Wait 45 seconds for a heartbeat response
  }

  private handleMissedHeartbeat(): void {
    LogStore.sendError('WS', 'Missed heartbeat from server ' + (this.missedHeartBeats + 1) + ' / 4');
    if (this.missedHeartBeats >= 3) {
      if (this.webSocket) {
        this.webSocket.close(1000, "Did not receive heartbeat");
        this.notifyLiveState()
      }
      this.stopHeartbeat();
    } else {
      this.missedHeartBeats++;
      if (this.webSocket == null) {
        this.reconnect()
      }
      this.resetHeartbeatTimeout();
      this.notifyLiveState()
    }
  }

  private async notifyLiveState() {
    const { UIStore } = await import('../stores')

    UIStore.getInstance().setScreensaver(!this.live)
  }

  private stopHeartbeat(): void {
    this.live = false
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
    }
  }
}

export default WebSocketService.getInstance()