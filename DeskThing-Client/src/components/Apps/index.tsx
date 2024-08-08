import { useState, useEffect  } from 'react';
import Utility from './Utility';
import Dashboard from './Dashboard';
import Web from './Web';
import Landing from './Landing';

import { AppStore } from '../../stores';

const Apps = () => {
  const appStore = AppStore.getInstance();
  const [currentView, setCurrentView] = useState<string>(appStore.getCurrentView());  

  useEffect(() => {
    const handleAppUpdate = () => {
      setCurrentView(appStore.getCurrentView())
    };
  
    const unsubscribe = appStore.onAppUpdates(handleAppUpdate);
    return () => {
      unsubscribe();
    };
  }, [appStore]);

  const renderView = () => {
    switch (appStore.getCurrentView()) {
      case 'dashboard':
        return <Dashboard />;
      case 'landing':
        return <Landing />;
      case 'utility':
        return <Utility />;
      default:
        return <Web currentView={currentView} />
      }
  };

  return (
      <div className="h-screen view_container touch-none">
          {renderView()}
      </div>
    )
};

export default Apps;