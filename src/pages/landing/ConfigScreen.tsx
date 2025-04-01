import React, { useEffect, useState } from 'react'
import { StepProps } from '.'
import ConfigComponent from '@src/components/ConfigComponent'
import Button from '@src/components/ui/Button'
import { IconWrench } from '@src/assets/Icons'
import Logger from '@src/utils/Logger'
import SyncButton from '@src/components/ui/SyncButton'

/**
 * The `ConfigPage` component is responsible for rendering the configuration screen of the application.
 * It handles the logic for showing and hiding the configuration component, as well as the sync functionality.
 *
 * @param currentStep - The current step in the application flow.
 * @param setNextSteps - A function to set the next steps in the application flow.
 * @param onNextStep - A function to move to the next step in the application flow.
 */
const ConfigPage: React.FC<StepProps> = ({ currentStep, setNextSteps, onNextStep }) => {
  const [onLoad, setOnLoad] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setNextSteps(true)
      setOnLoad(true)
      Logger.info('Showing next steps', currentStep)
    }, 1000)
  }, [currentStep])

  const handleNext = () => {
    onNextStep()
  }

  const handleClose = () => {
    if (showConfig) {
      setShowConfig(false)
      setNextSteps(true)
    }
  }

  useEffect(() => {
    const handleScroll = (e: Event) => {
      e.stopPropagation()
      e.stopImmediatePropagation()
    }

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation()
      e.stopImmediatePropagation()
    }

    window.addEventListener('scroll', handleScroll, { capture: true, passive: false })
    window.addEventListener('wheel', handleWheel, { capture: true, passive: false })

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true })
      window.removeEventListener('wheel', handleWheel, { capture: true })
    }
  }, [])

  const showConfigScreen = () => {
    setShowConfig(true)
    setNextSteps(false)
  }

  return (
    <div className="max-w-full h-full bg-black flex md:flex-row flex-col">
      <div
        className={`${showConfig ? 'md:w-3/4 h-5/6 md:h-full' : 'md:w-0 h-0'} border-r border-gray-500 flex-shrink-0 overflow-hidden md:h-full md:justify-center flex flex-col w-screen duration-500 transition-[width,height,padding]`}
      >
        <ConfigComponent onFinish={handleNext} />
      </div>
      <div
        onClick={handleClose}
        className="w-full px-3 flex-shrink h-full flex flex-col items-center justify-center bg-zinc-900"
      >
        <h1 className="text-4xl">Let's setup the config</h1>
        <div
          className={`${showConfig ? 'opacity-0' : 'opacity-100'} space-x-4 transition-[opacity,height] ${onLoad ? 'h-20' : 'h-0'} duration-500 flex items-center`}
        >
          {onLoad && (
            <Button
              onClick={showConfigScreen}
              className="w-fit animate-drop border-2 mt-5 md:mt-0 border-emerald-500 items-center"
            >
              <IconWrench />
              <p className="text-nowrap text-2xl font-semibold mx-2">Edit Config</p>
            </Button>
          )}
          {onLoad && <SyncButton expanded className="animate-dropDelay" />}        </div>
      </div>
    </div>
  )
}

export default ConfigPage
