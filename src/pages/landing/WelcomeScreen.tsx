import { IconLogo, IconLogoGearLoading } from '@src/assets/Icons'
import { StepProps } from '.'
import { useEffect, useState } from 'react'
import SyncButton from '@src/components/ui/SyncButton'
import FullscreenButton from '@src/components/ui/FullscreenButton'
import SkipSetupButton from './SkipSetupButton'
import { useSettingsStore } from '@src/stores'
import { ClientConnectionMethod, ClientPlatformIDs } from '@deskthing/types'

/**
 * The `WelcomePage` component is the initial screen displayed to users when they first start the application. It shows the application logo, a loading indicator, and buttons to either proceed with the setup process or skip it.
 *
 * The component uses the `useState` and `useEffect` hooks to manage its state and side effects. It checks the user's device type (desktop, tablet, or mobile) and adjusts the UI accordingly. The component also sets a timeout to trigger the next steps in the setup process after a short delay.
 *
 * @param setNextSteps - A function provided by the parent component to indicate that the user is ready to move to the next step in the setup process.
 */
const WelcomePage: React.FC<StepProps> = ({ setNextSteps }) => {
  const [onLoad, setOnLoad] = useState(false)
  const [deviceType, setDeviceType] = useState('')
  const methodId = useSettingsStore((state) => state.manifest.context.id)

  useEffect(() => {
    setTimeout(() => setOnLoad(true), 10)

    const userAgent = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
      setDeviceType('Tablet')
    } else if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        userAgent
      )
    ) {
      setDeviceType('phone')
    } else {
      setDeviceType('desktop')
    }

    setTimeout(() => {
      setNextSteps(true)
    }, 2500)
  }, [])

  return (
    <div className="w-full h-full bg-black flex-col flex items-center justify-center">
      <div
        className={`${onLoad ? 'md:w-5/6 w-full' : 'w-0'} ease-in-out flex flex-col items-center duration-1000 transition-all overflow-hidden`}
      >
        <h1 className="text-4xl w-screen text-center mb-2">Welcome to</h1>
        <IconLogo className="w-[50vw] h-fit" />
        <div
          className={`${onLoad ? 'h-16 md:h-10' : 'h-0'} transition-[height] overflow-hidden duration-500 delay-1000 flex items-center`}
        >
          <p className="text-2xl text-center mx-2">
            Lets get some things setup for you on your {deviceType}
          </p>
          <IconLogoGearLoading className="hidden md:block" />
        </div>
        <div
          className={`${onLoad ? 'max-h-full' : 'max-h-0'} mt-4 md:mt-0 flex-col md:flex-row space-x-5 w-full justify-center transition-[max-height] overflow-hidden duration-500 delay-[2000ms] flex items-center`}
        >
          {deviceType === 'phone' ? (
            <FullscreenButton expanded={true} />
          ) : (
            <SyncButton expanded={true} />
          )}
          <SkipSetupButton />
        </div>
        <div>
          {methodId == ClientPlatformIDs.Iphone && (
            <div className="text-center my-4 bg-zinc-900/50 rounded-lg p-4 mx-4">
              <p className="text-lg font-medium mb-2">
                For a better iPhone experience, add this to your homescreen!
              </p>
              <p className="text-sm text-zinc-400">
                It will make DeskThing fullscreen and remove the search bar
              </p>
            </div>
          )}
        </div>{' '}
      </div>
    </div>
  )
}

export default WelcomePage
