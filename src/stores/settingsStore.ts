import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ClientSettings, log, ViewMode, VolMode } from '@src/types/settings'
interface SettingsState {
  logs: log[]
  settings: ClientSettings
  addLog: (log: log) => void
  clearLogs: () => void
  updateSettings: (settings: Partial<ClientSettings>) => void
  resetSettings: () => void
}

const defaultSettings: ClientSettings = {
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
  device_type: { id: 0, name: '' },
  miniplayer: {
    state: ViewMode.PEEK,
    visible: true,
    position: 'bottom'
  },
  theme: {
    scale: 'medium',
    primary: '#22c55e',
    secondary: '#ffffff',
    background: '#000000',
  },
  volume: VolMode.WHEEL,
  currentView: {name: 'landing'},
  ShowNotifications: true,
  Screensaver: {name: 'default'},
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      logs: [],
      settings: defaultSettings,
      addLog: (log) =>
        set((state) => ({
          logs: [...state.logs, { ...log }]
        })),
      clearLogs: () => set({ logs: [] }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'settings-storage',
      onRehydrateStorage: () => (state) => {
        setTimeout(() => {
          if (window.manifest) {
            state?.updateSettings({...defaultSettings, ...window.manifest})
          }
        }, 100)
      }
    }
  )
)