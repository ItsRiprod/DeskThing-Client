import { TimeUpdater } from '@src/components/TimeUpdater'
import {
  useAppStore,
  useMappingStore,
  useMusicStore,
  useSettingsStore,
  useWebSocketStore
} from '@src/stores'
import { useTimeStore } from '@src/stores/timeStore'
import {
  IframeData,
  AppDataRequest,
  AppDataKey,
  AppDataAction,
  AppTriggerButton,
  AppTriggerAction,
  AppTriggerKey,
  OutgoingSocketAction,
  AppTriggerLog
} from '@src/types'
import { EventMode } from '@deskthing/types'
import { useRef, useEffect } from 'react'
import Logger from '@src/utils/Logger'

interface WebPageProps {
  currentView: string
}

/**
 * The `WebPage` component is responsible for rendering an iframe that displays the current view of the application. It handles various interactions between the iframe and the main application, such as triggering actions, handling button and key presses, and responding to requests for music, settings, apps, key icons, and action icons.
 *
 * The component uses several hooks to access the state and functionality of the application, including the `useAppStore`, `useMusicStore`, `useSettingsStore`, `useWebSocketStore`, and `useTimeStore`.
 *
 * The component sets up event listeners to handle messages received from the iframe, and sends data to the iframe as needed. It also sets up a timeout to send default data (music, settings, and time) to the iframe after a short delay.
 *
 * @param {WebPageProps} props - The props for the `WebPage` component.
 * @param {string} props.currentView - The current view of the application.
 * @returns {JSX.Element} - The rendered `WebPage` component.
 */
