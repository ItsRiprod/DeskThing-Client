import { IconLogo, IconLogoGearLoading } from "@src/assets/Icons"
import { StepProps } from "."
import { useEffect, useState } from "react"
import SyncButton from "@src/components/ui/SyncButton"
import FullscreenButton from "@src/components/ui/FullscreenButton"
import SkipSetupButton from "./SkipSetupButton"

const WelcomePage: React.FC<StepProps> = ({ setNextSteps }) => {
    const [onLoad, setOnLoad] = useState(false)
    const [deviceType, setDeviceType] = useState("")

    useEffect(() => {
        setTimeout(() =>
            setOnLoad(true)
        , 10)

        const userAgent = navigator.userAgent
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
            setDeviceType("Tablet")
        } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
            setDeviceType("Mobile")
        } else {
            setDeviceType("Desktop")
        }

        setTimeout(() => {
            setNextSteps(true)
        }, 2500)
    }, [])

    return (
    <div className="w-screen h-screen bg-black flex-col flex items-center justify-center">
        <div className={`${onLoad ? 'w-5/6' : 'w-0'} ease-in-out flex flex-col items-center duration-1000 transition-all overflow-hidden`}>
            <h1 className="text-4xl w-screen text-center mb-2">Welcome to</h1>
            <IconLogo className="w-[50vw] h-fit" />
            <div className={`${onLoad ? 'h-10' : 'h-0'} transition-[height] overflow-hidden duration-500 delay-1000 flex items-center`}>
                <p className="text-2xl mx-2">Lets get some things setup for you on your {deviceType}</p>
                <IconLogoGearLoading />
            </div>
            <div className={`${onLoad ? 'h-28' : 'h-0'} space-x-5 w-full justify-center transition-[height] overflow-hidden duration-500 delay-[2000ms] flex items-center`}>
                {deviceType === 'Mobile' ? (
                    <FullscreenButton expanded={true} />
                ) : (
                    <SyncButton expanded={true} />
                    )
                }
                <SkipSetupButton />
            </div>
        </div>
    </div>
    )
}

export default WelcomePage