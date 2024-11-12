  import { create } from 'zustand'
  import { App, AppSettings, SocketConfig, SocketData, SocketSettings } from '@src/types'
import { WebSocketState } from './websocketStore'

  interface AppState {
    apps: App[]
    appSettings: AppSettings
    currentApp: App | null
    setApps: (apps: App[]) => void
    setCurrentApp: (app: App | null) => void
    initialize: (websocketManager: WebSocketState) => void
  }

  export const useAppStore = create<AppState>((set) => ({
    apps: [],
    appSettings: undefined,
    currentApp: null,
    setApps: (apps) => set({ apps }),
    setCurrentApp: (app) => set({ currentApp: app }),
    initialize: (websocketManager) => {
      websocketManager.addListener((socketData) => {
        if (isSocketApp(socketData)) {
          set({ apps: socketData.payload })
        } else if (isSocketSettings(socketData)) {
          set({ appSettings: socketData.payload })
        }
      })
    }
  }))

function isSocketApp(data: SocketData): data is SocketConfig {
    return data.app === 'client' && data.type === 'config';
  }
function isSocketSettings(data: SocketData): data is SocketSettings {
    return data.app === 'client' && data.type === 'settings';
  }