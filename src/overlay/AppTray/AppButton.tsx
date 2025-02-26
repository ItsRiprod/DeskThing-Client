import ActionIcon from '@src/components/ui/ActionIcon'
import Button from '@src/components/ui/Button'
import { useAppStore, useSettingsStore } from '@src/stores'
import { App } from '@deskthing/types'
import { useEffect, useState } from 'react'

interface AppTrayButtonProps {
  app: App
}

/**
 * Renders an app button in the app tray.
 * 
 * @param app - The app object to display in the button.
 * @returns A React component that renders an app button in the app tray.
 */
const AppTrayButton: React.FC<AppTrayButtonProps> = ({ app }) => {
  const getAppIcon = useAppStore((store) => store.getAppIcon)
  const [appIcon, setAppIcon] = useState<string>(getAppIcon(app))
  const setCurrentView = useSettingsStore((store) => store.updatePreferences)

  useEffect(() => {
    const getIcon = async () => {
      const icon = await getAppIcon(app)
      setAppIcon(icon)
    }

    getIcon()
  }, [app])

  const handleAppClick = () => {
    setCurrentView({ currentView: app })
  }

  return (
    <Button onClick={handleAppClick} className="w-28 h-28 flex-shrink-0">
      <ActionIcon url={appIcon} />
    </Button>
  )
}

export default AppTrayButton
