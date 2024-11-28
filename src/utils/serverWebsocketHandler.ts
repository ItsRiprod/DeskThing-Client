import { useSettingsStore, useWebSocketStore } from "@src/stores";
import { OutgoingSocketData, SocketData } from "@src/types";


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

const socketHandlers = {
    get: {
        manifest: handleGetManifest,
        // Add more get handlers here
    },
    // Add more type handlers here
};

export const handleServerSocket = (data: SocketData) => {
    const handler = socketHandlers[data.type]?.[data.request];
    if (handler) {
        handler();
    }
}