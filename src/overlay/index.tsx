import { useSettingsStore } from "@src/stores"
import AppTray from "./AppTray"
import Miniplayer from "./Miniplayer"
import NotificationOverlay from "./Notification"
import SelectionWheel from "./SelectionWheel"
import VolumeOverlay from "./Volume"

interface OverlayProps {
    children: React.ReactNode
}

const Overlays: React.FC<OverlayProps> = ({ children }) => {
    const settings = useSettingsStore((store) => store.settings)

    return (
        <div className="flex flex-col w-screen h-screen items-center justify-center">
            <AppTray />
            <NotificationOverlay />
            {settings.volume == 'wheel' && <SelectionWheel />}
            <VolumeOverlay />
            {children}
            <Miniplayer />
        </div>
    )
}

export default Overlays