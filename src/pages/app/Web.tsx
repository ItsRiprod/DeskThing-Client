import { useAppStore, useMusicStore, useSettingsStore, useWebSocketStore } from "@src/stores"
import { IframeData } from "@src/types"
import { useRef, useEffect } from "react"

interface WebPageProps {
    currentView: string
}

const WebPage: React.FC<WebPageProps> = ({ currentView }) => {
    const ip = useSettingsStore((state) => state.manifest.ip)
    const port = useSettingsStore((state) => state.manifest.port)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const appSettings = useAppStore((state) => state.appSettings)
    const music = useMusicStore((state) => state.song)
    const addWebsocketListener = useWebSocketStore((state) => state.addListener)

    const send = (data: IframeData) => {
        console.log('Sending message', data)
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(data, '*');
        }
    };

    useEffect(() => {
        const removeListener = addWebsocketListener((data) => {
            if (data.app != currentView) return
            const augmentedData = { ...data, source: 'deskthing' }
            send(augmentedData as IframeData)
        })

        return () => {
            removeListener()
        }
    }, [currentView, addWebsocketListener])

    useEffect(() => {
        send({ type: 'music', app: 'client', payload: music })
    }, [music])
      useEffect(() => {
          if (appSettings && appSettings[currentView]) {
              send({ type: 'settings', app: 'client', payload: appSettings[currentView] })
          }
      }, [appSettings, currentView])




    return (
        <iframe
            ref={iframeRef}
            src={`http://${ip}:${port}/app/${currentView}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Web View"
            height="100%"
            width="100%"
        />
    )
}

export default WebPage