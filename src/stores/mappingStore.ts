
import { create } from 'zustand'
import { Action, ButtonMapping, EventMode } from '@src/types/buttons'
import { WebSocketState } from './websocketStore'
import { SocketData, SocketMappings, SocketSetIcon } from '@src/types'

const initialTrayConfig: ButtonMapping = {
    version: '0.9.1',
    id: 'default',
    name: 'Default Mapping',
    description: 'The Default System Mapping',
    trigger_app: '',
    mapping: {

        Pad1: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'VolUp', id: 'volup', description: 'VolUp', source: 'server', value: '5' }
        },
        Pad2: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'Swipe Left', id: 'swipel', description: 'Goes to left app', source: 'server' }
        },
        Pad3: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'Swipe Right', id: 'swiper', description: 'Goes to right app', source: 'server' }
        },
        Pad4: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'VolDown', id: 'voldown', description: 'VolDown', source: 'server', value: '5' }
        },
        Pad5: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'Hide AppsList', id: 'hidelist', description: 'Hides the apps list', source: 'server' }
        },
        Pad6: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'Show AppsList', id: 'showlist', description: 'Shows the apps list', source: 'server' }
        },
        Pad7: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'Repeat', id: 'repeat', description: 'Repeat', source: 'server' }
        },
        Pad8: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'PlayPause', id: 'play', description: 'Plays or Pauses Audio', source: 'server' }
        },
        Pad9: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'Fullscreen', id: 'fullscreen', description: 'Fullscreens the application', source: 'server' }
        },
        DynamicAction1: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'Repeat', id: 'repeat', description: 'Repeat', source: 'server' }  
        },
        DynamicAction2: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'Shuffle', id: 'shuffle', description: 'Shuffle', source: 'server' }  
        },
        DynamicAction3: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'Rewind', id: 'rewind', description: 'Rewind', source: 'server', value: '15' }
        },
        DynamicAction4: {
            [EventMode.KeyDown]: { name: 'Hidden Button', id: 'hidden', description: 'Hides the button. Has no action', source: 'server', version: '0.9.1', enabled: true, icon: '' }
        },
        Action5: {
            [EventMode.KeyDown]: { name: 'Hidden Button', id: 'hidden', description: 'Hides the button. Has no action', source: 'server', version: '0.9.1', enabled: true, icon: '' }
        },
        Action6: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'PlayPause', id: 'play', description: 'Plays or Pauses Audio', source: 'server' }
        },
        Action7: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'Skip', id: 'skip', description: 'Skip', source: 'server' }
        },
        Digit1: {
            [EventMode.PressShort]: { version: '0.9.1', enabled: true, icon: '', name: 'Pref', id: 'pref', description: 'Changed Pref', source: 'server', value: '1' },
            [EventMode.PressLong]: { version: '0.9.1', enabled: true, icon: '', name: 'Swap', id: 'swap', description: 'Swap', source: 'server', value: '1' }
        },
        Digit2: {
            [EventMode.PressShort]: { version: '0.9.1', enabled: true, icon: '', name: 'Pref', id: 'pref', description: 'Changed Pref', source: 'server', value: '2' },
            [EventMode.PressLong]: { version: '0.9.1', enabled: true, icon: '', name: 'Swap', id: 'swap', description: 'Swap', source: 'server', value: '2' }
        },
        Digit3: {
            [EventMode.PressShort]: { version: '0.9.1', enabled: true, icon: '', name: 'Pref', id: 'pref', description: 'Changed Pref', source: 'server', value: '3' },
            [EventMode.PressLong]: { version: '0.9.1', enabled: true, icon: '', name: 'Swap', id: 'swap', description: 'Swap', source: 'server', value: '3' }
        },
        Digit4: {
            [EventMode.PressShort]: { version: '0.9.1', enabled: true, icon: '', name: 'Pref', id: 'pref', description: 'Changed Pref', source: 'server', value: '4' },
            [EventMode.PressLong]: { version: '0.9.1', enabled: true, icon: '', name: 'Swap', id: 'swap', description: 'Swap', source: 'server', value: '4' }
        },
        KeyM: {
            [EventMode.PressShort]: { version: '0.9.1', enabled: true, icon: '', name: 'Open', id: 'open', description: 'Open View', source: 'server', value: 'dashboard' },
            [EventMode.PressLong]: { version: '0.9.1', enabled: true, icon: '', name: 'Open', id: 'open', description: 'Open View', source: 'server', value: 'utility' }
        },
        Scroll: {
            [EventMode.ScrollRight]: { version: '0.9.1', enabled: true, icon: '', name: 'VolUp', id: 'volup', value: '5', description: 'VolUp', source: 'server' },
            [EventMode.ScrollUp]: { version: '0.9.1', enabled: true, icon: '', name: 'VolUp', id: 'volup', value: '5', description: 'VolUp', source: 'server' },
            [EventMode.ScrollLeft]: { version: '0.9.1', enabled: true, icon: '', name: 'VolDown', id: 'voldown', value: '5', description: 'VolDown', source: 'server' },
            [EventMode.ScrollDown]: { version: '0.9.1', enabled: true, icon: '', name: 'VolDown', id: 'voldown', value: '5', description: 'VolDown', source: 'server' }
        },
        Enter: {
            [EventMode.KeyDown]: { version: '0.9.1', enabled: true, icon: '', name: 'playPause', id: 'play', description: 'PlayPause', source: 'server' },
            [EventMode.PressLong]: { version: '0.9.1', enabled: true, icon: '', name: 'Skip', id: 'skip', description: 'Skip', source: 'server' }
        },
        Escape: {
            [EventMode.PressShort]: { version: '0.9.1', enabled: true, icon: '', name: 'Show AppsList', id: 'show', description: 'Shows the apps list', source: 'server' },
            [EventMode.PressLong]: { version: '0.9.1', enabled: true, icon: '', name: 'Hide AppsList', id: 'hide', description: 'Hides the apps list', source: 'server' }
        },
        Swipe: {
            [EventMode.SwipeUp]: { version: '0.9.1', enabled: true, icon: '', name: 'Hide AppsList', id: 'hidelist', description: 'Hides the apps list', source: 'server' },
            [EventMode.SwipeDown]: { version: '0.9.1', enabled: true, icon: '', name: 'Show AppsList', id: 'showlist', description: 'Shows the apps list', source: 'server' },
            [EventMode.SwipeLeft]: { version: '0.9.1', enabled: true, icon: '', name: 'Swipe Left', id: 'swipel', description: 'Goes to left app', source: 'server' },
            [EventMode.SwipeRight]: { version: '0.9.1', enabled: true, icon: '', name: 'Swipe Right', id: 'swiper', description: 'Goes to right app', source: 'server' },
        }
    }
    };
    
    interface MappingState {
        profile: ButtonMapping | null
        setProfile: (profile: ButtonMapping) => void
        executeAction: (key: string, eventMode: EventMode) => void;
        initialize: (websocketManager: WebSocketState) => void
        updateIcon: (id: string, icon: string) => void
        getButtonAction: (key: string, mode: EventMode) => Action | undefined
    }

