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

export interface Settings {
    [key: string]: {
      [setting: string]: {
        value: string | number;
        label: string;
        options: [
          {
            value: string | number;
            label: string;
          } 
        ]
      };
    };
  }


export type Property = 'currentView' | 'appsListMode' | 'miniplayerMode' | 'availableViews' | 'screensaver'

export type ViewMode = 'hidden' | 'peek' | 'full';
