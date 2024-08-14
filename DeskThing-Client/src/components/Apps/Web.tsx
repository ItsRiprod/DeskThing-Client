import React, { useEffect, useRef, useState } from 'react'
import WebSocketService from '../../helpers/WebSocketService'
import { ManifestStore } from '../../stores'
import { SocketData } from '../../types'

interface WebViewProps {
  currentView: string
}

const Web: React.FC<WebViewProps> = ({ currentView }) => {
  const socket = WebSocketService
  const manifestStore = ManifestStore.getInstance()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [swipeVisible, setSwipeVisible] = useState(false)
  const swipeRef = useRef<HTMLDivElement>(null)
  const port = manifestStore.getManifest().port
  const ip = manifestStore.getManifest().ip

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle incoming messages from the iframe
      if (event.origin != `http://${ip}:${port}`) return

      console.log('Received message from iframe:', event)
      if (socket.is_ready()) {
        const payload = event.data.payload
        const data = {
          app: payload.app || currentView,
          type: payload.type || null,
          request: payload.request || null,
          data: payload.data || null,
        };
        socket.post(data);
      }
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
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
    
    sendMessageToIframe({ app: 'client', type: 'meta', data: {ip: ip, port: port} })
    
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
    <div className='max-h-screen h-screen pb-14 overflow-hidden'>
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
        />
        
    </div>
  )
}

export default Web
