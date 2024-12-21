import { useSettingsStore, useWebSocketStore } from "@src/stores";
import { useTimeStore } from "@src/stores/timeStore";
import { OutgoingSocketData, SocketData, SocketSetTime } from "@src/types";

type SocketHandler = {
    [type: string]: {
      [request: string]: (data: SocketData) => void;
    };
  };

const handleGetManifest = () => {
    const send = useWebSocketStore.getState().send;
    const manifest = useSettingsStore.getState().manifest;

    const returnData: OutgoingSocketData = {
        type: 'manifest',
        app: 'server',
        payload: manifest
    };
    console.log('Sending', returnData);
    send(returnData);
}

const handleSetTime = (data: SocketSetTime) => {
    const syncTime = useTimeStore.getState().syncTime;
          if (data.payload.utcTime && data.payload.timezoneOffset) {
            
              syncTime(data.payload.utcTime, data.payload.timezoneOffset);
          }
  }

const socketHandlers: SocketHandler = {
    get: {
        manifest: handleGetManifest,
        // Add more get handlers here
    },
    set: {
        time: handleSetTime,
    }
    // Add more type handlers here
};

export const handleServerSocket = (data: SocketData) => {
    const handler = socketHandlers[data.type]?.[data.request];
    if (handler) {
        handler(data);
    }
}