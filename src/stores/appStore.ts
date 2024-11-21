  import { create } from 'zustand'
  import { App, AppSettings, SocketConfig, SocketData, SocketSettings } from '@src/types'

  interface AppState {
    apps: App[]
    appSettings: AppSettings
    currentApp: App | null
    setApps: (apps: App[]) => void
    setAppSettings: (appSettings: AppSettings) => void
    setCurrentApp: (app: App | null) => void
  }

  export const useAppStore = create<AppState>((set) => ({
    apps: [],
    appSettings: undefined,
    currentApp: null,
    setApps: (apps) => set({ apps }),
    setAppSettings: (appSettings) => set({ appSettings }),
    setCurrentApp: (app) => set({ currentApp: app }),
  }))

export function isSocketApp(data: SocketData): data is SocketConfig {
    return data.app === 'client' && data.type === 'config';
  }
export function isSocketSettings(data: SocketData): data is SocketSettings {
    return data.app === 'client' && data.type === 'settings';
  }