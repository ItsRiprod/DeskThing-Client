export type SongData = {
    album: string | null
    artist: string | null
    playlist: string | null
    playlist_id: string | null
    track_name: string
    shuffle_state: boolean | null
    repeat_state: 'off' | 'all' | 'track' //off, all, track
    is_playing: boolean
    can_fast_forward: boolean // Whether or not there an an option to 'fastforward 30 sec'
    can_skip: boolean
    can_like: boolean
    can_change_volume: boolean
    can_set_output: boolean 
    track_duration: number | null
    track_progress: number | null
    volume: number // percentage 0-100
    thumbnail: string | null //base64 encoding that includes data:image/png;base64, at the beginning
    device: string | null // Name of device that is playing the audio
    id: string | null // A way to identify the current song (is used for certain actions)
    device_id: string | null // a way to identify the current device if needed
    timestamp: number
    liked?: boolean
    color?: color
  }

  interface color {
    value: number[]
    rgb: string
    rgba: string
    hex: string
    hexa: string
    isDark: boolean
    isLight: boolean
    error?: string
  }

  export enum AUDIO_REQUESTS {
    NEXT = "next",
    PREVIOUS = "previous",
    REWIND = "rewind",
    FAST_FORWARD = "fast_forward",
    PLAY = "play",
    PAUSE = "pause",
    SEEK = "seek",
    LIKE = "like",
    SONG = "song",
    VOLUME = "volume",
    REPEAT = "repeat",
    SHUFFLE = "shuffle",
  }