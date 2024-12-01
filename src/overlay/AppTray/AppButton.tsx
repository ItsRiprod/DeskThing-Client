import ActionIcon from "@src/components/ui/ActionIcon"
import { useAppStore } from "@src/stores"
import { App } from "@src/types"
import { useEffect, useState } from "react"

interface AppTrayButtonProps {
    app: App
}

const AppTrayButton: React.FC<AppTrayButtonProps> = ({ app }) => {
    const getAppIcon = useAppStore((store) => store.getAppIcon)
    const [appIcon, setAppIcon] = useState<string>(getAppIcon(app))

    useEffect(() => {
        const getIcon = async () => {
            const icon = await getAppIcon(app)
            setAppIcon(icon)
        }

        getIcon()
    }, [app])

    return (
        <div className="w-full h-32 px-20 py-3">
            <ActionIcon url={appIcon} />
        </div>
    )
}

export default AppTrayButton