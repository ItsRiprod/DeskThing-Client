import { IconArrowLeft, IconLoading, IconSave } from "@src/assets/Icons"
import Settings from "@src/components/settings"
import Button from "@src/components/ui/Button"
import { useAppStore, useWebSocketStore } from "@src/stores"
import React, { useState } from "react"
import { useSearchParams } from "react-router-dom"

interface AppSettingsProps {
    appName: string
}

const AppSettingsPage: React.FC<AppSettingsProps> = ({ appName }) => {
    const connected = useWebSocketStore((store) => store.isConnected)

    
    const appsList = useAppStore((store) => store.apps)
    const appSettings = useAppStore((store) => store.appSettings)
    const updateAppSettings = useAppStore((store) => store.updateAppSettings)
    const saveSettings = useAppStore((store) => store.saveSettings)
    const [saving, setIsSaving] = useState(false)
    const [_searchParams, setSearchParmas] = useSearchParams()
    
    if (!connected) return <div className="w-screen h-screen bg-red flex items-center justify-center text-4xl">Not connected</div>
    
    const app = appsList.find((app) => app.name === appName)
    const settings = appSettings[appName]



    const handleSettingChange = (key: string, value: any) => {
        console.log(key, value)
        const updatedSettings = {
            ...settings,
            [key]: { ...settings[key], value }
        }
        console.log(updatedSettings)
        updateAppSettings(appName, updatedSettings)
    }

    const onClick =() => {
        setSearchParmas({ })
    }

    const handleSave = () => {
        setIsSaving(true)
        saveSettings(app.name)
        setTimeout(() => {
            setIsSaving(false)
        }, 1000)
    }

    return (
        <div className="p-5 flex flex-col h-full">
            <div className="border-b items-center flex p-5 ">
                <Button onClick={onClick}>
                    <IconArrowLeft iconSize="32" className="w-full h-full" />
                </Button>
                <h1 className="text-4xl font-semibold">{app.manifest?.label || app.name}</h1>
            </div>
            <div className="flex flex-col overflow-y-scroll py-10">
                {settings && Object.entries(settings).map(([key, setting]) => (
                    <Settings 
                    key={key}
                    className="my-3 flex-shrink-0" 
                    setting={setting} 
                    handleSettingChange={(value) => handleSettingChange(key, value)} 
                    />
                ))}
            </div>
            <div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <IconLoading className="animate-spin" />
                    ) : (
                        <IconSave />
                    )}
                </Button>
            </div>
        </div>
    )
}

export default AppSettingsPage