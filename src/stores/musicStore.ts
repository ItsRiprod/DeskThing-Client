  import { create } from 'zustand'
  import { AUDIO_REQUESTS, SongData } from '@src/types/musicTypes'
  import { WebSocketState } from './websocketStore'
import { SocketData, SocketMusic } from '@src/types'

  interface MusicState {
    song: SongData | null
    websocketManager: WebSocketState | null
    setSong: (song: SongData) => void
    initialize: (websocketManager: WebSocketState) => void
    requestMusicData: () => void
    next: () => void
    previous: () => void
    rewind: () => void
    fastForward: () => void
    play: () => void
    pause: () => void
    seek: (position: number) => void
    like: () => void
    setVolume: (volume: number) => void
    setRepeat: () => void
    setShuffle: () => void
  }

  export const useMusicStore = create<MusicState>((set, get) => ({
    song: null,
    websocketManager: null,
    setSong: (song) => set({ song }),
    initialize: (websocketManager) => {
      set({ websocketManager })
      websocketManager.addListener((socketData) => {
        if (isSocketMusic(socketData)) {
          set({ song: socketData.payload })
        }
      })
    },

    requestMusicData: () => {
      const websocketManager = get().websocketManager;
      if (websocketManager) {
        websocketManager.sendMessage({ app: 'music', type: 'get', request: AUDIO_REQUESTS.SONG });
      }
    },

    next: () => {
      const websocketManager = get().websocketManager;
      if (websocketManager) {
        websocketManager.sendMessage({ app: 'music', type: 'set', request: AUDIO_REQUESTS.NEXT });
      }
    },

    previous: () => {
      const websocketManager = get().websocketManager;
      if (websocketManager) {
        websocketManager.sendMessage({ app: 'music', type: 'set', request: AUDIO_REQUESTS.PREVIOUS });
      }
    },

    rewind: () => {
      const websocketManager = get().websocketManager;
      if (websocketManager) {
        websocketManager.sendMessage({ app: 'music', type: 'set', request: AUDIO_REQUESTS.REWIND });
      }
    },

    fastForward: () => {
      const websocketManager = get().websocketManager;
      if (websocketManager) {
        websocketManager.sendMessage({ app: 'music', type: 'set', request: AUDIO_REQUESTS.FAST_FORWARD });
      }
    },

    play: () => {
      const websocketManager = get().websocketManager;
      if (websocketManager) {
        websocketManager.sendMessage({ app: 'music', type: 'set', request: AUDIO_REQUESTS.PLAY });
      }
    },

    pause: () => {
      const websocketManager = get().websocketManager;
      if (websocketManager) {
        websocketManager.sendMessage({ app: 'music', type: 'set', request: AUDIO_REQUESTS.PAUSE });
      }
    },

    seek: (position: number) => {
      const websocketManager = get().websocketManager;
      if (websocketManager) {
        websocketManager.sendMessage({ app: 'music', type: 'set', request: AUDIO_REQUESTS.SEEK, payload: position });
      }
    },

    like: () => {
      const websocketManager = get().websocketManager;
      if (websocketManager) {
        websocketManager.sendMessage({ app: 'music', type: 'set', request: AUDIO_REQUESTS.LIKE });
      }
    },

    setVolume: (volume: number) => {
      const websocketManager = get().websocketManager;
      if (websocketManager) {
        websocketManager.sendMessage({ app: 'music', type: 'set', request: AUDIO_REQUESTS.VOLUME, payload: volume });
      }
    },

    setRepeat: () => {
      const websocketManager = get().websocketManager;
      if (websocketManager) {
        websocketManager.sendMessage({ app: 'music', type: 'set', request: AUDIO_REQUESTS.REPEAT });
      }
    },

    setShuffle: () => {
      const websocketManager = get().websocketManager;
      if (websocketManager) {
        websocketManager.sendMessage({ app: 'music', type: 'set', request: AUDIO_REQUESTS.SHUFFLE });
      }
    }
  }))

  function isSocketMusic(data: SocketData): data is SocketMusic {
    return data.app === 'client' && data.type === 'song';
  }