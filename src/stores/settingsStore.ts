import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  App,
  Client,
  ClientConfigurations,
  ClientConnectionMethod,
  ClientManifest,
  ClientPlatformIDs,
  DEVICE_DESKTHING,
  Log,
  Theme,
  ViewMode,
  VolMode
} from '@deskthing/types'
import useWebSocketStore from './websocketStore'
export interface SettingsState {
  logs: Log[]
  manifest: ClientManifest
  preferences: ClientConfigurations
  addLog: (log: Log) => void
  clearLogs: () => void
  updateManifest: (settings: Partial<ClientManifest>) => void
  updatePreferences: (preferences: Partial<ClientConfigurations>) => void
  updateCurrentView: (view: App) => void
  updateTheme: (preferences: Partial<Theme>) => void
  resetPreferences: () => void
}

const defaultManifest: ClientManifest = {
  name: '',
  id: '',
  short_name: '',
  description: '',
  context: {
    method: ClientConnectionMethod.Unknown,
    id: ClientPlatformIDs.Unknown,
    name: 'Unknown Connection Method',
    ip: 'localhost',
    port: 8891
  },
  reactive: false,
  author: '',
  version: '0.11.0',
  compatibility: {
    server: '>=0.11.0',
    app: '>=0.10.0'
  },
  repository: ''
}

const defaultPreferences: ClientConfigurations = {
  profileId: 'unset',
  version: '0.11.0',
  miniplayer: {
    state: ViewMode.PEEK,
    visible: true,
    position: 'bottom'
  },
  appTrayState: ViewMode.PEEK,
  theme: {
    scale: 'medium',
    primary: '#22c55e',
    textLight: '#ffffff',
    textDark: '#000000',
    icons: '#ffffff',
    background: '#000000'
  },
  volume: VolMode.WHEEL,
  currentView: {
    name: 'landing',
    enabled: true,
    running: true,
    timeStarted: 0,
    prefIndex: 0
  },
  ShowNotifications: true,
  Screensaver: {
    name: 'default',
    enabled: true,
    running: true,
    timeStarted: 0,
    prefIndex: 0
  },
  onboarding: false,
  showPullTabs: false,
  saveLocation: true,
  ScreensaverType: {
    version: 1,
    type: 'clock'
  },
  use24hour: false
}

/**
 * Provides a state management store for the application's settings, including logs, manifest, and preferences.
 * The store uses the `zustand` library with the `persist` middleware to save and restore the state.
 * The store includes methods to manage the logs, update the manifest and preferences, and reset the preferences to their default values.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      logs: [],
      manifest: defaultManifest,
      preferences: defaultPreferences,
      addLog: (log) =>
        set((state) => ({
          logs: [...state.logs.slice(-99), { ...log }]
        })),
      clearLogs: () => set({ logs: [] }),
      updateManifest: (newSettings) =>
        set((state) => ({
          manifest: { ...state.manifest, ...newSettings }
        })),
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        })),
      updateCurrentView: (newView) => {
        const send = useWebSocketStore.getState().send
        send({
          app: 'server',
          type: DEVICE_DESKTHING.VIEW,
          request: 'change',
          payload: {
            currentApp: newView.name,
            previousApp: get().preferences.currentView.name
          }
        })
        set((state) => ({
          preferences: { ...state.preferences, currentView: newView }
        }))
      },
      updateTheme: (newTheme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme: { ...state.preferences.theme, ...newTheme } }
        })),
      resetPreferences: () => set({ preferences: defaultPreferences })
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        manifest: state.manifest,
        preferences: state.preferences
      }),
      onRehydrateStorage: () => (state) => {
        if (state.manifest?.version != defaultManifest.version) {
          state?.updateManifest(defaultManifest)
        }
        setTimeout(() => {
          if (window.manifest) {
            console.log('manifest loaded', window.manifest)
            state?.updateManifest({ ...defaultManifest, ...window.manifest })
          }
          if (!state.preferences) {
            state.updatePreferences(defaultPreferences)
          }
        }, 2000)
      }
    }
  )
)