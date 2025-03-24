import {
  ClientManifest,
  ClientConnectionMethod,
  ClientPlatformIDs,
  ClientConfigurations,
  ViewMode,
  VolMode,
  Client
} from '@DeskThing/types'
import { create } from 'zustand'
import { useSettingsStore } from './settingsStore'
import { useMappingStore } from './mappingStore'

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
  version: '0.0.1',
  compatibility: {
    server: '>=0.10.0',
    app: '>=0.0.1'
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
 * Will get filled in by the server
 */
const defaultClient: Client = {
  id: '',
  connectionId: 'unspecified-id',
  connected: false,
  timestamp: 0,

  currentConfiguration: defaultPreferences,
  currentProfileID: 'unset',

  manifest: defaultManifest
}

export interface ClientState {
  client: Client
  updateClient: (client: Partial<Client>) => void
  updateConfiguration: (config: Partial<ClientConfigurations>) => void
  updateProfileId: (profileId: string) => void
  updateConnectionStatus: (connected: boolean) => void
  resetClient: () => void
}

export const useClientStore = create<ClientState>()((set, get) => ({
  client: defaultClient,
  updateClient: (newClient) => {
    if (newClient.currentConfiguration && newClient.currentConfiguration.profileId !== get().client.currentProfileID) {
      const updatePreferences = useSettingsStore.getState().updatePreferences
      updatePreferences(newClient.currentConfiguration)
    }

    if (newClient.currentMapping && newClient.currentMapping.profileId !== get().client.currentMappingID) {
        const setProfile = useMappingStore.getState().setProfile
        setProfile(newClient.currentMapping)
    }

    
    console.log('status update to', newClient.connectionId)

    set((state) => ({
      client: { ...state.client, ...newClient, currentConfiguration: undefined, currentMapping: undefined }
    }))
  },
  updateConfiguration: (newConfig) =>
    set((state) => ({
      client: {
        ...state.client,
        currentConfiguration: { ...state.client.currentConfiguration, ...newConfig }
      }
    })),
  updateProfileId: (profileId) =>
    set((state) => ({
      client: { ...state.client, currentProfileID: profileId }
    })),
  updateConnectionStatus: (connected) =>
    set((state) => ({
      client: { ...state.client, connected, timestamp: Date.now() }
    })),
  resetClient: () => set({ client: defaultClient })
}))
