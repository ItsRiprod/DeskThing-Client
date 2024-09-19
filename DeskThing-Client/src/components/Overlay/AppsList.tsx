/**
 * @file Overlay.tsx
 * @description Overlay component for the DeskThing-Client.
 * @author Riprod
 * @version 0.8.0
 */
import React, { useEffect, useState } from 'react';
import { App, ViewMode } from '../../types';
import { UIStore } from '../../stores/';

const AppSelector: React.FC = () => {
  const uiStore = UIStore.getInstance()
  const [apps, setApps] = useState<App[]>(uiStore.getAvailableViews())
  const [currentView, setCurrentView] = useState<string>(uiStore.getCurrentView())
  const [state, setState] = useState<ViewMode>(uiStore.getAppsListMode())

  useEffect(() => {
    const handleStateUpdate = (data: string) => {
      setCurrentView(data)
    };
    const handleViewUpdate = (data: App[]) => {
      setApps(data)
    };
    const handleListMode = (data: ViewMode) => {
      setState(data)
    };

    const unsubscribeState = uiStore.on('currentView', handleStateUpdate)
    const unsubscribeView = uiStore.on('availableViews', handleViewUpdate)
    const unsubscribeList = uiStore.on('appsListMode', handleListMode)

    return () => {
        unsubscribeState()
        unsubscribeView()
        unsubscribeList()
    };
  })

  const onAppSelect = (appId: string) => {
    uiStore.setCurrentView(appId)
  }

  return (
    <div className={`absolute z-50 w-screen pb-5 justify-around content-start flex flex-wrap overflow-hidden top-0 left-0 ${state == 'full' ? ' h-screen overflow-y-auto bg-black pt-2' : state == 'peek' ? 'bg-black border-b-2 border-b-green-500' : '-translate-y-28 overflow-hidden max-h-28'} transition-all`}>
      {apps.map((app, index) => 
        app.manifest?.isLocalApp || app.manifest?.isWebApp ?
        (
          <button
            key={app.manifest.id}
            className={`bg-black m-1 h-24 p-5 border rounded-lg cursor-pointer w-1/5 ${index < 4 || state == 'full' ? 'preferred' : 'hidden'} ${currentView === app.manifest.id ? 'border-green-600' : 'border-white'}`}
            onClick={() => onAppSelect(app.manifest.id)}
          >
            <p className="text-white flex items-center justify-center text-center text-sm">
              {app.manifest? app.manifest.label : app.name}
            </p>
          </button>
        )
        :
        (<div key={index}></div>)
      )}
     
    </div>
  );
};

export default AppSelector;