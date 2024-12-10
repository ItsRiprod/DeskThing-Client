
import { create } from 'zustand'
import { Action, ActionReference, ButtonMapping, EventMode, KeyTrigger } from '@src/types/buttons'
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
        executeAction: (action: Action | ActionReference) => void;
        executeKey: (key: string, eventMode: EventMode) => void
        updateIcon: (id: string, icon: string) => void
        getActionUrl: (action: Action | ActionReference) => string
        getKeyUrl: (key: KeyTrigger) => string
        getButtonAction: (key: string, mode: EventMode) => Action | undefined
    }

export const useMappingStore = create<MappingState>((set, get) => ({
    profile: defaults,
  setProfile: (profile) => set({ profile }),

  getButtonAction: (key: string, mode: EventMode) => {
    const profile = get().profile;
    if (profile?.mapping[key] && profile.mapping[key][mode]) {
      const action = profile.mapping[key][mode]
        const mergedAction = {
          ...profile.actions && profile.actions.find(a => a.id === action.id),
          ...action
        }
        return mergedAction

    }
    return undefined;
  },

  executeAction: (action: Action | ActionReference) => {
    // execute action
    const actionHandler = ActionHandler.getInstance()
    actionHandler.runAction(action)
  },

  executeKey: (key: string, eventMode: EventMode) => {
    const profile = get().profile;
    if (profile?.mapping[key] && profile.mapping[key][eventMode]) {
      const action = profile.mapping[key][eventMode];
      if (action && action.enabled) {
        get().executeAction(action);
      }
    }
  },

  getActionUrl: (action: Action | ActionReference) => {
    const manifest = useSettingsStore.getState().manifest;
    const profile = get().profile;
    const { ip, port } = manifest;
    if (action.source === 'server') {

      if (action.id === 'pref') {
        const apps = useAppStore.getState().apps
        const app = apps[action.value || 0]
        if (app) {
          const url = `http://${ip}:${port}/icons/${app.name}/icons/${app.name}.svg?url`;
          return url
        } else {
          const actionIcon = profile?.actions.find(a => a.id === action.id).icon  || action.id
          return new URL(`../../public/icons/${actionIcon}.svg?url`, import.meta.url).href;
        }
      }
      if (action.id === 'open') {
        const keywords = ['utility', 'settings', 'dashboard', 'nowplaying']
        if (keywords.includes(action.value)) {
          const actionIcon = profile?.actions.find(a => a.id === action.id).icon  || action.id
          return new URL(`../../public/icons/${actionIcon}.svg?url`, import.meta.url).href;
        } else {
          const url = `http://${ip}:${port}/icons/${action.value}/icons/${action.value}.svg?url`;
          return url
        }
      }

      const actionIcon = profile?.actions.find(a => a.id === action.id).icon || action.id
      return new URL(`../../public/icons/${actionIcon}.svg?url`, import.meta.url).href;
    } else {
      // Fetch from server
      const actionIcon = profile?.actions.find(a => a.id === action.id).icon || action.id
      return `http://${ip}:${port}/icons/${action.source}/icons/${actionIcon}.svg?url`;
    }
  },

  getKeyUrl: (key: KeyTrigger) => {
    const profile = get().profile;
    const action = profile?.mapping[key.key][key.mode];
    if (action) {
      return get().getActionUrl(action)
    }
    return '';
  },

  updateIcon: (id: string, icon: string) => {

    if (get().profile.actions.find(a => a.id === id)?.icon === icon) {
      return;
    }

    set((state) => {
        if (state.profile) {
            const newProfile = {
                ...state.profile,
                actions: state.profile.actions.map(action => 
                    action.id === id ? { ...action, icon } : action
                )
            }
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