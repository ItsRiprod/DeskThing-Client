// Opens websocket 8890 so that the carthing doesnt crash
import LogStore from '../stores/logStore';
import socket from './WebSocketService'

type WebSocketControlCallback = (msg: any) => void;

const BASE_URL = 'ws://localhost:8890';

export function create_socket(): WebSocket {
  return new WebSocket(BASE_URL);
}


class WebSocketControl {
  socket_connector: () => WebSocket;
  webSocket: WebSocket;
  listeners: WebSocketControlCallback[] = [];

  constructor(socket_connector: () => WebSocket = create_socket) {
    this.socket_connector = socket_connector;
    this.webSocket = this.socket_connector();
    this.connect(this.webSocket);
  }

  reconnect(): void {
    this.connect(this.socket_connector());
  }

  connect(webSocket: WebSocket): void {
    this.webSocket = webSocket;
    // browser socket, WebSocket IPC transport
    webSocket.onopen = (): void => {
      LogStore.sendMessage('CONTROL', 'Successfully setup!')
      this.registerEventHandler();
    };

    webSocket.onclose = () => {
      this.webSocket.close();
      LogStore.sendMessage('CONTROL', 'Socket Closed!')
      setTimeout(this.reconnect.bind(this), 100000);
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

  registerEventHandler = (): void => {

    this.webSocket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      // Debugging and sending it to the deskthing ui 
      socket.post({app: 'server', type: 'device', payload: event.data})
      this.listeners.forEach((listener: WebSocketControlCallback) => listener(msg));
    };
  };

  post(body: Record<string, any>): void { 
    this.webSocket.send(JSON.stringify(body));
  }

  addSocketEventListener(listener: WebSocketControlCallback) {
    this.listeners.push(listener);
  }
}

const ControlSocket = new WebSocketControl();
export default ControlSocket;
