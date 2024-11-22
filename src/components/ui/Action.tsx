import { Icon } from "@src/assets/Icons/Icons"
import { useMappingStore } from "@src/stores"
import { Action } from "@src/types"
import { IconLogoGearLoading } from "@src/assets/Icons"
import { useEffect, useState } from "react"

interface ActionProps {
    action: Action
    className?: string
  }

const ActionComponent: React.FC<ActionProps> = ({ action, className }) => {
    const executeAction = useMappingStore((store) => store.executeAction)
    const profile = useMappingStore((store) => store.profile)
    const getActionUrl = useMappingStore((store) => store.getActionUrl)
    const [svgContent, setSvgContent] = useState<string | null>(null)
    const onClick = () => {
        executeAction(action)
    }

    useEffect(() => {
        const fetchIcon = async () => {
            console.log(action.icon)
            const rawSvg = await fetch(getActionUrl(action))
            setSvgContent(await rawSvg.text())
        }

        fetchIcon()
    }, [getActionUrl, action, profile])

    return (
        <button className="w-full h-full cursor-pointer" onClick={onClick}> 
                <Icon className={`text-white w-full h-full ` + className}>
                    {svgContent ? (
                        <svg dangerouslySetInnerHTML={{ __html: svgContent }} />
                    ) : (
                        <IconLogoGearLoading />
                    )}
                </Icon>
        </button>
    )
}

export default ActionComponent