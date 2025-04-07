import React, { useState } from 'react'
import { useSettingsStore } from '@src/stores/settingsStore'
import { DEVICE_DESKTHING, SETTING_TYPES, ViewMode, VolMode } from '@deskthing/types'
import { IconArrowLeft, IconArrowRight, IconRefresh, IconTransfer } from '@src/assets/Icons'
import { SettingsSelectComponent } from './settings/SettingsSelect'
import { SettingsColorComponent } from './settings/SettingsColor'
import { SettingsBooleanComponent } from './settings/SettingsBoolean'
import Button from './ui/Button'
import { useWebSocketStore } from '@src/stores'

interface ConfigComponentProps {
  onFinish: () => void
}

/**
 * The `ConfigComponent` is a React functional component that renders a configuration interface for the application.
 * It allows the user to customize various settings, including theme, player preferences, and experience settings.
 * The component is divided into multiple steps, each with its own set of configuration options.
 * The user can navigate between the steps using the "Back" and "Next" buttons, and can also reset the configuration to its default state.
 * The component uses the `useSettingsStore` hook to manage the application's settings state.
 */
export const ConfigComponent: React.FC<ConfigComponentProps> = ({ onFinish }) => {
  const [step, setStep] = useState(0)
  const resetConfig = useSettingsStore((store) => store.resetPreferences)
  const updatePreferences = useSettingsStore((store) => store.updatePreferences)
  const preferences = useSettingsStore((store) => store.preferences)
  const [isResetting, setIsResetting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const send = useWebSocketStore((state) => state.send)

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onFinish()
    }
  }

  const handleSyncToServer = async () => {
    setIsSyncing(true)
    await send({
      type: DEVICE_DESKTHING.CONFIG,
      request: 'set',
      payload: preferences,
      app: 'server'
    })
    setTimeout(() => {
      setIsSyncing(false)
      updatePreferences({ onboarding: true })
    }, 1000)
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleReset = () => {
    setIsResetting(true)
    resetConfig()
    setTimeout(() => {
      setIsResetting(false)
    }, 1000)
  }

  const steps = [
    {
      title: 'Theme Settings',
      content: (
        <div className="flex h-full flex-col">
          <h3 className="text-lg mb-4 font-semibold">Choose Your Theme</h3>
          <div className="flex flex-col">
            <SettingsBooleanComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  use24hour: value
                })
              }
              setting={{
                value: preferences.use24hour,
                type: SETTING_TYPES.BOOLEAN,
                label: '24 hour time'
              }}
            />
            <SettingsSelectComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  theme: { ...preferences.theme, scale: value as 'small' | 'medium' | 'large' }
                })
              }
              setting={{
                value: preferences.theme.scale,
                type: SETTING_TYPES.SELECT,
                label: 'Scale',
                options: [
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' }
                ]
              }}
            />
            <SettingsSelectComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  ScreensaverType: {
                    ...preferences.ScreensaverType,
                    type: value as 'black' | 'logo' | 'clock'
                  }
                })
              }
              setting={{
                value: preferences.ScreensaverType.type,
                type: SETTING_TYPES.SELECT,
                label: 'ScreenSaver',
                description: 'Choose a background for the screensaver',
                options: [
                  { value: 'black', label: 'Black' },
                  { value: 'logo', label: 'Logo' },
                  { value: 'clock', label: 'Clock' }
                ]
              }}
            />
            <SettingsColorComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  theme: { ...preferences.theme, primary: value }
                })
              }
              setting={{
                value: preferences.theme.primary,
                type: SETTING_TYPES.COLOR,
                label: 'Primary'
              }}
            />
            <SettingsColorComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  theme: { ...preferences.theme, textLight: value }
                })
              }
              setting={{
                value: preferences.theme.textLight,
                type: SETTING_TYPES.COLOR,
                label: 'Text Light'
              }}
            />
            <SettingsColorComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  theme: { ...preferences.theme, textDark: value }
                })
              }
              setting={{
                value: preferences.theme.textDark,
                type: SETTING_TYPES.COLOR,
                label: 'Text Dark'
              }}
            />
            <SettingsColorComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  theme: { ...preferences.theme, background: value }
                })
              }
              setting={{
                value: preferences.theme.background,
                type: SETTING_TYPES.COLOR,
                label: 'Background'
              }}
            />
            <SettingsColorComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  theme: { ...preferences.theme, icons: value }
                })
              }
              setting={{
                value: preferences.theme.icons,
                type: SETTING_TYPES.COLOR,
                label: 'Icon'
              }}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Interaction Settings',
      content: (
        <div className="flex h-full flex-col ">
          <h3 className="text-lg mb-4 font-semibold">Player Preferences</h3>
          <div className="flex flex-col ">
            <SettingsSelectComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  miniplayer: { ...preferences.miniplayer, state: value as ViewMode }
                })
              }
              setting={{
                value: preferences.miniplayer.state,
                type: SETTING_TYPES.SELECT,
                label: 'Miniplayer',
                options: [
                  { value: ViewMode.PEEK, label: 'Small' },
                  { value: ViewMode.HIDDEN, label: 'Collapsed' }
                ]
              }}
            />
            <SettingsBooleanComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  miniplayer: { ...preferences.miniplayer, visible: value }
                })
              }
              setting={{
                value: preferences.miniplayer.visible,
                type: SETTING_TYPES.BOOLEAN,
                label: 'Show Miniplayer'
              }}
            />
            <SettingsSelectComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  miniplayer: {
                    ...preferences.miniplayer,
                    position: value as 'bottom' | 'left' | 'right'
                  }
                })
              }
              setting={{
                value: preferences.miniplayer.position,
                type: SETTING_TYPES.SELECT,
                label: 'Position',
                disabled: true,
                options: [
                  { value: 'bottom', label: 'Bottom' },
                  { value: 'right', label: 'Right' },
                  { value: 'left', label: 'Left' }
                ]
              }}
            />

            <h3 className="text-lg mb-4 font-semibold">Player Preferences</h3>
            <SettingsSelectComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  volume: value as VolMode
                })
              }
              setting={{
                value: preferences.volume,
                type: SETTING_TYPES.SELECT,
                disabled: true,
                label: 'Wheel Type',
                options: [
                  { value: VolMode.WHEEL, label: 'Weapon Wheel' },
                  { value: VolMode.SLIDER, label: 'Slider' }
                ]
              }}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Experience Settings',
      content: (
        <div className="flex h-full flex-col ">
          <h3 className="text-lg mb-4 font-semibold">Navigation</h3>
          <div className="flex items-center ">
            <SettingsBooleanComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  showPullTabs: value
                })
              }
              setting={{
                value: preferences.showPullTabs,
                type: SETTING_TYPES.BOOLEAN,
                label: 'Show Pull Tabs'
              }}
            />
          </div>
          <div className="flex items-center ">
            <SettingsBooleanComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  saveLocation: value
                })
              }
              setting={{
                value: preferences.saveLocation,
                type: SETTING_TYPES.BOOLEAN,
                label: 'Save Location'
              }}
            />
          </div>

          <h3 className="text-lg mb-4 font-semibold">Notifications</h3>
          <div className="flex items-center ">
            <SettingsBooleanComponent
              handleSettingChange={(value) =>
                updatePreferences({
                  ShowNotifications: value
                })
              }
              setting={{
                value: preferences.ShowNotifications,
                type: SETTING_TYPES.BOOLEAN,
                label: 'Notifications'
              }}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Final Setup',
      content: (
        <div className="flex h-full flex-col ">
          <h3 className="text-lg mb-4 font-semibold">Syncing Settings</h3>
          <div className="flex flex-col justify-start items-start">
            <Button
              disabled={isSyncing}
              className="bg-red-500 text-white px-4 py-2 my-2 rounded-md"
              onClick={handleSyncToServer}
            >
              <IconTransfer className={`${isSyncing && 'animate-pulse'}`} />
              <p className="font-semibold ml-2">Save Config On Server</p>
            </Button>
            <Button
              className="bg-cyan-500 disabled:bg-cyan-600 my-2 items-center"
              disabled={isResetting}
              onClick={handleReset}
            >
              <IconRefresh className={`${isResetting && 'animate-spin'}`} />
              <p className="pl-2">Reset</p>
            </Button>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="w-full h-full overflow-hidden p-6 max-h-screen flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{steps[step].title}</h1>
        <div className="text-sm">
          Step {step + 1} of {steps.length}
        </div>
      </div>
      <div className="h-full overflow-y-scroll pr-2">{steps[step].content}</div>
      <div className="flex py-3 shrink-0 justify-between">
        <Button
          onClick={handleBack}
          disabled={step === 0}
          className="px-4 ml-16 py-2 bg-gray-900 items-center disabled:opacity-50"
        >
          <IconArrowLeft />
          Back
        </Button>
        <Button
          className="bg-cyan-500 disabled:bg-cyan-600 items-center"
          disabled={isResetting}
          onClick={handleReset}
        >
          <IconRefresh className={`${isResetting && 'animate-spin'}`} />
          <p className="pl-2">Reset</p>
        </Button>
        <Button onClick={handleNext} className="px-4 py-2 items-center bg-green-500">
          {step === steps.length - 1 ? 'Finish' : 'Next'}
          <IconArrowRight />
        </Button>
      </div>
    </div>
  )
}

export default ConfigComponent
