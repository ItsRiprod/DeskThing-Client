// useWebSocketStore.ts
import { create } from "zustand";
import WebSocketManager from "../utils/websocketManager";
import { OutgoingSocketData, SocketData } from "@src/types";

export interface WebSocketState {
  socketManager: WebSocketManager | null;
  isConnected: boolean;
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: (message: OutgoingSocketData) => void;
  addListener: (listener: (msg: SocketData) => void) => void;
  removeListener: (listener: (msg: SocketData) => void) => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socketManager: null,
  isConnected: false,

  connect: (url: string) => {
    const existingManager = get().socketManager;
    if (existingManager) existingManager.disconnect();

    const manager = new WebSocketManager(url);
    manager.connect();

    set({ socketManager: manager, isConnected: true });
  },

  disconnect: () => {
    const manager = get().socketManager;
    if (manager) {
      manager.disconnect();
      set({ socketManager: null, isConnected: false });
    }
  },

  sendMessage: (message: OutgoingSocketData) => {
    const manager = get().socketManager;
    if (manager) {
      manager.sendMessage(message);
    } else {
      console.error("WebSocket is not connected");
    }
  },

  addListener: (listener: (msg: SocketData) => void) => {
    const manager = get().socketManager;
    if (manager) {
      manager.addListener(listener);
    }
  },

  removeListener: (listener: (msg: SocketData) => void) => {
    const manager = get().socketManager;
    if (manager) {
      manager.removeListener(listener);
    }
  },
}));

export default useWebSocketStore;
