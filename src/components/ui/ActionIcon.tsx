import { Icon } from "@src/assets/Icons/Icons"
import { useMappingStore, useSettingsStore } from "@src/stores"
import { IconLogoGearLoading } from "@src/assets/Icons"
import { useEffect, useState } from "react"

interface ActionProps {
    url: string
    className?: string
  }

const ActionIcon: React.FC<ActionProps> = ({ url, className }) => {
    const getActionUrl = useMappingStore((store) => store.getActionUrl)
    const [svgContent, setSvgContent] = useState<string | null>(null)
    const iconColor = useSettingsStore((store) => store.preferences.theme.icons)

    useEffect(() => {
        const fetchIcon = async () => {
            const rawSvg = await fetch(url)
            if (rawSvg.ok) {
                setSvgContent(await rawSvg.text())
            } else {
                console.error('Failed to fetch icon', rawSvg.statusText)
            }
        }

        fetchIcon()
    }, [getActionUrl, url])

    return (
        <Icon color={iconColor} className={className || 'w-full h-full'}>
            {svgContent ? (
                <svg dangerouslySetInnerHTML={{ __html: svgContent }} />
            ) : (
                <IconLogoGearLoading />
            )}
        </Icon>
    )
}

export default ActionIcon