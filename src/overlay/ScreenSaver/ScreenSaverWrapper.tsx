  import React, { useEffect, useState } from 'react';
  import { useSettingsStore } from '@src/stores';
  import Clock from '@src/pages/clock';
  import { ScreenSaverLogo } from './Logo';
import { IconX } from '@src/assets/Icons';
import Button from '@src/components/ui/Button';

  const ScreenSaverWrapper: React.FC = () => {
    const preferences = useSettingsStore((state) => state.preferences);
    const [screensaverActive, setScreensaverActive] = useState(false);
    const [screenSaverDismissed, setScreenSaverDismissed] = useState(false);
    const [dismissedTimeoutId, setDismissedTimeoutId] = useState<NodeJS.Timeout | null>(null);
    useEffect(() => {
      if (screenSaverDismissed) return

        const timeoutId = setTimeout(() => {
            setScreensaverActive(true);
        }, 5000);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [screensaverActive, screenSaverDismissed])

    const restartDismissedTimeout = () => {
      if (dismissedTimeoutId) {
        clearTimeout(dismissedTimeoutId);
      }
      const timeoutId = setTimeout(() => {
        setScreenSaverDismissed(false);
      }, 15000);
      setDismissedTimeoutId(timeoutId);
    };

    useEffect(() => {

      const handleActivity = () => {
        restartDismissedTimeout()
      };

      window.addEventListener('keydown', handleActivity);
      window.addEventListener('mousedown', handleActivity);
      return () => {
        window.removeEventListener('mousedown', handleActivity);
        window.removeEventListener('keydown', handleActivity);
      };
    }, [screenSaverDismissed])

    const handleClose = () => {
        setScreensaverActive(false);
        setScreenSaverDismissed(true);
        restartDismissedTimeout()
    };


    const renderScreenSaver = () => {
      switch (preferences.ScreensaverType?.type || 'black') {
        case 'clock':
          return <Clock />;
        case 'logo':
          return <ScreenSaverLogo />;
        case 'black':
        default:
          return null;
      }
    };

    return (
        <div className={`${screensaverActive ? 'max-h-full z-10' : 'max-h-0'} w-full overflow-hidden duration-[3s] fixed h-full flex items-center justify-center transition-all`}>
            <div className={`${screensaverActive ? 'bg-black opacity-100' : 'bg-black/0 opacity-0'} w-screen duration-[5s] shrink-0 h-screen transition-all`}>
                {renderScreenSaver()}
                <Button  className="absolute top-2 right-2" onClick={handleClose}>
                  <IconX />
                </Button>
            </div>
        </div>
    );
  };

  export default ScreenSaverWrapper;
