import { useState, useEffect  } from 'react';
import Utility from './Utility';
import Dashboard from './Dashboard';
import Web from './Web';
import Landing from './Landing';
import Player from './Player';

import { UIStore } from '../../stores';

const Apps = () => {
  const uiStore = UIStore.getInstance();
  const [currentView, setCurrentView] = useState<string>(uiStore.getCurrentView());  
  const [miniplayerState, setMiniplayerState] = useState<boolean>(uiStore.getMiniplayerMode() != 'hidden')

  useEffect(() => {
    const handleViewUpdate = (view: string) => {
      setCurrentView(view)
    };
    const handleMiniplayer = (state: string) => {
      setMiniplayerState(state != 'hidden')
    };
  
    const unsubscribe = uiStore.on('currentView', handleViewUpdate);
    const unsubscribeMiniplayer = uiStore.on('miniplayerMode', handleMiniplayer);
    return () => {
      unsubscribe();
      unsubscribeMiniplayer()
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
      case 'player':
        return <Player />;
      default:
        return <Web currentView={currentView} />
      }
  };

  return (
      <div className={`max-w-screen w-screen bg-black max-h-screen h-screen ${miniplayerState && 'pb-32'}`}>
          {renderView()}
      </div>
    )
};

export default Apps;