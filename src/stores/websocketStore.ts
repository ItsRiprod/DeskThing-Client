import { create } from "zustand";
import WebSocketManager from "../utils/websocketManager";
import { OutgoingSocketData, SocketData } from "@src/types";
import { useSettingsStore } from "./settingsStore";

export interface WebSocketState {
  socketManager: WebSocketManager;
  isConnected: boolean;
  isReconnecting: boolean;
  connect: (url: string) => void;
  disconnect: () => void;
  reconnect: () => void
  send: (message: OutgoingSocketData) => Promise<void>;
  addListener: (listener: (msg: SocketData) => void) => (() => void);
  removeListener: (listener: (msg: SocketData) => void) => void;
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    WebSocketManager.getInstance().disconnect();
  });
}

export const useWebSocketStore = create<WebSocketState>((set, get) => {
  const manager = WebSocketManager.getInstance()

  const manifest = useSettingsStore.getState().manifest
  const wsUrl = `ws://${manifest.ip}:${manifest.port}`

  manager.addStatusListener((status) => {
    set({
      isConnected: status === 'connected',
      isReconnecting: status === 'reconnecting'
    })
  })

  manager.connect(wsUrl)

  useSettingsStore.subscribe((state) => {
    const newWsUrl = `ws://${state.manifest.ip}:${state.manifest.port}`
    if (newWsUrl !== wsUrl) {
      manager.connect(newWsUrl)
    }
  })

  return {
    socketManager: manager,
    isConnected: false,
    isReconnecting: false,

    connect: (url: string) => {
      manager.connect(url);
    },

    disconnect: () => {
      const manager = get().socketManager;
      if (manager) {
        manager.disconnect();
        set({ 
          isConnected: false,
          isReconnecting: false 
        });
      }
    },

    reconnect: () => {
      const manager = get().socketManager
      if (manager) {
        manager.reconnect()
        set({ 
          isConnected: false,
          isReconnecting: true 
        });
      }

    },

    send: async (message: OutgoingSocketData): Promise<void> => {
      const manager = get().socketManager;
      if (manager) {
        await manager.sendMessage(message);
      } else {
        console.error("WebSocket is not connected");
      }
    },

    addListener: (listener: (msg: SocketData) => void): () => void => {
      const manager = get().socketManager;
      if (manager) {
        manager.addListener(listener);
      }
      return () => manager.removeListener(listener)
    },

    removeListener: (listener: (msg: SocketData) => void) => {
      const manager = get().socketManager;
      if (manager) {
        manager.removeListener(listener);
      }
    },
}});

export default useWebSocketStore;