import React, { useEffect, useRef, useState } from 'react'
import WebSocketService from '../../helpers/WebSocketService'
import { ManifestStore, AppStore, LogStore, MusicStore, log } from '../../stores'
import { App, EventFlavor, SocketData, SongData, AppListSettings } from '../../types'
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
    const listener = (msg: SocketData) => {
      if (msg.type === 'time') {
        returnMessage({ type: 'time', payload: msg.payload })
      }
    };

    const removeTimeListener = socket.on('client', listener);

    const returnMessage = (data: Partial<SocketData>) => {
      const message = {
        app: data.app || 'client',
        type: data.type || null,
        request: data.request || null,
        payload: data.payload || null,
        source: 'deskthing'
      }
      sendMessageToIframe(message)
    }

    const onAppUpdate = (app: App[]) => {
      returnMessage({ type: 'apps', payload: app })
    }
    const onMusicUpdate = (song: SongData) => {
      returnMessage({ type: 'music', payload: song })
    }
    const onMessageUpdate = (message: log) => {
      returnMessage({ type: 'message', payload: message.payload })
    }
    const onSettingsUpdate = (settings: AppListSettings) => {
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
              case 'music':
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
          case 'button':
            console.log(data)
            if (data.payload.button && data.payload.flavor) {
              ActionHelper.executeAction(data.payload.button, EventFlavor[data.payload.flavor as keyof typeof EventFlavor])
            } else {
              console.error('Error! Button or flavor not found!')
              logStore.sendMessage(currentView, 'Error! Button or flavor not found!')
            }
            break
          case 'action':
            console.log(data)
            if (data.payload.id && data.payload.source) {
              ActionHelper.runAction(data.payload, data.payload.val || 0)
              
            } else {
              console.error('Error! Action source or ID not found!')
              logStore.sendMessage(currentView, 'Error! Action source or ID not found!')
            }
            break
          }
      } else if (socket.is_ready()) {
        console.log('Not client - routing to app')
        socket.post(data);
      }
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      unsubscribeRefs.current.app()
      unsubscribeRefs.current.music()
      unsubscribeRefs.current.message()
      unsubscribeRefs.current.settings()
      removeTimeListener()
    };
  }, [currentView, ip, port, socket]);

  const sendMessageToIframe = (data: SocketData) => {
    console.log('Sending message', data)
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
    <div className='max-h-fit h-full overflow-hidden'>
        <div 
          className={`touch-auto fixed w-screen bg-black/50 h-10 border-b-green-500 border-b-2 ${
            swipeVisible ? 'opacity-100 h-28' : 'opacity-0'
          } transition-all duration-300 flex items-center justify-center text-xl z-10`}
          ref={swipeRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {swipeVisible ? 'Swipe' : ''}
        </div>
        <div className={`${swipeVisible ? 'blur' : ''} h-full transition-all duration-75`}>
          <iframe
            ref={iframeRef}
            src={`http://${ip}:${port}/${currentView}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Web View"
            height="100%"
            width="100%"
          />
        </div>
    </div>
  )
}

export default Web
