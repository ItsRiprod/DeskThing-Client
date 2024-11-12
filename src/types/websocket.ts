import { Action, App, AppSettings, AUDIO_REQUESTS, ButtonMapping, LOG_TYPES, MiniplayerSettings, SongData, Theme } from "."
  
export type SocketData = SocketSetIcon | SocketGet | SocketSet | SocketSettings | SocketMappings | SocketConfig | SocketLog | SocketMiniplayer | SocketTheme | SocketMusic

export type OutgoingSocketData = OutgoingSocketAction | OutgoingSocketServer | OutgoingSocketMusic

interface BaseSocket {
  app: 'client' | 'server' | 'music';
  type: string;
  request?: string;
}

export interface OutgoingSocketAction {
  app: string
  type: 'action'
  payload: Action
}
export interface OutgoingSocketServer {
    app: 'server'
    type: string
    request?: string
    payload?: string | number | { app: string, index: number }
}  

export interface OutgoingSocketMusic {
  app: 'music'
  type: string
  request?: AUDIO_REQUESTS
  payload?: number
}

interface ClientSocket extends BaseSocket {
  app: 'client';
}

export interface SocketSettings extends ClientSocket {
  type: 'settings'
  payload: AppSettings
}

export interface SocketSet extends ClientSocket {
  type: 'set'
  payload: string | {id: string, icon: string}
}

export interface SocketSetIcon extends ClientSocket {
  type: 'set'
  request: 'icon'
  payload: {id: string, icon: string}
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
  payload: ButtonMapping
}

export interface SocketConfig extends ClientSocket {
  type: 'config'
  payload: App[]
}

export interface SocketLog extends ClientSocket {
  type: LOG_TYPES
  payload: string
}

export interface SocketMusic extends ClientSocket {
  type: 'song'
  payload: SongData
}