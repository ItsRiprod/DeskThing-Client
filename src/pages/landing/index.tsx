import React, { useEffect, useState } from 'react'
import WelcomePage from './Welcome'
import ConnectingPage from './Connecting'
import { IconArrowLeft, IconArrowRight } from '@src/assets/Icons'
import { useSettingsStore } from '@src/stores'

export interface StepProps {
    onNextStep: (reverse?: boolean) => void
    setNextSteps: (visible: boolean) => void
  }

interface Step {
    id: number
    component: React.ComponentType<StepProps>
  }

const steps: Step[] = [
    {
        id: 1,
        component: WelcomePage,
    },
    {
        id: 2,
        component: ConnectingPage,
    },
]

const LandingPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [transitioning, setIsTransitioning] = useState(false)
    const [showNextSteps, setShowNextSteps] = useState(false)
    const onboarding = useSettingsStore((store) => store.preferences.onboarding)

    const handleNextStep = (reverse = false) => {
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
        return <CurrentStepComponent onNextStep={handleNextStep} setNextSteps={setShowNextSteps} />
    }

    return (
        <div className="absolute w-screen h-screen bg-black flex-col flex items-center justify-center z-10">
            <div className={`${transitioning && 'opacity-0'} duration-500 transition-opacity w-full h-full`}>
                {renderCurrentStep()}
            </div>

            <div className={`${showNextSteps ? 'w-screen' : 'w-[98vw] opacity-0'} p-5 transition-all duration-500 ease-in-out absolute bottom-0 flex justify-between`}>
                <button onClick={() => handleNextStep(true)} className={`${currentStep > 0 ? '' : 'opacity-0'} transition-opacity`}>
                    <IconArrowLeft iconSize={64} />
                </button>
                <button onClick={() => handleNextStep()} className={`${currentStep < steps.length - 1 ? '' : 'opacity-0'} transition-opacity`}>
                    <IconArrowRight iconSize={64} />
                </button>
            </div>
        </div>
    )
}

export default LandingPage