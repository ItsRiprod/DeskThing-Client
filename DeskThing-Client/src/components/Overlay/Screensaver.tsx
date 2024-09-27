  import React, { useEffect, useState } from 'react';
  import { UIStore } from '../../stores';
import WebSocketService from '../../helpers/WebSocketService';
import { IconLogo } from '../../assets/Icons';

  const Screensaver: React.FC = () => {
    const [screensaver, setScreensaver] = useState(false);
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
      const handleScreensaverState = (value: boolean) => {
        console.log('Screensaver state changed:', value);
        console.log('setting screen saver to', value);
        setScreensaver(value);
        if (value) {
          setTimeout(() => setOpacity(100), 50);
        } else {
          setOpacity(0);
        }
      };

      UIStore.getInstance().on('screensaver', (data) => handleScreensaverState(data as boolean));
    }, []);

    const onClick = () => {
      console.log('Reconnecting...');
      WebSocketService.reconnect()
    }

    if (!screensaver) return null;

    return (
      <div className={`transition-opacity duration-1000 opacity-${opacity} z-10 max-w-full absolute left-0 bottom-0 w-screen h-screen bg-black overflow-hidden`}>
        <div className="absolute w-screen h-screen overflow-hidden inset-0 blur-xl">
          <div className="absolute bg-gradient-radial inset-0 from-green-500/25 to-black animate-float w-[100vw] h-[100w]"></div>
        </div>
        <div className="absolute w-full h-full z-10 flex items-center blur-xl justify-center text-white text-4xl">
              <IconLogo className="w-full h-full -translate-y-10" />
          </div>
        <div className="relative z-10 w-full h-full flex items-center justify-center text-white text-4xl"
         onClick={onClick}>
              <IconLogo className="w-full h-full -translate-y-10" />
          </div>
      </div>
    );
  };

  export default Screensaver;

  // Add these styles to your global CSS or Tailwind config
  /*
  @keyframes gradientMove {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .bg-gradient-radial {
    background: radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%);
  }

  .animate-gradient-move {
    animation: gradientMove 15s ease infinite;
    background-size: 400% 400%;
  }
  */