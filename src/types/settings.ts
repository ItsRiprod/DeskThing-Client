import { App } from "."

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

export interface SettingsRange {
  value: number
  type: 'range'
  label: string
  min: number
  max: number
  step?: number
  description?: string
}

export interface SettingsString {
  value: string
  type: 'string'
  label: string
  maxLength?: number
  description?: string
}

export interface SettingsSelect {
  value: string
  type: 'select'
  label: string
  description?: string
  placeholder?: string
  options: SettingOption[]
}

export type SettingOption = {
  label: string
  value: string
}

export interface SettingsRanked {
  value: string[]
  type: 'ranked'
  label: string
  description?: string
  options: SettingOption[]
}

/**
 * Not fully implemented yet!
 */
export interface SettingsList {
  value: string[]
  placeholder?: string
  maxValues?: number
  orderable?: boolean
  unique?: boolean
  type: 'list'
  label: string
  description?: string
  options: SettingOption[]
}

export interface SettingsMultiSelect {
  value: string[]
  type: 'multiselect'
  label: string
  description?: string
  placeholder?: string
  options: SettingOption[]
}

export type SettingsType =
  | SettingsNumber
  | SettingsBoolean
  | SettingsString
  | SettingsSelect
  | SettingsMultiSelect
  | SettingsRange
  | SettingsRanked
  | SettingsList
  
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

    export interface ClientSettings extends ClientManifest {
      miniplayer?: MiniplayerSettings
      volume: VolMode
      theme?: Theme
      currentView?: App
      ShowNotifications: boolean
      Screensaver: App
    }

    export interface MiniplayerSettings {
      state: ViewMode,
      visible: boolean
      position: 'bottom' | 'left' | 'right'
    }

    export interface Theme {
      primary: string
      secondary: string
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