import { useAppStore, useSettingsStore } from "@src/stores"
import SettingOption from "./SettingOptionComponent"
import { useSearchParams } from "react-router-dom"
import { IconWrench } from "@src/assets/Icons"
import Button from "@src/components/ui/Button"

const UtilityApp = () => {
    const apps = useAppStore((store) => store.apps)
    const setPreference = useSettingsStore((store) => store.updatePreferences)
    const [_searchParams, setSearchParams] = useSearchParams()

    const onClick = (app: string) => {
        setSearchParams({ app: app})
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation()
    }

    const clearCache = () => {
        setPreference({ onboarding: false })
        window.location.reload()
    }

    return (
        <div className="p-4 bg-zinc-900 w-full flex flex-col h-full">
            <div className="border-b p-5 flex items-center justify-between">
                <h1 className="text-4xl font-semibold">App Settings</h1>
                <Button onClick={clearCache}>
                    <IconWrench />
                </Button>
            </div>
            <div className="overflow-y-scroll flex flex-col py-10" onTouchStart={handleTouchStart}>
                {apps.map((app) => {
                    return (
                        <SettingOption key={app.name} app={app} onClick={onClick} />
                    )
                })}
            </div>
        </div>
    )
}

export default UtilityApp