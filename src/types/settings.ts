import { App } from "."

interface SettingsBase {
  type: 'boolean' | 'list' | 'multiselect' | 'number' | 'range' | 'ranked' | 'select' | 'string' | 'color'
  label: string
  description?: string
  disabled?: boolean
}

export interface SettingsNumber extends SettingsBase {
  type: 'number'
  value: number
  min: number
  max: number
  label: string
  description?: string
}

export interface SettingsBoolean extends SettingsBase {
  type: 'boolean'
  value: boolean
  label: string
  description?: string
}

export interface SettingsRange extends SettingsBase {
  type: 'range'
  value: number
  label: string
  min: number
  max: number
  step?: number
  description?: string
}

export interface SettingsString extends SettingsBase {
  type: 'string'
  value: string
  label: string
  maxLength?: number
  description?: string
}

export interface SettingsSelect extends SettingsBase {
  type: 'select'
  value: string
  label: string
  description?: string
  placeholder?: string
  options: SettingOption[]
}

export type SettingOption = {
  label: string
  value: string
}

export interface SettingsRanked extends SettingsBase {
  type: 'ranked'
  value: string[]
  label: string
  description?: string
  options: SettingOption[]
}

export interface SettingsList extends SettingsBase {
  type: 'list'
  value: string[]
  placeholder?: string
  maxValues?: number
  orderable?: boolean
  unique?: boolean
  label: string
  description?: string
  options: SettingOption[]
}

export interface SettingsMultiSelect extends SettingsBase {
  type: 'multiselect'
  value: string[]
  label: string
  description?: string
  placeholder?: string
  options: SettingOption[]
}

export interface SettingsColor extends SettingsBase {
  type: 'color'
  value: string
  label: string
  description?: string
  placeholder?: string
}

export type SettingsType =
| SettingsBoolean
| SettingsList
| SettingsMultiSelect
| SettingsNumber
| SettingsRange
| SettingsRanked
| SettingsSelect
| SettingsString
| SettingsColor
  
  export interface AllAppSettings {
    [key: string]: AppSettings
  }

  export interface AppSettings {
    [key: string]: SettingsType
  }

    export interface ClientManifest {
      name: string
      id: string
      short_name: string
      description: string
      builtFor: string
      reactive: boolean
      author: string
      version: string
      version_code: number
      compatible_server: number[]
      port: number
      ip: string
      device_type: { id: number; name: string }
    }

    export interface ClientPreferences {
      miniplayer?: MiniplayerSettings
      appTrayState: ViewMode
      volume: VolMode
      theme?: Theme
      currentView?: App
      ShowNotifications: boolean
      Screensaver: App
      ScreensaverType: ScreensaverSettings
      onboarding: boolean
      showPullTabs: boolean
      saveLocation: boolean
      use24hour: boolean
    }

    export interface ScreensaverSettings {
      version: number
      type: 'black' | 'logo' | 'clock'
    }

    export interface MiniplayerSettings {
      state: ViewMode,
      visible: boolean
      position: 'bottom' | 'left' | 'right'
    }

    export interface Theme {
      primary: string
      textLight: string
      textDark: string
      icons: string
      background: string
      scale: 'small' | 'medium' | 'large'

    }

  export type LOG_TYPES = 'error' | 'message' | 'log' | 'all'

export type log = {
  app: string
  type: LOG_TYPES
  payload: string
}

export enum VolMode {
  WHEEL = 'wheel',
  SLIDER = 'slider',
  BAR = 'bar'
} 
export enum ViewMode {
  HIDDEN = 'hidden', 
  PEEK = 'peek', 
  FULL = 'full' 
}