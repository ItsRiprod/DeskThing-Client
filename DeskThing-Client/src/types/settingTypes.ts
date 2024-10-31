export interface Manifest {
    isAudioSource: boolean
    requires: Array<string>
    label: string
    version: string
    description?: string
    author?: string
    id: string
    isWebApp: boolean
    isLocalApp: boolean
    platforms: Array<string>
    homepage?: string
    repository?: string
  }

export interface App {
    name: string
    enabled: boolean
    running: boolean
    prefIndex: number
    manifest?: Manifest
  }

  export interface SettingsNumber {
  value: number
  type: 'number'
  min: number
  max: number
  label: string
  description?: string
}

export interface SettingsBoolean {
  value: boolean
  type: 'boolean'
  label: string
  description?: string
}

export interface SettingsString {
  value: string
  type: 'string'
  label: string
  description?: string
}

export interface SettingsSelect {
  value: string
  type: 'select'
  label: string
  description?: string
  options: {
    label: string
    value: string
  }[]
}

export interface SettingsMultiSelect {
  value: string[]
  type: 'multiselect'
  label: string
  description?: string
  options: {
    label: string,
    value: string
  }[]
}

export type SettingsType =
  | SettingsNumber
  | SettingsBoolean
  | SettingsString
  | SettingsSelect
  | SettingsMultiSelect

export interface AppSettings {
  [key: string]: SettingsType
}

export interface AppListSettings {
  [app: string]: AppSettings
}

export type Property = 'currentView' | 'appsListMode' | 'miniplayerMode' | 'availableViews' | 'screensaver'

export type ViewMode = 'hidden' | 'peek' | 'full';
