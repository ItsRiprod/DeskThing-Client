import { IconRefresh } from "@src/assets/Icons"
import { useState } from "react"
import Button from "./Button"

interface SyncProps {
    expanded?: boolean
}

const SyncButton: React.FC<SyncProps> = ({ expanded }) => {
    const [syncing, setIsSyncing] = useState(false)

    const handleSync = () => {
        setIsSyncing(true)
        // TODO: Sync with server
        setTimeout(() => {
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