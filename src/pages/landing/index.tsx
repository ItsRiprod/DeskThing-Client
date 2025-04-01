import React, { useEffect, useState } from 'react'
import WelcomePage from './WelcomeScreen'
import ConnectingPage from './ConnectingScreen'
import ConfigPage from './ConfigScreen'
import { IconArrowLeft, IconArrowRight } from '@src/assets/Icons'
import { useSettingsStore } from '@src/stores'

export interface StepProps {
  onNextStep: (reverse?: boolean) => void
  setNextSteps: (visible: boolean) => void
  currentStep: number
}

interface Step {
  id: number
  component: React.ComponentType<StepProps>
}

const steps: Step[] = [
  {
    id: 1,
    component: WelcomePage
  },
  {
    id: 2,
    component: ConnectingPage
  },
  {
    id: 3,
    component: ConfigPage
  }
]

/**
 * The `LandingPage` component is the main entry point for the application's landing experience.
 * It manages the state and rendering of the different steps (screens) that make up the onboarding flow.
 * The component uses the `useSettingsStore` to access and update the user's onboarding preferences.
 *
 * The `LandingPage` component renders the following steps:
 * 1. `WelcomePage`
 * 2. `ConnectingPage`
 * 3. `ConfigPage`
 *
 * The component handles the navigation between these steps, including the ability to go back to the previous step.
 * It also manages the visibility of the "Next" buttons and the transition animation between steps.
 */
const LandingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [transitioning, setIsTransitioning] = useState(false)
  const [showNextSteps, setShowNextSteps] = useState(false)
  const onboarding = useSettingsStore((store) => store.preferences.onboarding)
  const setPreferences = useSettingsStore((store) => store.updatePreferences)

  const handleNextStep = (reverse = false) => {
    if (currentStep === steps.length - 1 && !reverse) {
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
      return
    }

    setShowNextSteps(false)
    setIsTransitioning(true)
    setTimeout(() => {
      setIsTransitioning(false)
      if (reverse) {
        setCurrentStep((prevStep) => (prevStep - 1 + steps.length) % steps.length)
        return
      }
      setCurrentStep((prevStep) => (prevStep + 1) % steps.length)
    }, 500)
  }

  useEffect(() => {
    if (onboarding) {
      setCurrentStep(1)
    }
  }, [onboarding])

  const renderCurrentStep = () => {
    const { component: CurrentStepComponent } = steps[currentStep]
    return (
      <CurrentStepComponent
        currentStep={currentStep}
        onNextStep={handleNextStep}
        setNextSteps={setShowNextSteps}
      />
    )
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className="w-full h-full bg-black flex-col flex relative items-center justify-center"
      onTouchStart={handleTouchStart}
    >
      <div
        className={`${transitioning && 'opacity-0'} duration-500 transition-opacity w-full h-full`}
      >
        {renderCurrentStep()}
      </div>

      <button
        disabled={currentStep === 0 || !showNextSteps}
        onClick={() => handleNextStep(true)}
        className={`bottom-4 left-4 flex items-center fixed disabled:opacity-0 transition-opacity`}
      >
        <IconArrowLeft iconSize={64} />
        <p>Previous</p>
      </button>
      {currentStep !== steps.length - 1 && (
        <button
          disabled={currentStep == steps.length - 1 || !showNextSteps}
          onClick={() => handleNextStep()}
          className={`bottom-4 right-4 fixed flex items-center disabled:opacity-0 transition-opacity`}
        >
          <p>Next</p>
          <IconArrowRight iconSize={64} />
        </button>
      )}
    </div>
  )
}

export default LandingPage
