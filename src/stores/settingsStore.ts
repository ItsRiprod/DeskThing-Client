import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ClientManifest, ClientPreferences, log, ViewMode, VolMode } from '@src/types/settings'
interface SettingsState {
  logs: log[]
  manifest: ClientManifest
  preferences: ClientPreferences
  addLog: (log: log) => void
  clearLogs: () => void
  updateManifest: (settings: Partial<ClientManifest>) => void
  updatePreferences: (preferences: Partial<ClientPreferences>) => void
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
    background: '#000000',
  },
  volume: VolMode.WHEEL,
  currentView: {name: 'landing'},
  ShowNotifications: true,
  Screensaver: {name: 'default'},
  onboarding: false,
  showPullTabs: false,
  saveLocation: true,
  ScreensaverType: {
    version: 1,
    type: 'logo'
  },
  use24hour: false
}

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
      updatePreferences: (newPreferences) => set((state) => ({
        preferences: { ...state.preferences, ...newPreferences }
      })),
      resetPreferences: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: 'settings-storage',
      onRehydrateStorage: () => (state) => {
        setTimeout(() => {
          if (window.manifest) {
            state?.updateManifest({...defaultManifest, ...window.manifest})
          }
          if (!state.preferences) {
            state.updatePreferences(defaultPreferences)
          }
        }, 300)
      }
    }
  )
)