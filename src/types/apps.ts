export interface AppManifest {
    isAudioSource: boolean
    requires: Array<string>
    label: string
    version: string
    description?: string
    author?: string
    id: string
    isWebApp: boolean
    isScreenSaver?: boolean
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
    manifest?: AppManifest
  }