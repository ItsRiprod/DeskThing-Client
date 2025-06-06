import { LOGGING_LEVELS, App, AppSettings, ClientManifest, MiniplayerSettings, Theme, Action, ActionReference, AUDIO_REQUESTS, KeyReference, SongData } from '@deskthing/types'
import { CombinedButtonMapping, Log } from '.'



export type SocketData =
  | SocketAction
  | SocketPingPong
  | SocketSetTime
  | SocketSetIcon
  | SocketGet
  | SocketTime
  | SocketSet
  | SocketSettings
  | SocketMappings
  | SocketConfig
  | SocketLog
  | SocketMiniplayer
  | SocketTheme
  | SocketMusic

export type AppDataRequest =
  | AppDataAction
  | AppDataMusic
  | AppDataSettings
  | AppDataKey
  | AppDataApps
  | AppDataManifest
  | AppTriggerAction
  | AppTriggerKey
  | AppTriggerButton
  | AppTriggerLog

export interface AppTriggerLog extends BaseSocket {
  app: 'client'
  type: 'log'
  request: LOGGING_LEVELS
  payload: {
    message: string,
    data: any[]
  }
}

export interface AppTriggerButton extends BaseSocket {
  app: 'client'
  type: 'button'
  payload: {
    button: string
    flavor: string
    mode: 'KeyDown' | 'KeyUp' | 'Down' | 'Up' | 'Left' | 'Right'
  }
}

export interface AppTriggerAction extends BaseSocket {
  app: 'client'
  type: 'action'
  payload: ActionReference | Action
}

export interface AppTriggerKey extends BaseSocket {
  app: 'client'
  type: 'key'
  payload: KeyReference
}

export interface AppDataAction extends BaseSocket {
  app: 'client'
  type: 'get'
  request: 'action'
  payload: Action
}

export interface AppDataKey extends BaseSocket {
  app: 'client'
  type: 'get'
  request: 'key2' // this is actually 'key' but smth is weird with ts
  payload: KeyReference
}
export interface AppDataMusic extends BaseSocket {
  app: 'client'
  type: 'get'
  request: 'music'
  payload: undefined
}

export interface AppDataSettings extends BaseSocket {
  app: 'client'
  type: 'get'
  request: 'settings'
  payload: undefined
}

export interface AppDataApps extends BaseSocket {
  app: 'client'
  type: 'get'
  request: 'apps'
  payload: undefined
}

export interface AppDataManifest extends BaseSocket {
  app: 'client'
  type: 'get'
  request: 'manifest'
  payload: undefined
}

interface BaseSocket {
  app: 'client' | 'server' | 'music'
  type: string
  request?: string
}

export interface OutgoingSocketAction {
  app: string
  type: 'action'
  request?: string
  payload: Action | ActionReference
}
export interface OutgoingSocketServer {
  app: 'server'
  type: string
  request?: string
  payload?: string | number | { app: string; index: number } | ClientManifest
}

export interface OutgoingSocketMusic {
  app: 'music'
  type: 'set'
  request?: AUDIO_REQUESTS
  payload?: number | string
}

export interface OutgoingSocketSettings {
  app: string
  type: 'set'
  request: 'settings'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: { id: string; value: any }
}

export interface OutgoingSocketLog {
  app: 'server'
  type: 'log'
  payload: Log
}

interface ClientSocket extends BaseSocket {
  app: 'client'
}

export interface SocketPingPong extends ClientSocket {
  type: 'ping' | 'pong'
}

export interface SocketSettings extends ClientSocket {
  type: 'settings'
  payload: Record<string, AppSettings>
}

export interface SocketSet extends ClientSocket {
  type: 'set'
  payload: string | { id: string; icon: string } | { utcTime: number; timezoneOffset: number }
}

export interface SocketSetTime extends ClientSocket {
  type: 'set'
  request: 'time'
  payload: { utcTime: number; timezoneOffset: number }
}

export interface SocketSetIcon extends ClientSocket {
  type: 'set'
  request: 'icon'
  payload: { id: string; icon: string }
}

export interface SocketTime extends ClientSocket {
  type: 'time'
  payload: string
}

export interface SocketGet extends ClientSocket {
  type: 'get'
  payload: string
}

export interface SocketTheme extends ClientSocket {
  type: 'theme'
  payload: Theme
}

export interface SocketMiniplayer extends ClientSocket {
  type: 'miniplayer'
  payload: MiniplayerSettings
}

export interface SocketMappings extends ClientSocket {
  type: 'button_mappings'
  payload: CombinedButtonMapping
}

export interface SocketAction extends ClientSocket {
  type: 'action'
  payload: Action
}

export interface SocketConfig extends ClientSocket {
  type: 'config'
  payload: App[]
}

export interface SocketLog extends ClientSocket {
  type: LOGGING_LEVELS
  payload: string
}

export interface SocketMusic extends ClientSocket {
  type: 'song'
  payload: SongData
}
