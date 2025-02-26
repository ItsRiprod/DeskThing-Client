import { IconArrowRight } from '@src/assets/Icons'
import Button from '@src/components/ui/Button'
import { useSettingsStore } from '@src/stores'
import { useState } from 'react'

interface SkipSetupButtonProps {}

/**
 * A button component that allows the user to skip the setup process.
 * When clicked, it updates the user's preferences to set `onboarding` to `false`,
 * and then after a 500ms delay, sets `onboarding` to `true` and updates the `currentView`
 * to the `dashboard`.
 * The button also displays an arrow icon that animates when the button is clicked.
 */
const SkipSetupButton: React.FC<SkipSetupButtonProps> = () => {
  const setPreferences = useSettingsStore((state) => state.updatePreferences)
  const [skipping, setIsSkipping] = useState(false)

  const onClick = () => {
    setIsSkipping(true)
    setPreferences({
      onboarding: false
    })
    setTimeout(() => {
      setPreferences({
        onboarding: true,
        currentView: {
          name: 'dashboard',
          enabled: true,
          running: true,
          timeStarted: 0,
          prefIndex: 0
        }
      })
      setIsSkipping(false)
    }, 500)
  }

  return (
    <Button className="border mt-5 md:mt-0 w-fit items-center" onClick={onClick}>
      <IconArrowRight
        className={`${skipping && 'translate-x-28 opacity-0'} duration-500 ease-out transition-all`}
      />
      <p
        className={`${skipping && 'opacity-0'} duration-250 transition-opacity text-nowrap text-2xl font-semibold`}
      >
        Skip Setup
      </p>
    </Button>
  )
}

export default SkipSetupButton
