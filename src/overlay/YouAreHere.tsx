import { IconArrowRight, IconLogo, IconRefresh } from "@src/assets/Icons"
import Button from "@src/components/ui/Button"
import { useSettingsStore } from "@src/stores"
import { FC, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

interface YouAreHereProps {
    setShow: (show: boolean) => void
}

export const YouAreHere: FC<YouAreHereProps> = ({ setShow }) => {
    const [isOpen, setIsOpen] = useState(true)
    const location = useLocation()
    const hasDoneOnboarding = useSettingsStore((state) => state.preferences.onboarding)
    const setPreferences = useSettingsStore((state) => state.updatePreferences)

    useEffect(() => {
        if (hasDoneOnboarding) {
            setIsOpen(true)
            setTimeout(() => {
                handleClose()
            }, 5000)
        } else {
            setShow(false)
        }
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        setTimeout(() => {
            setShow(false)
        }, 200)
    }

    const clearCache = () => {
        localStorage.clear()
        window.location.reload()
    }

    const handleDashboard = () => {
        setPreferences({ currentView: { name: 'dashboard' }})
        handleClose()
    }

    return (
        <div className={`fixed flex-col justify-between p-4 bg-black z-10 w-full ${isOpen ? 'h-full md:h-full' : 'h-0'} transition-[height] overflow-hidden top-0 flex items-center justify-center`}>
            <div className="flex flex-col">
                <p className="text-4xl animate-drop">Welcome Back to</p>
                <IconLogo className="w-fit h-16 animate-dropDelay" />
            </div>
            <p>{location.pathname}</p>
            <div className="flex flex-col gap-2">
                <Button onClick={handleDashboard} className="border-amber-500 animate-drop bg-amber-500/25 justify-between border text-3xl">
                    Go to dashboard
                    <IconArrowRight />
                </Button>
                <Button onClick={clearCache} className="border-blue-500 animate-dropDelay bg-blue-500/25 justify-between border text-3xl">
                    <p>
                        Clear Cache
                    </p>
                    <IconRefresh className="stroke-2" />
                </Button>
            </div>
        </div>
    )
}
export default YouAreHere