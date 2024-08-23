import React, { useEffect, useRef, useState } from 'react'
import WebSocketService from '../../helpers/WebSocketService'
import { ManifestStore, AppStore, LogStore, MusicStore, log } from '../../stores'
import { App, EventFlavor, Settings, SocketData, SongData } from '../../types'
import ActionHelper from '../../helpers/ActionHelper'

interface WebViewProps {
  currentView: string
}

const Web: React.FC<WebViewProps> = ({ currentView }) => {
  const appStore = AppStore.getInstance()
  const logStore = LogStore.getInstance()
  const musicStore = MusicStore.getInstance()
  const manifestStore = ManifestStore.getInstance()
  const socket = WebSocketService
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [swipeVisible, setSwipeVisible] = useState(false)
  const swipeRef = useRef<HTMLDivElement>(null)
  const port = manifestStore.getManifest().port
  const ip = manifestStore.getManifest().ip

  const unsubscribeRefs = useRef({
    app: () => {},
    music: () => {},
    message: () => {},
    settings: () => {}
  });

  useEffect(() => {
    const returnMessage = (data: Partial<SocketData>) => {
      const message = {
        app: data.app || 'client',
        type: data.type || null,
        request: data.request || null,
        data: data.payload || null,
      }
      sendMessageToIframe(message)
    }

    const onAppUpdate = (app: App[]) => {
      returnMessage({ type: 'apps', payload: app })
    }
    const onMusicUpdate = (song: SongData) => {
      returnMessage({ type: 'song', payload: song })
    }
    const onMessageUpdate = (message: log) => {
      returnMessage({ type: 'message', payload: message.payload })
    }
    const onSettingsUpdate = (settings: Settings) => {
      returnMessage({ type: 'settings', payload: settings })
    }

    const handleMessage = (event: MessageEvent) => {
      // Handle incoming messages from the iframe
      if (event.origin != `http://${ip}:${port}`) return

      console.log('Received message from iframe:', event)
      const payload = event.data.payload
      const data = {
        app: payload.app || currentView,
        type: payload.type || null,
        request: payload.request || null,
        payload: payload.payload || null,
      };

      if (data.app == 'client') {
        switch (data.type) {
          case 'on':
            switch (data.request) {
              case 'apps':
                if (unsubscribeRefs.current.app) {
                  unsubscribeRefs.current.app()
                }
                unsubscribeRefs.current.app = appStore.onAppUpdates(onAppUpdate)
                break
              case 'music':
                if (unsubscribeRefs.current.music) {
                  unsubscribeRefs.current.music()
                }
                unsubscribeRefs.current.music = musicStore.subscribeToSongDataUpdate(onMusicUpdate)
                break
              case 'message':
                if (unsubscribeRefs.current.message) {
                  unsubscribeRefs.current.message()
                }
                unsubscribeRefs.current.message = logStore.on('message', onMessageUpdate)
                break
              case 'settings':
                if (unsubscribeRefs.current.settings) {
                  unsubscribeRefs.current.settings()
                }
                unsubscribeRefs.current.settings = appStore.onSettingsUpdates(onSettingsUpdate)
                break
            }
            break
          case 'off':
            switch (data.request) {
              case 'apps':
                if (unsubscribeRefs.current.app) {
                  unsubscribeRefs.current.app()
                }
                break
              case 'music':
                if (unsubscribeRefs.current.music) {
                  unsubscribeRefs.current.music()
                }
                break
              case 'message':
                if (unsubscribeRefs.current.message) {
                  unsubscribeRefs.current.message()
                }
                break
              case 'settings':
                if (unsubscribeRefs.current.settings) {
                  unsubscribeRefs.current.settings()
                }
                break
            }
            break
          case 'get':
            switch (data.request) {
              case 'apps':
                onAppUpdate(appStore.getApps())
                break
              case 'song':
                onMusicUpdate(musicStore.getSongData())
                break
              case 'messages':
                returnMessage({type: 'messages', payload: logStore.getMessages()})
                break
              case 'settings':
                onSettingsUpdate(appStore.getSettings())
                break
            }
            break
          case 'action':
            console.log(data)
            if (data.payload.button && data.payload.flavor) {
              ActionHelper.executeAction(data.payload.button, EventFlavor[data.payload.flavor as keyof typeof EventFlavor])
            } else {
              console.error('Error! Button or flavor not found!')
              logStore.sendMessage(currentView, 'Error! Button or flavor not found!')
            }
            break
          }
      } else if (socket.is_ready()) {
        socket.post(data);
      }
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      unsubscribeRefs.current.app()
      unsubscribeRefs.current.music()
      unsubscribeRefs.current.message()
    };
  }, [currentView, ip, port, socket]);

  const sendMessageToIframe = (data: SocketData) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(data, '*');
    }
  };

  useEffect(() => {
    const routeData = (data: SocketData) => {
        const augmentedData = { ...data, source: 'deskthing' }
        sendMessageToIframe(augmentedData)
    }

    const removeListener = socket.on(currentView, (data) => routeData(data))
    
    sendMessageToIframe({ app: 'client', type: 'meta', payload: {ip: ip, port: port} })
    
    return () => {
      removeListener()
    }
  }, [])

  const handleTouchStart = () => {
    setSwipeVisible(true)
  }

  const handleTouchEnd = () => {
    setTimeout(() => {
      setSwipeVisible(false)
    }, 4000)
  }

  return (
    <div className='max-h-screen h-screen overflow-hidden'>
        <div className="touch-none w-full h-0 flex justify-center items-center bg-red-200">
            <div
              ref={swipeRef}
              className={`touch-auto fixed h-10 rounded-2xl top-2 bg-gray-500 ${
                swipeVisible ? 'opacity-100 w-11/12 h-4/6 flex items-center justify-center text-6xl' : 'opacity-30 w-1/4'
              } transition-all duration-300`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {swipeVisible ? 'Swipe' : ''}
            </div>
        </div>
        <iframe
          ref={iframeRef}
          src={`http://${ip}:${port}/${currentView}`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Web View"
          height="100%"
          width="100%"
        />
        
    </div>
  )
}

export default Web
