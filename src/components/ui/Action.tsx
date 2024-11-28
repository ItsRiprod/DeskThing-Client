import { useMappingStore } from "@src/stores"
import { Action, ActionReference } from "@src/types"
import ActionIcon from "./ActionIcon"
import { useEffect, useState } from "react"

interface ActionProps {
    action: Action | ActionReference
    className?: string
  }

const ActionComponent: React.FC<ActionProps> = ({ action, className }) => {
    const executeAction = useMappingStore((store) => store.executeAction)
    const getActionUrl = useMappingStore((store) => store.getActionUrl)
    const profile = useMappingStore((store) => store.profile)
    const [url, setUrl] = useState(getActionUrl(action))

    const onClick = () => {
        executeAction(action)
    }

    useEffect(() => {
        const fetchIcon = async () => {
            const url =  getActionUrl(action)
            setUrl(url)
        }

        fetchIcon()
    }, [getActionUrl, action, profile])

    return (
        <button className={`flex items-center justify-center cursor-pointer w-full h-full`} onClick={onClick}> 
                <ActionIcon url={url} className={className} />
        </button>
    )
}

export default ActionComponent