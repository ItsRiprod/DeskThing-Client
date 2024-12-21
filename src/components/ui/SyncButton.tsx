import { IconRefresh } from "@src/assets/Icons"
import { useState } from "react"
import Button from "./Button"
import { useSettingsStore } from "@src/stores"

interface SyncProps {
    expanded?: boolean
}

const SyncButton: React.FC<SyncProps> = ({ expanded }) => {
    const [syncing, setIsSyncing] = useState(false)
    const setPreferences = useSettingsStore(((state) => state.updatePreferences))
    const handleSync = () => {
        setIsSyncing(true)
        // TODO: Sync with server
        setPreferences({
            onboarding: false,
        })
        setTimeout(() => {
            setPreferences({
                onboarding: true,
                currentView: { name: 'dashboard' }
            })
            setIsSyncing(false)
        }, 1000)
    }
    
    return (
        <Button className="w-fit border-2 mt-5 md:mt-0 border-cyan-500 items-center" onClick={handleSync}>
            <IconRefresh className={`${syncing &&  'animate-spin'}`} />
            <p className={`${expanded ? 'w-fit' : 'w-0'} text-nowrap text-2xl font-semibold mx-2 overflow-hidden transition-[width]`}>
                Sync With Server
            </p>
        </Button>
    )
}

export default SyncButton