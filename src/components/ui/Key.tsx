import { useMappingStore } from "@src/stores"
import { EventMode } from "@src/types"
import ActionComponent from "./Action"
import { useEffect, useState } from "react"

interface KeyProps {
    keyId: string
    className?: string
  }

const Key: React.FC<KeyProps> = ({ keyId, className }) => {
    const getButtonAction = useMappingStore((store) => store.getButtonAction)
    const profile = useMappingStore((store) => store.profile)
    const [action, setAction] = useState(getButtonAction(keyId, EventMode.KeyDown))
    
    useEffect(() => {
        const action = getButtonAction(keyId, EventMode.KeyDown)
        setAction(action)
        
    }, [getButtonAction, profile, keyId])

    if (action.id == 'hidden') return null

    return (
        <ActionComponent action={action} className={className} />
    )
}

export default Key