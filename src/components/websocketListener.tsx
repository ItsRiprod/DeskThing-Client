import { isIconUpdate, isSocketApp, isSocketMapping, isSocketMusic, isSocketSettings, useAppStore, useMappingStore, useMusicStore, useWebSocketStore } from "@src/stores";
import { SocketData } from "@src/types";
import { useEffect } from "react";

export const WebSocketListener = () => {
    const setProfile = useMappingStore((store) => store.setProfile)
    const updateIcon = useMappingStore((store) => store.updateIcon)
    const setApps = useAppStore((store) => store.setApps)
    const setAppSettings = useAppStore((store) => store.setAppSettings)
    const setSong = useMusicStore((store) => store.setSong)

    useEffect(() => {
      const websocketManager = useWebSocketStore.getState();

      const messageHandler = (socketData: SocketData) => {
        console.log(socketData)
        if (socketData.app !== 'client') return;

        const handlers = {
          config: () => isSocketApp(socketData) && setApps(socketData.payload),
          settings: () => isSocketSettings(socketData) && setAppSettings(socketData.payload),
          button_mappings: () => isSocketMapping(socketData) && setProfile(socketData.payload),
          set: () => isIconUpdate(socketData) && updateIcon(socketData.payload.id, socketData.payload.icon),
          song: () => isSocketMusic(socketData) && setSong(socketData.payload)
        };

        const handler = handlers[socketData.type as keyof typeof handlers];
        if (handler) handler();
      };

      websocketManager.addListener(messageHandler);
      return () => websocketManager.removeListener(messageHandler);
    }, [setApps, setAppSettings, setProfile, setSong, updateIcon]);
  
    return null;
};