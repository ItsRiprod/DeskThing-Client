import { Action, ActionReference, AllAppSettings, App, AUDIO_REQUESTS, ButtonMapping, ClientManifest, LOG_TYPES, MiniplayerSettings, SongData, Theme } from "."
  
export type SocketData = SocketAction | SocketPingPong | SocketSetIcon | SocketGet | SocketSet | SocketSettings | SocketMappings | SocketConfig | SocketLog | SocketMiniplayer | SocketTheme | SocketMusic

export type OutgoingSocketData = OutgoingSocketAction | OutgoingSocketServer | OutgoingSocketMusic | OutgoingSocketSettings

interface BaseSocket {
  app: 'client' | 'server' | 'music';
  type: string
  request?: string;
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
    payload?: string | number | { app: string, index: number } | ClientManifest
}  

export interface OutgoingSocketMusic {
  app: 'music'
  type: string
  request?: AUDIO_REQUESTS
  payload?: number
}

export interface OutgoingSocketSettings {
  app: string
  type: 'set'
  request: 'settings'
  payload?: { id: string, value: any}
}

interface ClientSocket extends BaseSocket {
  app: 'client';
}

export interface SocketPingPong extends ClientSocket {
  type: 'ping' | 'pong'
}

export interface SocketSettings extends ClientSocket {
  type: 'settings'
  payload: AllAppSettings
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

export interface SocketAction extends ClientSocket {
  type: 'action'
  payload: Action
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