import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ClientManifest, ClientPreferences, Theme, ViewMode, VolMode } from '@deskthing/types'
import { Log } from '@src/types'
interface SettingsState {
  logs: Log[]
  manifest: ClientManifest
  preferences: ClientPreferences
  addLog: (log: Log) => void
  clearLogs: () => void
  updateManifest: (settings: Partial<ClientManifest>) => void
  updatePreferences: (preferences: Partial<ClientPreferences>) => void
  updateTheme: (preferences: Partial<Theme>) => void
  resetPreferences: () => void
}

const defaultManifest: ClientManifest = {
  name: '',
  id: '',
  short_name: '',
  description: '',
  builtFor: '',
  reactive: false,
  author: '',
  version: '0.0.1',
  version_code: 1,
  compatible_server: [],
  port: 8891,
  ip: 'localhost',
  device_type: { id: 0, name: '' }
}
const defaultPreferences: ClientPreferences = {
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
    (set) => ({
      logs: [],
      manifest: defaultManifest,
      preferences: defaultPreferences,
      addLog: (log) =>
        set((state) => ({
          logs: [...state.logs, { ...log }]
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
      updateTheme: (newTheme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme: { ...state.preferences.theme, ...newTheme } }
        })),
      resetPreferences: () => set({ preferences: defaultPreferences })
    }),
    {
      name: 'settings-storage',
      onRehydrateStorage: () => (state) => {
        setTimeout(() => {
          if (window.manifest) {
            state?.updateManifest({ ...defaultManifest, ...window.manifest })
          }
          if (!state.preferences) {
            state.updatePreferences(defaultPreferences)
          }
        }, 300)
      }
    }
  )
)
