  import { create } from 'zustand'
  import { AllAppSettings, App, AppSettings, OutgoingSocketData, SocketConfig, SocketData, SocketSettings } from '@src/types'
import { useSettingsStore } from './settingsStore'
import useWebSocketStore from './websocketStore'

  interface AppState {
    apps: App[]
    appSettings: AllAppSettings
    setApps: (apps: App[]) => void
    setAppSettings: (appSettings: AllAppSettings) => void
    updateAppSettings: (app: string, appSettings: Partial<AppSettings>) => void
    getAppIcon(app: App): string
    saveSettings(appName: string): void
  }

  export const useAppStore = create<AppState>((set, get) => ({
    apps: [],
    appSettings: undefined,
    setApps: (apps) => set({ apps }),
    setAppSettings: (appSettings) => set({ appSettings }),
    updateAppSettings: (app, appSettings) => {
      set((state) => {
        const updatedAppSettings = {
          ...state.appSettings,
          [app]: { ...state.appSettings[app], ...appSettings }
        }
        return { appSettings: updatedAppSettings }
      })
    },
    saveSettings: async (appName: string) => {
      const send = useWebSocketStore.getState().send
      const settings = get().appSettings[appName]

      for (const [key, value] of Object.entries(settings)) {
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
        await new Promise((resolve) => setTimeout(resolve, 300))
      }
    },
    getAppIcon: (app) => {
      const ip = useSettingsStore.getState().manifest.ip
      const port = useSettingsStore.getState().manifest.port
      return `http://${ip}:${port}/icons/${app.name}/icons/${app.name}.svg`
    }
  }))

export function isSocketApp(data: SocketData): data is SocketConfig {
    return data.app === 'client' && data.type === 'config';
  }
export function isSocketSettings(data: SocketData): data is SocketSettings {
    return data.app === 'client' && data.type === 'settings';
  }