const WebPage: React.FC<WebPageProps> = ({ currentView }) => {
  const ip = useSettingsStore((state) => state.manifest.ip)
  const port = useSettingsStore((state) => state.manifest.port)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const appSettings = useAppStore((state) => state.appSettings)
  const music = useMusicStore((state) => state.song)
  const apps = useAppStore((state) => state.apps)
  const addWebsocketListener = useWebSocketStore((state) => state.addListener)
  const sendSocket = useWebSocketStore((state) => state.send)
  const getActionUrl = useMappingStore((state) => state.getActionUrl)
  const getKeyUrl = useMappingStore((state) => state.getKeyUrl)
  const executeAction = useMappingStore((state) => state.executeAction)
  const executeKey = useMappingStore((state) => state.executeKey)
  const currentTime = useTimeStore((state) => state.currentTimeFormatted)
  const manifest = useSettingsStore((state) => state.manifest)

  // Handles triggering actions
  const handleAction = (data: AppTriggerAction) => {
    executeAction({ source: currentView, ...data.payload })
  }

  // Handles any button presses from the iframe to the main app
  const handleButton = (data: AppTriggerButton) => {
    // I did this to myself...
    const legacyMap = {
      KeyUp: EventMode.KeyUp,
      KeyDown: EventMode.KeyDown,
      Left: EventMode.ScrollLeft,
      Right: EventMode.ScrollRight,
      Up: EventMode.ScrollUp,
      Down: EventMode.ScrollDown
    }

    // This is a legacy mapping for the old way of doing things
    const legacylegacyMap = {
      Up: EventMode.KeyUp,
      Down: EventMode.KeyDown,
      Left: EventMode.ScrollLeft,
      Right: EventMode.ScrollRight
    }
    executeKey(
      data.payload.button,
      legacyMap[data.payload.mode] || legacylegacyMap[data.payload.flavor] || EventMode.KeyDown
    )
  }

  // Handles any key presses from the iframe to the main app
  const handleKey = (data: AppTriggerKey) => {
    executeKey(data.payload.key, data.payload.mode)
  }

  // Handles any music requests from the iframe to the main app
  const handleMusic = (data: AppDataRequest) => {
    if (data.type == 'get') {
      send({ type: 'music', app: 'client', payload: music })
    }
  }

  // Handles any settings requests from the iframe to the main app
  const handleSettings = (data: AppDataRequest) => {
    if (data.type == 'get') {
      send({ type: 'settings', app: 'client', payload: appSettings[currentView] })
    }
  }

  // Handles any apps requests from the iframe to the main app
  const handleApps = (data: AppDataRequest) => {
    if (data.type == 'get') {
      send({ type: 'apps', app: 'client', payload: apps })
    }
  }

  // Handles any key icon requests from the iframe to the main app
  const handleKeyIcon = (data: AppDataKey) => {
    if (data.type == 'get') {
      const actionUrl = getKeyUrl(data.payload)
      send({ type: data.payload.key, app: 'client', payload: actionUrl })
    }
  }

  // Handles any action icon requests from the iframe to the main app
  const handleActionIcon = (data: AppDataAction) => {
    if (data.type == 'get') {
      const actionUrl = getActionUrl(data.payload)
      send({ type: data.payload.id, app: 'client', payload: actionUrl })
    }
  }

  const handleLog = (data: AppTriggerLog) => {
    Logger.log(data.request, currentView, data.payload.message, ...data.payload.data)
  }

  const handleManifest = () => {
    send({ type: 'manifest', app: 'client', payload: manifest })
  }

  const buttonHandlers: {
    button: (data: AppTriggerButton) => void
    key: (data: AppTriggerKey) => void
    action: (data: AppTriggerAction) => void
    log: (data: AppTriggerLog) => void
  } = {
    button: handleButton,
    key: handleKey,
    action: handleAction,
    log: handleLog
  }

  const getRequestHandlers = {
    music: handleMusic,
    settings: handleSettings,
    apps: handleApps,
    key: handleKeyIcon,
    action: handleActionIcon,
    manifest: handleManifest
  }

  const send = (data: IframeData) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const augmentedData = { ...data, source: 'deskthing' }
      iframeRef.current.contentWindow.postMessage(augmentedData, '*')
    }
  }

  useEffect(() => {
    const removeListener = addWebsocketListener((data) => {
      if (data.app != currentView) return
      send(data as IframeData)
    })

    return () => {
      removeListener()
    }
  }, [currentView, addWebsocketListener])

  useEffect(() => {
    if (music) {
      send({ type: 'music', app: 'client', payload: music })
    }
  }, [music])
  useEffect(() => {
    if (apps) {
      send({ type: 'apps', app: 'client', payload: apps })
    }
  }, [apps])
  useEffect(() => {
    if (appSettings && appSettings[currentView]) {
      send({ type: 'settings', app: 'client', payload: appSettings[currentView] })
    }
  }, [appSettings, currentView])
  useEffect(() => {
    if (currentTime) {
      send({ type: 'time', app: 'client', payload: currentTime })
    }
  }, [currentTime])

  useEffect(() => {
    const sendDefaultData = async () => {
      send({ type: 'music', app: 'client', payload: music })
      if (appSettings && appSettings[currentView]) {
        send({ type: 'settings', app: 'client', payload: appSettings[currentView] })
      }
      currentTime && send({ type: 'time', app: 'client', payload: currentTime })
    }

    const id = setTimeout(sendDefaultData, 1000)

    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    const handleIframeEvent = (event: MessageEvent) => {
      if (event.origin != `http://${ip}:${port}`) return

      const appDataRequest = event.data.payload as AppDataRequest

      if (appDataRequest.app == 'client') {
        if (appDataRequest.type === 'get') {
          if (getRequestHandlers[appDataRequest.request]) {
            getRequestHandlers[appDataRequest.request](appDataRequest)
          } else {
            Logger.error('Unknown request type: ', appDataRequest.request)
          }
        } else if (appDataRequest.type === 'button') {
          buttonHandlers.button(appDataRequest)
        } else if (appDataRequest.type === 'key') {
          buttonHandlers.key(appDataRequest)
        } else if (appDataRequest.type === 'action') {
          buttonHandlers.action(appDataRequest)
        } else if (appDataRequest.type === 'log') {
          buttonHandlers.log(appDataRequest)
        }
      } else {
        sendSocket({
          ...appDataRequest,
          app: appDataRequest.app || currentView
        } as OutgoingSocketAction)
      }
    }

    window.addEventListener('message', handleIframeEvent)

    return () => {
      window.removeEventListener('message', handleIframeEvent)
    }
  }, [ip, port, sendSocket, appSettings, currentView])

  return (
    <>
      <TimeUpdater />
      <iframe
        ref={iframeRef}
        src={`http://${ip}:${port}/app/${currentView}`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Web View"
        height="100%"
        width="100%"
      />
    </>
  )
}

export default WebPage
