import { Action, ActionReference, EventMode } from "@DeskThing/types"

export type Profile = {
    version: string
    version_code: number
    id: string
    name: string
    description?: string
    trigger_app?: string
    extends?: string
  }
  
  export interface CombinedButtonMapping extends Profile {
    mapping: {
      [key: string]: {
        [Mode in EventMode]?: ActionReference
      }
    },
    actions: Action[]
  }
  