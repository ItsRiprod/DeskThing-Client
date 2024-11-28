import { useSettingsStore } from "@src/stores"
import AppTray from "./AppTray"
import Miniplayer from "./Miniplayer"
import NotificationOverlay from "./Notification"
import SelectionWheel from "./SelectionWheel"
import VolumeOverlay from "./Volume"
import { useActionStore } from "@src/stores/actionStore"
import { useEffect, useState } from "react"
import { ServerStatus } from "./ConnectionStatus"

interface OverlayProps {
    children: React.ReactNode
}

const Overlays: React.FC<OverlayProps> = ({ children }) => {
    const wheelState = useActionStore((store) => store.wheelState)
    const preferences = useSettingsStore((store) => store.preferences)
    const [height, setHeight] = useState('mb-16')
    const [margin, setMargin] = useState(true)
    useEffect(() => {
        setHeight(preferences.theme.scale == 'small' ? 'pb-16' : preferences.theme.scale == 'medium' ? 'pb-32' : 'pb-48')
        setMargin(preferences.miniplayer.state == 'hidden' ? false : true)
    }, [preferences])

    return (
        <div className="flex bg-black flex-col w-screen max-h-screen h-screen items-center justify-end">
            <AppTray />
            <ServerStatus />
            <NotificationOverlay />
            <VolumeOverlay />
            {wheelState && <SelectionWheel />}
            <div className={`h-full w-full transition-[padding] ${preferences.miniplayer.visible && margin && height}`}>
                {children}
            </div>
            {preferences.miniplayer.visible && <Miniplayer />}
        </div>
    )
}

export default Overlays