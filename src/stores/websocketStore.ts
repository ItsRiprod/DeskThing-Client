import { create } from 'zustand'
import { WebSocketManager } from '../utils/websocketManager' 
import { useSettingsStore } from './settingsStore'
import { useMusicStore } from './musicStore'
import { DeviceToDeskthingData, DeskThingToDeviceData, DeskThingToDeviceCore } from '@deskthing/types'
import { useClientStore } from './clientStore'

/**
 * Provides a WebSocket store that manages the connection and communication with a WebSocket server.
 *
 * The store includes the following functionality:
 * - Connecting and disconnecting the WebSocket connection
 * - Reconnecting the WebSocket connection when it is lost
 * - Sending messages to the WebSocket server
 * - Adding and removing listeners for incoming WebSocket messages
 *
 * The store uses the `WebSocketManager` utility class to handle the low-level WebSocket connection and communication.
 * The store also integrates with the `settingsStore` to update the WebSocket connection URL when the settings change.
 */
export interface WebSocketState {
  socketManager: WebSocketManager
  isConnected: boolean
  isReconnecting: boolean
  connect: (url: string) => void
  disconnect: () => void
  reconnect: () => void
  send: (message: DeviceToDeskthingData) => Promise<void>
  addListener: (listener: (msg: DeskThingToDeviceCore & { app?: string }) => void) => () => void
  removeListener: (listener: (msg: DeskThingToDeviceCore & { app?: string }) => void) => void
}

export const useWebSocketStore = create<WebSocketState>((set, get) => {
  
  const manifest = useSettingsStore.getState().manifest
  const connectionId = useClientStore.getState().client.connectionId
  
  const wsUrl = `ws://${manifest.context.ip}:${manifest.context.port}`

  const manager = new WebSocketManager(connectionId, wsUrl)

  manager.addStatusListener((status) => {
    if (status == 'reconnecting') {
      const pause = useMusicStore.getState().pause
      pause()
    }
    set({
      isConnected: status === 'connected',
      isReconnecting: status === 'reconnecting'
    })
  })
  
  manager.connect()

  useSettingsStore.subscribe((state) => {
    const newWsUrl = `ws://${state.manifest.context.ip}:${state.manifest.context.port}`
    if (newWsUrl !== wsUrl) {
      manager.connect(newWsUrl)
    }
  })

  useClientStore.subscribe((state) => {
    if (state.client.connectionId !== manager.getConnectionId()) {
      console.log('status update to', state.client.connectionId)
      manager.setId(state.client.connectionId)
    }
  })

  return {
    socketManager: manager,
    isConnected: false,
    isReconnecting: false,

    connect: (url: string) => {
      manager.connect(url)
    },

    disconnect: () => {
      const manager = get().socketManager
      if (manager) {
        manager.disconnect()
        set({
          isConnected: false,
          isReconnecting: false
        })
      }
    },

    reconnect: () => {
      const manager = get().socketManager
      if (manager) {
        manager.reconnect()
        set({
          isConnected: false,
          isReconnecting: true
        })
      }
    },

    send: async (message: DeviceToDeskthingData): Promise<void> => {
      const manager = get().socketManager
      if (manager) {
        await manager.sendMessage(message)
      } else {
        console.error('WebSocket is not connected')
      }
    },

    addListener: (listener: (msg: DeskThingToDeviceCore & { app?: string }) => void): (() => void) => {
      const manager = get().socketManager
      if (manager) {
        manager.addListener(listener)
      }
      return () => manager.removeListener(listener)
    },

    removeListener: (listener: (msg: DeskThingToDeviceCore & { app?: string }) => void) => {
      const manager = get().socketManager
      if (manager) {
        manager.removeListener(listener)
      }
    }
  }
})

export default useWebSocketStore
