import { isIconUpdate, isSocketAction, isSocketApp, isSocketMapping, isSocketMusic, isSocketSettings, useAppStore, useMappingStore, useMusicStore, useWebSocketStore } from "@src/stores";
import { SocketData, SongData } from "@src/types";
import { useEffect, useState } from "react";

export const WebSocketListener = () => {
    const setProfile = useMappingStore((store) => store.setProfile)
    const updateIcon = useMappingStore((store) => store.updateIcon)
    const setApps = useAppStore((store) => store.setApps)
    const setAppSettings = useAppStore((store) => store.setAppSettings)
    const setSong = useMusicStore((store) => store.setSong)
    const getSong = useMusicStore((store) => store.requestMusicData)
    const exAction = useMappingStore((store) => store.executeAction)
    const [prevTrackName, setPrevTrackName] = useState('')
  
    useEffect(() => {
      const websocketManager = useWebSocketStore.getState();

      const handleSongData = (songData: SongData) => {
        if (songData.track_name != undefined && songData.track_name !== prevTrackName) {
          setPrevTrackName(songData.track_name);
          getSong()
        } 
        setSong({...songData, id: String(Date.now())});
      };

      const messageHandler = (socketData: SocketData) => {
        if (socketData.app !== 'client') return;
        const handlers = {
          config: () => isSocketApp(socketData) && setApps(socketData.payload),
          settings: () => isSocketSettings(socketData) && setAppSettings(socketData.payload),
          button_mappings: () => isSocketMapping(socketData) && setProfile(socketData.payload),
          set: () => isIconUpdate(socketData) && updateIcon(socketData.payload.id, socketData.payload.icon),
          song: () => isSocketMusic(socketData) && handleSongData(socketData.payload),
          action: () => isSocketAction(socketData) && exAction(socketData.payload)
        };

        const handler = handlers[socketData.type as keyof typeof handlers];
        if (handler) handler();
      };

      websocketManager.addListener(messageHandler);
      return () => websocketManager.removeListener(messageHandler);
    }, [setApps, setAppSettings, setProfile, setSong, updateIcon, prevTrackName, getSong, exAction]);
  
    return null;
};