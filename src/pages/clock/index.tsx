import { IconX } from '@src/assets/Icons'
import { SettingsBooleanComponent } from '@src/components/settings/SettingsBoolean'
import { SettingsColorComponent } from '@src/components/settings/SettingsColor'
import { TimeUpdater } from '@src/components/TimeUpdater'
import Button from '@src/components/ui/Button'
import { useMusicStore, useSettingsStore } from '@src/stores'
import { useTimeStore } from '@src/stores/timeStore'
import { FC, useEffect, useState, useRef } from 'react'

const ClockPage: FC = () => {
  const musicData = useMusicStore((state) => state.song)
  const time = useTimeStore((state) => state.currentTimeFormatted)
  const syncTime = useTimeStore((state) => state.updateCurrentTime)
  const [showAlbumArt, setShowAlbumArt] = useState(true)
  const [showConfig, setShowConfig] = useState(false)
  const updatePreferences = useSettingsStore((state) => state.updatePreferences)
  const use24hour = useSettingsStore((state) => state.preferences.use24hour)
  const textDark = useSettingsStore((state) => state.preferences.theme.textDark)
  const textLight = useSettingsStore((state) => state.preferences.theme.textLight)
  const preferences = useSettingsStore((state) => state.preferences)
  const configRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (configRef.current && !configRef.current.contains(event.target as Node)) {
        setShowConfig(false)
      } else if (mainRef.current && mainRef.current.contains(event.target as Node)) {
        setShowConfig(true)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showConfig])

  useEffect(() => {
    syncTime()
  }, [use24hour])

  return (
    <div ref={mainRef} className="relative w-full flex items-center justify-center h-full">
    <TimeUpdater />
      {showAlbumArt && musicData && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${musicData.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(25px)'
          }}
        />
      )}
      <div className="absolute w-full h-full inset-0 flex items-center justify-center">
        <p
          style={{
            color:
            showAlbumArt && musicData && musicData.color && musicData.color.isDark
                ? textLight
                : textDark || textLight
          }}
          className="text-9xl"
        >
          {time}
        </p>
      </div>
      {showConfig && (
        <div
          ref={configRef}
          className="absolute overflow-hidden overflow-y-auto p-5 w-5/6 h-5/6 bg-zinc-900/50 animate-drop rounded-xl"
        >
          <SettingsBooleanComponent
            handleSettingChange={(value) => setShowAlbumArt(value)}
            setting={{
              value: showAlbumArt,
              type: 'boolean',
              label: 'Show Album Art'
            }}
          />
          <SettingsBooleanComponent
            handleSettingChange={(value) =>
              updatePreferences({
                use24hour: value
              })
            }
            setting={{
              value: use24hour,
              type: 'boolean',
              label: '24 hour time'
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
              type: 'color',
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
              type: 'color',
              label: 'Text Dark'
            }}
          />
          <Button
            className="bg-red-500"
            onClick={(e) => {
              e.stopPropagation()
              setShowConfig(false)
            }}
          >
            <IconX />
            <p>Close</p>
          </Button>
        </div>
      )}
    </div>
  )
}

export default ClockPage
