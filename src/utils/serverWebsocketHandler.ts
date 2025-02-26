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

import { useSettingsStore, useWebSocketStore } from '@src/stores'
import { useTimeStore } from '@src/stores/timeStore'
import { OutgoingSocketData, SocketData, SocketSetTime } from '@src/types'

type SocketHandler = {
  [type: string]: {
    [request: string]: (data: SocketData) => void
  }
}

const handleGetManifest = () => {
  const send = useWebSocketStore.getState().send
  const manifest = useSettingsStore.getState().manifest
  
  const returnData: OutgoingSocketData = {
    type: 'manifest',
    app: 'server',
    payload: manifest
  }
  console.log('Sending', returnData)
  send(returnData)
}

const handleSetTime = (data: SocketSetTime) => {
  const syncTime = useTimeStore.getState().syncTime
  if (data.payload.utcTime && data.payload.timezoneOffset) {
    syncTime(data.payload.utcTime, data.payload.timezoneOffset)
  }
}

const socketHandlers: SocketHandler = {
  get: {
    manifest: handleGetManifest
    // Add more get handlers here
  },
  set: {
    time: handleSetTime
  }
  // Add more type handlers here
}

export const handleServerSocket = (data: SocketData) => {
  const handler = socketHandlers[data.type]?.[data.request]
  if (handler) {
    handler(data)
  }
}
