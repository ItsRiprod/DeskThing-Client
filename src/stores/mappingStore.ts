
import { create } from 'zustand'
import { Action, ButtonMapping, EventMode } from '@src/types/buttons'
import { SocketAction, SocketData, SocketMappings, SocketSetIcon } from '@src/types'
import { useSettingsStore } from './settingsStore';
import { useAppStore } from './appStore';
import { defaults } from '../assets/defaultMapping'
import { ActionHandler } from '@src/utils/serverActionHandler';

/**
 * Hey YOU when you go to fix updateIcon remember what needs to be changed:
 * 
 * Button mappings need to be modified so that the key-value doesnt directly connect to the entire action. Rather, it should just have the ID
 * 
 * Then, there needs to be a seperate list of actions that show their "true form" and that way you dont have to update an action in multiple spots
 * 
 * You're basically making a relational database over here 
 */
    interface MappingState {
        profile: ButtonMapping | null
        setProfile: (profile: ButtonMapping) => void
        executeAction: (action: Action) => void;
        executeKey: (key: string, eventMode: EventMode) => void
        updateIcon: (id: string, icon: string) => void
        getActionUrl: (action: Action) => string
        getButtonAction: (key: string, mode: EventMode) => Action | undefined
    }

export const useMappingStore = create<MappingState>((set, get) => ({
    profile: defaults,
  setProfile: (profile) => set({ profile }),

  getButtonAction: (key: string, mode: EventMode) => {
    const profile = get().profile;
    if (profile?.mapping[key] && profile.mapping[key][mode]) {
      return profile.mapping[key][mode];
    }
    return undefined;
  },

  executeAction: (action: Action) => {
    // execute action
    if (action.source == 'server') {
      const actionHandler = ActionHandler.getInstance()
      actionHandler.runAction(action)
    } else {
      console.log(`Executing Non-Server Action:`, action);
    }
  },

  executeKey: (key: string, eventMode: EventMode) => {
    const profile = get().profile;
    if (profile?.mapping[key] && profile.mapping[key][eventMode]) {
      const action = profile.mapping[key][eventMode];
      if (action && action.enabled) {
        // Execute the action - could be sending a WebSocket message, invoking a function, etc.
        console.log(`Executing action: ${action.name}`);
      }
    }
  },

  getActionUrl: (action: Action) => {
    const settings = useSettingsStore.getState().settings;
    const { ip, port } = settings;
    if (action.source === 'server') {

      if (action.id === 'pref') {
        const apps = useAppStore.getState().apps
        const app = apps[action.value || 0]
        if (app) {
          const url = `http://${ip}:${port}/icon/${app.name}/${app.name}.svg`;
          return url
        } else {
          return new URL(`../../public/icons/${action.icon || action.id}.svg`, import.meta.url).href;
        }
      }

      return new URL(`../../public/icons/${action.icon || action.id}.svg`, import.meta.url).href;
    } else {
      return `http://${ip}:${port}/icon/${action.id}/${action.icon || action.id}.svg`;
    }
  },

  updateIcon: (id: string, icon: string) => {
    console.log(`Updating icon for ${id} to ${icon}`);  
    set((state) => {
        if (state.profile) {
            const newProfile = {
                ...state.profile,
                mapping: {
                    ...state.profile.mapping
                }
            }
            // Update the icon for all event modes
            Object.values(EventMode).forEach(mode => {
                if (newProfile.mapping[id]?.[mode]) {
                    newProfile.mapping[id][mode].icon = icon
                }
            })
            return { profile: newProfile }
        }
        return state
    })
}
}))

export function isSocketMapping(data: SocketData): data is SocketMappings {
    return data.app === 'client' && data.type === 'button_mappings';
  }

export function isIconUpdate(data: SocketData): data is SocketSetIcon {
    return data.app === 'client' && data.type === 'set' && data.request === 'icon';
  }

  export function isSocketAction(data: SocketData): data is SocketAction {
    return data.app === 'client' && data.type === 'action';
  }