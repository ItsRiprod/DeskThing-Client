import { Icon } from "@src/assets/Icons/Icons"
import { useMappingStore, useSettingsStore } from "@src/stores"
import { IconLogoGear } from "@src/assets/Icons"
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
        const abortController = new AbortController()
        
        const fetchIcon = async () => {
            try {
                const rawSvg = await fetch(url, { signal: abortController.signal })
                if (rawSvg.ok) {
                    setSvgContent(await rawSvg.text())
                }
            } catch  (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    // Silently fail for 404s and other errors
                }
            }
        }

        fetchIcon()
        return () => abortController.abort()
    }, [getActionUrl, url])

    return (
        <Icon color={iconColor} className={className || 'w-full h-full'}>
            {svgContent ? (
                <svg dangerouslySetInnerHTML={{ __html: svgContent }} />
            ) : (
                <IconLogoGear />
            )}
        </Icon>
    )
}

export default ActionIcon