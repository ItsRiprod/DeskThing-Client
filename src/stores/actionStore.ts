import { create } from 'zustand'

interface ActionState {
  wheelState: boolean
  screensaverActive: boolean
  setScreensaverActive: (state: boolean) => void
  setWheelState: (state: boolean) => void
}

export const useActionStore = create<ActionState>()((set) => ({
  wheelState: false,
  screensaverActive: false,
  setWheelState: (state) => set({ wheelState: state }),
  setScreensaverActive: (state) => set({ screensaverActive: state })
}))