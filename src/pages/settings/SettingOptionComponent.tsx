import { IconArrowRight } from "@src/assets/Icons";
import ActionIcon from "@src/components/ui/ActionIcon";
import { useAppStore } from "@src/stores";
import { App } from "@src/types";

interface SettingOptionProps {
    app: App
    onClick: (app: string) => void
}

const SettingOption: React.FC<SettingOptionProps> = ({ app, onClick }) => {
    const getAppIcon = useAppStore((store) => store.getAppIcon)

    const handleClick = () => {
        onClick(app.name)
    }

    return (
        <button className="mt-2 flex-shrink-0 w-full h-16 p-10 rounded-lg bg-black flex items-center justify-between" onClick={handleClick} >
            <div className="flex items-center">
                <ActionIcon url={getAppIcon(app)} className="h-full" />
                <p className="ml-4 text-nowrap overflow-ellipsis text-3xl">{app.manifest?.label || app.name}</p>
            </div>
            <div className="flex items-center">
                <IconArrowRight />
            </div>
        </button>
    )
}

export default SettingOption