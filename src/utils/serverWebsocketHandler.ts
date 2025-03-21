/**
 * Handles incoming WebSocket data from the server.
 *
 * The `handleServerSocket` function is responsible for dispatching the appropriate handler for the incoming WebSocket data based on the `type` and `request` properties of the `SocketData` object.
 *
 * The available handlers are defined in the `socketHandlers` object, which maps `type` and `request` values to their corresponding handler functions.
 *
 * The currently implemented handlers are:
 * - `get.manifest`: Sends the current application manifest back to the client.
 * - `set.time`: Synchronizes the client's time with the server's time.
 *
 * Additional handlers can be added to the `socketHandlers` object as needed.
 */

import { useAppStore, useMappingStore, useSettingsStore, useWebSocketStore } from '@src/stores'
import { useTimeStore } from '@src/stores/timeStore'
import Logger from './Logger'
import {
  DEVICE_EVENTS,
  FromDeskthingToDevice,
  FromDeskthingToDeviceEvents,
  FromDeviceDataClient,
  DeviceToDeskthing,
  FromDeviceDataEvents,
  SendToDeviceFromServerPayload
} from '@DeskThing/types'

type FromDeskthingPayload<T> = Extract<FromDeskthingToDevice | FromDeviceDataClient, { type: T }>

type SocketHandler = {
  [T in FromDeskthingToDeviceEvents | Partial<FromDeviceDataEvents>]: (
    data: FromDeskthingPayload<T>
  ) => void
}

// TODO: Make this type-safe
const sendData = (data) => {
  const send = useWebSocketStore.getState().send
  send(data)
}

const handleGetManifest = (data: FromDeskthingPayload<FromDeskthingToDeviceEvents.GET>) => {
  switch (data.request) {
    case 'manifest': {
      const manifest = useSettingsStore.getState().manifest

      const returnData: DeviceToDeskthing = {
        type: DEVICE_EVENTS.MANIFEST,
        app: 'server',
        payload: manifest
      }

      Logger.info('Sending manifest', returnData)
      sendData(returnData)

      break
    }
    default:
      Logger.error('Unknown request type: ', data.request)
  }
}

const handleSetTime = (data: FromDeskthingPayload<FromDeviceDataEvents.TIME>) => {
  const syncTime = useTimeStore.getState().syncTime

  if (typeof data.payload === 'string') return // not useful

  if (data.payload.utcTime && data.payload.timezoneOffset) {
    syncTime(data.payload.utcTime, data.payload.timezoneOffset)
  }
}

const HANDLE_GLOBAL_SETTINGS = (
  data: FromDeskthingPayload<FromDeskthingToDeviceEvents.GLOBAL_SETTINGS>
) => {
  const setAppSettings = useAppStore.getState().setAppSettings
  setAppSettings(data.payload)
}
const HANDLE_MAPPINGS = (data: FromDeskthingPayload<FromDeskthingToDeviceEvents.MAPPINGS>) => {
  const setMappings = useMappingStore.getState().setProfile
  setMappings(data.payload)
}
const HANDLE_ERROR = (data: FromDeskthingPayload<FromDeskthingToDeviceEvents.ERROR>) => {
  Logger.error('Received error', data.payload)
}
const HANDLE_PONG = (_data: FromDeskthingPayload<FromDeskthingToDeviceEvents.PONG>) => {
  // do nothing
}
const HANDLE_PING = (_data: FromDeskthingPayload<FromDeskthingToDeviceEvents.PING>) => {
  // do nothing
}
const HANDLE_HEARTBEAT = (_data: FromDeskthingPayload<FromDeskthingToDeviceEvents.HEARTBEAT>) => {
  // do nothing
}
const HANDLE_MANIFEST = (_data: FromDeskthingPayload<FromDeviceDataEvents.MANIFEST>) => {
  // do nothing
}
const HANDLE_MUSIC = (_data: FromDeskthingPayload<FromDeviceDataEvents.MUSIC>) => {
  // dont actually do anything
}
const HANDLE_SETTINGS = (data: FromDeskthingPayload<FromDeviceDataEvents.SETTINGS>) => {
  const updateAppSettings = useAppStore.getState().updateAppSettings
  const { app, ...updatedSettings } = data.payload
  updateAppSettings(app, updatedSettings)
}

const HANDLE_APPS = (data: FromDeskthingPayload<FromDeviceDataEvents.APPS>) => {
  const setApps = useAppStore.getState().setApps
  setApps(data.payload)
}

const HANDLE_ACTION = (_data: FromDeskthingPayload<FromDeviceDataEvents.ACTION>) => {
  // Do nothing
}

const HANDLE_ICON = (data: FromDeskthingPayload<FromDeviceDataEvents.ICON>) => {
  const updateIcon = useMappingStore.getState().updateIcon
  updateIcon(data.payload.action.id, data.payload.icon, data.payload.source)
}

const socketHandlers: SocketHandler = {
  get: handleGetManifest,
  [FromDeviceDataEvents.TIME]: handleSetTime,
  [FromDeskthingToDeviceEvents.GLOBAL_SETTINGS]: HANDLE_GLOBAL_SETTINGS,
  [FromDeskthingToDeviceEvents.MAPPINGS]: HANDLE_MAPPINGS,
  [FromDeskthingToDeviceEvents.ERROR]: HANDLE_ERROR,
  [FromDeskthingToDeviceEvents.PONG]: HANDLE_PONG,
  [FromDeskthingToDeviceEvents.PING]: HANDLE_PING,
  [FromDeskthingToDeviceEvents.HEARTBEAT]: HANDLE_HEARTBEAT,
  [FromDeviceDataEvents.MANIFEST]: HANDLE_MANIFEST,
  [FromDeviceDataEvents.MUSIC]: HANDLE_MUSIC,
  [FromDeviceDataEvents.SETTINGS]: HANDLE_SETTINGS,
  [FromDeviceDataEvents.APPS]: HANDLE_APPS,
  [FromDeviceDataEvents.ACTION]: HANDLE_ACTION,
  [FromDeviceDataEvents.ICON]: HANDLE_ICON
}

export const handleServerSocket = <T extends string>(data: SendToDeviceFromServerPayload<T>) => {
  const handler = socketHandlers[data.type]?.[data.request]

  if (handler) {
    handler(data)
  }
}
