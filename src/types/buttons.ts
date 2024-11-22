export type ButtonMapping = {
    // The ID of the key
    version: string
    version_code: number
    id: string
    name: string
    description?: string
    trigger_app?: string
    mapping: {
      [key: string]: {
        [Mode in EventMode]?: Action
      }
    }
  }

  export enum EventMode {
    KeyUp,
    KeyDown,
    ScrollUp,
    ScrollDown,
    ScrollLeft,
    ScrollRight,
    SwipeUp,
    SwipeDown,
    SwipeLeft,
    SwipeRight,
    PressShort,
    PressLong
  }

  export type Action = {
    name?: string // User Readable name
    description?: string // User Readable description
    id: string // System-level ID
    value?: string // The value to be passed to the action. This is included when the action is triggered
    value_options?: string[] // The options for the value
    value_instructions?: string // Instructions for the user to set the value
    icon?: string // The name of the icon the action uses - if left blank, the action will use the icon's id
    source: string // The origin of the action
    version: string // The version of the action
    version_code: number // The version code of the action
    enabled: boolean // Whether or not the app associated with the action is enabled
  }