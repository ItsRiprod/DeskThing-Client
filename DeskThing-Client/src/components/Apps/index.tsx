import { useState, useEffect  } from 'react';
import Utility from './Utility';
import Dashboard from './Dashboard';
import Web from './Web';
import Landing from './Landing';

import { UIStore } from '../../stores';

const Apps = () => {
  const uiStore = UIStore.getInstance();
  const [currentView, setCurrentView] = useState<string>(uiStore.getCurrentView());  

  useEffect(() => {
    const handleViewUpdate = (view: string) => {
      setCurrentView(view)
      console.log(view)
    };
  
    const unsubscribe = uiStore.on('currentView', handleViewUpdate);
    return () => {
      unsubscribe();
    };
  });

  const renderView = () => {
    switch (currentView) {
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