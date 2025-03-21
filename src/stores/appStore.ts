import { create } from 'zustand'
import {
  AppSettings,
  App,
  SocketData,
  DeviceToDeskthing,
  DEVICE_EVENTS
} from '@deskthing/types'
import { SocketConfig, SocketSettings } from '@src/types'
import { useSettingsStore } from './settingsStore'
import useWebSocketStore from './websocketStore'

interface AppState {
  apps: App[]
  appSettings: Record<string, AppSettings>
  setApps: (apps: App[]) => void
  setAppSettings: (appSettings: Record<string, AppSettings>) => void
  updateAppSettings: (app: string, appSettings: Partial<AppSettings>) => void
  getAppIcon(app: App): string
  saveSettings(appName: string): void
}

/**
 * The `useAppStore` is a Zustand store that manages the state of the application, including the list of installed apps, their settings, and related functionality.
 *
 * The store provides the following functionality:
 * - `setApps`: Sets the list of installed apps.
 * - `setAppSettings`: Sets the application settings for all installed apps.
 * - `updateAppSettings`: Updates the settings for a specific app.
 * - `saveSettings`: Saves the settings for a specific app by sending the updated settings over a WebSocket connection.
 * - `getAppIcon`: Retrieves the URL for the icon of a specific app.
 *
 * The store also exports two helper functions, `isSocketApp` and `isSocketSettings`, which can be used to determine the type of a `SocketData` object.
 */
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

    const data: DeviceToDeskthing = {
      app: appName,
      type: DEVICE_EVENTS.SETTINGS,
      request: 'set',
      payload: settings
    }
    send(data)
  },
  getAppIcon: (app) => {
    const ip = useSettingsStore.getState().manifest.ip
    const port = useSettingsStore.getState().manifest.port
    return `http://${ip}:${port}/icons/${app.name}/icons/${app.name}.svg`
  }
}))

export function isSocketApp(data: SocketData): data is SocketConfig {
  return data.app === 'client' && data.type === 'config'
}
export function isSocketSettings(data: SocketData): data is SocketSettings {
  return data.app === 'client' && data.type === 'settings'
}
