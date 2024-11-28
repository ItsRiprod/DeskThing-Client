import { IconArrowRight } from "@src/assets/Icons"
import Button from "@src/components/ui/Button"
import { useSettingsStore } from "@src/stores"
import { useState } from "react"

interface SkipSetupButtonProps {
}

const SkipSetupButton: React.FC<SkipSetupButtonProps> = () => {
    const setPreferences = useSettingsStore(((state) => state.updatePreferences))
    const [skipping, setIsSkipping] = useState(false)

    const onClick = () => {
        setIsSkipping(true)
        setPreferences({
            onboarding: false
        })
        setTimeout(() => {
            setPreferences({
                onboarding: true
            })
            setIsSkipping(false)
        }, 500)
    }

    return (
        <Button className="border w-fit items-center" onClick={onClick}>
            <IconArrowRight className={`${skipping &&  'translate-x-28 opacity-0'} duration-500 ease-out transition-all`} />
            <p className={`${skipping &&  'opacity-0'} duration-250 transition-opacity text-nowrap text-2xl font-semibold`}>Skip Setup</p>
        </Button>
    )
}

export default SkipSetupButton