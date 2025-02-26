import { useSettingsStore, useWebSocketStore } from '@src/stores'
import AppTray from './AppTray'
import Miniplayer from './Miniplayer/Miniplayer'
import NotificationOverlay from './Notification'
import SelectionWheel from './SelectionWheel'
import VolumeOverlay from './Volume'
import { useActionStore } from '@src/stores/actionStore'
import { useEffect, useState } from 'react'
import { ServerStatus } from './ConnectionStatus'
import YouAreHere from './YouAreHere'
import ScreenSaverWrapper from './ScreenSaver/ScreenSaverWrapper'

interface OverlayProps {
  children: React.ReactNode
}

/**
 * The `Overlays` component is a React functional component that renders various overlays and UI elements on top of the main application content.
 * 
 * It manages the state and visibility of the following overlays:
 * - AppTray
 * - Miniplayer
 * - NotificationOverlay
 * - VolumeOverlay
 * - SelectionWheel
 * - YouAreHere
 * 
 * The component also adjusts the height and margin of the main content based on the user's preferences, such as the theme scale and miniplayer visibility.
 */
const Overlays: React.FC<OverlayProps> = ({ children }) => {
  const wheelState = useActionStore((store) => store.wheelState)
  const preferences = useSettingsStore((store) => store.preferences)
  const isConnected = useWebSocketStore((state) => state.isConnected)
  const [showHelp, setShowHelp] = useState(true)
  const [height, setHeight] = useState('mb-16')
  const [margin, setMargin] = useState(true)
  useEffect(() => {
    setHeight(
      preferences.theme.scale == 'small'
        ? 'pb-16'
        : preferences.theme.scale == 'medium'
          ? 'pb-32'
          : 'pb-48'
    )
    setMargin(preferences.miniplayer.state == 'hidden' ? false : true)
  }, [preferences])

  return (
    <div className="flex bg-black flex-col w-screen max-h-screen h-screen items-center justify-end">
      {!preferences.onboarding || <AppTray />}
      <ServerStatus />
      <NotificationOverlay />
      <VolumeOverlay />
      {!isConnected && <ScreenSaverWrapper />}
      {showHelp && <YouAreHere setShow={setShowHelp} />}
      {wheelState && <SelectionWheel />}
      <div
        className={`h-full w-full transition-[padding] ${preferences.onboarding && preferences.miniplayer.visible && margin && height}`}
      >
        {preferences.appTrayState != 'full' && children}
      </div>
      {preferences.miniplayer.visible && preferences.onboarding && <Miniplayer />}
    </div>
  )
}

export default Overlays
