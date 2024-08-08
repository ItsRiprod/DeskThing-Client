import React, { useEffect, useState } from 'react';
import { App } from '../../types';
import { AppStore } from '../../stores';

const AppSelector: React.FC = () => {
  const appStore = AppStore.getInstance()
  const [apps, setApps] = useState<App[]>(appStore.getApps())
  const [currentView, setCurrentView] = useState<string>(appStore.getCurrentView())
  const [active, setActive] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    const handleAppUpdate = (data: App[]) => {
      setApps(data)
      setCurrentView(appStore.getCurrentView())
    };

    const unsubscribe = appStore.onAppUpdates(handleAppUpdate);

    return () => {
      unsubscribe()
    };
  })

  const onAppSelect = (appId: string) => {
    appStore.setCurrentView(appId)
  }

  return (
    <div className={`absolute z-50 w-screen pb-5 justify-around flex flex-wrap overflow-hidden top-0 left-0 ${visible ? ' h-screen overflow-y-auto bg-gray-800' : active ? 'bg-gray-900' : '-translate-y-28'} transition-all`}>
      {apps.map((app, index) => 
        app.manifest?.isLocalApp || app.manifest?.isWebApp ?
        (<button
          key={app.manifest.id}
          className={`bg-black m-1 h-24 p-5 border rounded-lg cursor-pointer w-1/5 ${app.prefIndex < 5 || visible ? 'preferred' : 'hidden'} ${currentView === app.manifest.id ? 'border-green-600' : 'border-white'}`}
          onClick={() => onAppSelect(app.manifest.id)}
        >
          {app.manifest? app.manifest.label : app.name}
        </button>)
        :
        (<div key={index}></div>)
      )}
     
    </div>
  );
};

export default AppSelector;