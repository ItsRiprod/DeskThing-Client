import { create } from 'zustand'

interface ActionState {
  wheelState: boolean
  setWheelState: (state: boolean) => void
}

export const useActionStore = create<ActionState>()((set) => ({
  wheelState: false,
  setWheelState: (state) => set({ wheelState: state })
}))