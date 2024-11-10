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
      label: string
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
      miniplayer: string
    }

  export type LOG_TYPES = 'error' | 'message' | 'log' | 'all'

export type log = {
  app: string
  type: LOG_TYPES
  payload: string
}

export type ViewMode = 'hidden' | 'peek' | 'full';