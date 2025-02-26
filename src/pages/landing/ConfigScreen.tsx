import React, { useEffect, useState } from 'react'
import { StepProps } from '.'
import ConfigComponent from '@src/components/ConfigComponent'
import Button from '@src/components/ui/Button'
import { IconRefresh, IconWrench } from '@src/assets/Icons'

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
  const [isSyncing, setIsSyncing] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setNextSteps(true)
      setOnLoad(true)
      console.log('Showing next steps', currentStep)
    }, 1000)
  }, [currentStep])

  useEffect(() => {
    console.log('Loaded')
  }, [])

  const handleNext = () => {
    onNextStep()
  }

  const handleClose = () => {
    if (showConfig) {
      setShowConfig(false)
      setNextSteps(true)
    }
  }

  const handleSync = () => {
    console.log('Syncing')
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
    }, 2000)
  }

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
          className={`${showConfig ? 'opacity-0' : 'opacity-100'} transition-[opacity,height] ${onLoad ? 'h-20' : 'h-0'} duration-500 flex items-center`}
        >
          {onLoad && (
            <Button
              disabled={isSyncing}
              onClick={showConfigScreen}
              className="mt-4 bg-cyan-500 disabled:bg-cyan-700 animate-drop mx-2"
            >
              <IconWrench />
              <p className="ml-2">Edit Config</p>
            </Button>
          )}
          {onLoad && (
            <Button
              disabled={isSyncing}
              onClick={handleSync}
              className="mt-4 disabled:bg-green-700 bg-green-500 animate-dropDelay mx-2"
            >
              <IconRefresh className={`${isSyncing && 'animate-spin'}`} />
              <p className="ml-2">Sync With Server</p>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConfigPage
