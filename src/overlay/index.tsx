import { useSettingsStore } from "@src/stores"
import AppTray from "./AppTray"
import Miniplayer from "./Miniplayer"
import NotificationOverlay from "./Notification"
import SelectionWheel from "./SelectionWheel"
import VolumeOverlay from "./Volume"
import { useActionStore } from "@src/stores/actionStore"

interface OverlayProps {
    children: React.ReactNode
}

const Overlays: React.FC<OverlayProps> = ({ children }) => {
    const wheelState = useActionStore((store) => store.wheelState)
    const settings = useSettingsStore((store) => store.settings)


    return (
        <div className="flex flex-col w-screen h-screen items-center justify-center">
            <AppTray />
            <NotificationOverlay />
            {wheelState && <SelectionWheel />}
            <VolumeOverlay />
            {children}
            {settings.miniplayer.visible && <Miniplayer />}
        </div>
    )
}

export default Overlays