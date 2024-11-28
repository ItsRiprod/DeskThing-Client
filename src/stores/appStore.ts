  import { create } from 'zustand'
  import { AllAppSettings, App, AppSettings, OutgoingSocketData, SocketConfig, SocketData, SocketSettings } from '@src/types'
import { useSettingsStore } from './settingsStore'
import useWebSocketStore from './websocketStore'

  interface AppState {
    apps: App[]
    appSettings: AllAppSettings
    currentApp: App | null
    setApps: (apps: App[]) => void
    setAppSettings: (appSettings: AllAppSettings) => void
    updateAppSettings: (app: string, appSettings: Partial<AppSettings>) => void
    setCurrentApp: (app: App | null) => void
    getAppIcon(app: App): string
    saveSettings(appName: string): void
  }

  export const useAppStore = create<AppState>((set, get) => ({
    apps: [],
    appSettings: undefined,
    currentApp: null,
    setApps: (apps) => set({ apps }),
    setAppSettings: (appSettings) => set({ appSettings }),
    setCurrentApp: (app) => set({ currentApp: app }),
    updateAppSettings: (app, appSettings) => {
      set((state) => {
        const updatedAppSettings = {
          ...state.appSettings,
          [app]: { ...state.appSettings[app], ...appSettings }
        }
        return { appSettings: updatedAppSettings }
      })
    },
    saveSettings: (appName: string) => {
      const send = useWebSocketStore.getState().send
      const settings = get().appSettings[appName]

      Object.entries(settings).map(([key, value]) => {
        console.log(`Updating setting ${key} to ${value.value}`)
        const data: OutgoingSocketData = {
          app: appName,
          type: 'set',
          request: 'settings',
          payload: {
            id: key,
            value: value.value
          }
        }
        send(data)
      })
    },
    getAppIcon: (app) => {
      const ip = useSettingsStore.getState().manifest.ip
      const port = useSettingsStore.getState().manifest.port
      return `http://${ip}:${port}/icon/${app.name}/${app.name}.svg`
    }
  }))

export function isSocketApp(data: SocketData): data is SocketConfig {
    return data.app === 'client' && data.type === 'config';
  }
export function isSocketSettings(data: SocketData): data is SocketSettings {
    return data.app === 'client' && data.type === 'settings';
  }