export const useMappingStore = create<MappingState>((set, get) => ({
    profile: initialTrayConfig,
  setProfile: (profile) => set({ profile }),
  initialize: (websocketManager) => {
    websocketManager.addListener((socketData) => {
      if (isSocketMapping(socketData)) {
        set({ profile: socketData.payload })
      } else if (isIconUpdate(socketData)) {
        get().updateIcon(socketData.payload.id, socketData.payload.icon)
      }
    })
  },

  getButtonAction: (key: string, mode: EventMode) => {
    const profile = get().profile;
    if (profile?.mapping[key] && profile.mapping[key][mode]) {
      return profile.mapping[key][mode];
    }
    return undefined;
  },

  executeAction: (key: string, eventMode: EventMode) => {
    const profile = get().profile;
    if (profile?.mapping[key] && profile.mapping[key][eventMode]) {
      const action = profile.mapping[key][eventMode];
      if (action && action.enabled) {
        // Execute the action - could be sending a WebSocket message, invoking a function, etc.
        console.log(`Executing action: ${action.name}`);
      }
    }
  },

  updateIcon: (id: string, icon: string) => {
    set((state) => {
      if (state.profile) {
        return {
          ...state,
          mapping: {
            ...state.profile,
            mapping: {
              ...state.profile.mapping,
              [id]: {
                ...state.profile.mapping[id],
                icon,
              },
            },
          },
        }
      }
      return state
    })
  }
}))

function isSocketMapping(data: SocketData): data is SocketMappings {
    return data.app === 'client' && data.type === 'button_mappings';
  }

function isIconUpdate(data: SocketData): data is SocketSetIcon {
    return data.app === 'client' && data.type === 'set' && data.request === 'icon';
  }
