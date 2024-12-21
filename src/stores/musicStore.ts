  import { create } from 'zustand'
  import { AUDIO_REQUESTS, SongData } from '@src/types/musicTypes'
  import useWebSocketStore from './websocketStore'
import { SocketData, SocketMusic } from '@src/types'
import { useMappingStore } from './mappingStore'

  export interface MusicState {
    song?: SongData | null
    setSong: (song: SongData) => void
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
    setRepeat: (state: 'off' | 'all' | 'track') => void
    setShuffle: () => void
  }

  export const useMusicStore = create<MusicState>((set, get) => ({
      song: null,
      setSong: (newData) => {
        console.log('Received song')
        const currentSong = get().song
      
        if (!currentSong) {
          set({ song: newData })
          return
        }

        const hasChanges = Object.keys(newData).some(key => newData[key] !== currentSong[key])

        if (hasChanges) {
          set({ song: { ...currentSong, ...newData } })
        }

      const updateIcons = async () => {
        const updateIcon = useMappingStore.getState().updateIcon;
        newData?.is_playing !== undefined && updateIcon('play', newData?.is_playing ? 'pause' : '');
        newData?.repeat_state !== undefined && updateIcon('repeat', newData?.repeat_state == 'all' ? 'repeatActive' : newData?.repeat_state == 'off' ? 'repeatDisabled' : '');
        newData?.shuffle_state !== undefined && updateIcon('shuffle', newData?.shuffle_state ? '' : 'shuffleDisabled');
      }

      updateIcons();

    },

    requestMusicData: () => {
      createWSAction(AUDIO_REQUESTS.SONG, 'get');
    },

    next: () => {
      const previousState = get().song;
      set({ song: { ...previousState, track_progress: 0 } });
      createWSAction(AUDIO_REQUESTS.NEXT, 'set', previousState.id).catch(() => {
        set({ song: previousState });
      });
    },

    previous: () => {
      const previousState = get().song;
      set({ song: { ...previousState, track_progress: 0 } });
      createWSAction(AUDIO_REQUESTS.PREVIOUS).catch(() => {
        set({ song: previousState });
      });
    },

    rewind: () => {
      const previousState = get().song;
      set({ song: { ...previousState, track_progress: Math.min(previousState.track_progress - 15000, 0) } });
      createWSAction(AUDIO_REQUESTS.REWIND).catch(() => {
        set({ song: previousState });
      });
    },

    fastForward: () => {
      const previousState = get().song;
      set({ song: { ...previousState, track_progress: previousState.track_progress + 15000 } });
      createWSAction(AUDIO_REQUESTS.FAST_FORWARD).catch(() => {
        set({ song: previousState });
      });
    },
    
    play: () => {
      const previousState = get().song;
      set({ song: { ...previousState, is_playing: !previousState?.is_playing || false } });
      createWSAction(AUDIO_REQUESTS.PLAY).catch(() => {
        set({ song: previousState });
      });
    },

    pause: () => {
      const previousState = get().song;
      set({ song: { ...previousState, is_playing: false } });
      createWSAction(AUDIO_REQUESTS.PAUSE).catch(() => {
        set({ song: previousState });
      });
    },

    seek: (position: number) => {
      const previousState = get().song;
      set({ song: { ...get().song, track_progress: position } });
      createWSAction(AUDIO_REQUESTS.SEEK, 'set', position).catch(() => {
        set({ song: previousState });
      });
    },

    like: () => {
      const previousState = get().song;
      set({ song: { ...previousState, liked: !previousState.liked } });
      createWSAction(AUDIO_REQUESTS.LIKE).catch(() => {
        set({ song: previousState });
      });
    },

    setVolume: (volume: number) => {
      const previousState = get().song;
      set({ song: { ...get().song, volume: volume } });
      createWSAction(AUDIO_REQUESTS.VOLUME, 'set', volume).catch(() => {
        set({ song: previousState });
      });
    },

    setRepeat: (state: 'off' | 'all' | 'track') => {
      const previousState = get().song;
      set({ song: { ...previousState, repeat_state: state } });
      createWSAction(AUDIO_REQUESTS.REPEAT).catch(() => {
        set({ song: previousState });
      });
    },

    setShuffle: () => {
      const previousState = get().song;
      set({ song: { ...previousState, shuffle_state: !previousState.shuffle_state } });
      createWSAction(AUDIO_REQUESTS.SHUFFLE).catch(() => {
        set({ song: previousState });
      });
    }
  }))
    let debounceTimers: { [key in AUDIO_REQUESTS]?: NodeJS.Timeout } = {};

    const createWSAction = async (request: AUDIO_REQUESTS, type: 'get' | 'set' = 'set', payload?: number | string): Promise<void> => {
      try {
        const send = useWebSocketStore.getState().send;
      
        // Clear any existing timeout for this request type
        if (debounceTimers[request]) {
          clearTimeout(debounceTimers[request]);
          console.log(`Cleared timeout for ${request}`);
        }

        // Set a new timeout
        debounceTimers[request] = setTimeout(() => {
          send({ app: 'music', type, request, payload });
          delete debounceTimers[request];
        }, 300); // 100ms debounce delay
      } catch (error) {
        throw error;
      }
    }

export  function isSocketMusic(data: SocketData): data is SocketMusic {
    return data.app === 'client' && data.type === 'song';
  }