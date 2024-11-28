import { useAppStore } from "@src/stores"
import SettingOption from "./SettingOptionComponent"
import { useSearchParams } from "react-router-dom"

const UtilityApp = () => {
    const apps = useAppStore((store) => store.apps)
    const [_searchParams, setSearchParams] = useSearchParams()

    const onClick = (app: string) => {
        setSearchParams({ app: app})
    }

    return (
        <div className="p-4 bg-zinc-900 w-full flex flex-col h-full">
            <div className="border-b p-5">
                <h1 className="text-4xl font-semibold">App Settings</h1>
            </div>
            <div className="overflow-y-scroll flex flex-col py-10">
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