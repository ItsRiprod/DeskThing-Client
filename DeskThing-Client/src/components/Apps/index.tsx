import { useState, useEffect  } from 'react';
import Utility from './Utility';
import Dashboard from './Dashboard';
import Web from './Web';
import Landing from './Landing';
import Player from './Player';

/* Legacy Apps - will remove */
import Spotify from './Legacy/Spotify'
import Weather from './Legacy/Weather'
import Local from './Legacy/Local';

import { UIStore } from '../../stores';

const Apps = () => {
  const uiStore = UIStore.getInstance();
  const [currentView, setCurrentView] = useState<string>(uiStore.getCurrentView());  
  const [miniplayerState, setMiniplayerState] = useState<string>(uiStore.getMiniplayerMode())

  useEffect(() => {
    const handleViewUpdate = (view: string) => {
      setCurrentView(view)
    };
    const handleMiniplayer = (state: string) => {
      setMiniplayerState(state)
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
        return <Dashboard />
      case 'landing':
        return <Landing />
      case 'utility':
        return <Utility />
      case 'player':
        return <Player />
        /* legacy apps - will remove */
      case 'spotify':
        return <Spotify />
      case 'weather':
        return <Weather />
      case 'local':
        return <Local />
      default:
        console.log('Unknown view:', currentView);
        return <Web currentView={currentView} />
      }
  };

  return (
      <div className={`max-w-screen w-screen bg-black max-h-screen h-screen ${miniplayerState == 'peek' ? 'pb-32' : miniplayerState == 'hidden' ? 'pb-0' : 'pb-20'}`}>
          {renderView()}
      </div>
    )
};

export default Apps;