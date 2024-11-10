import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ClientSettings, log } from '@src/types/settings'

interface SettingsState {
  logs: log[]
  settings: ClientSettings
  addLog: (log: Omit<log, 'app'>) => void
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
  port: 8000,
  ip: 'localhost',
  device_type: { id: 0, name: '' },
  miniplayer: 'default'
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      logs: [],
      settings: defaultSettings,
      addLog: (log) =>
        set((state) => ({
          logs: [...state.logs, { ...log, app: 'system' }]
        })),
      clearLogs: () => set({ logs: [] }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      resetSettings: () => set({ settings: defaultSettings })
    }),
    {
      name: 'settings-storage'
    }
  )
)