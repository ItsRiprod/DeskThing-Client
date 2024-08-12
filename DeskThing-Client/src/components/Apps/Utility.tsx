/**
 * @file Utility.tsx
 * @description Utility component for the DeskThing-Client.
 * @author Riprod
 * @version 0.8.0
 */

import { useEffect, useState } from "react";
import { AppStore, UIStore } from "../../stores";
import { App, Settings } from "../../types";
import Landing from "./Landing";
import WebSocketService from "../../helpers/WebSocketService";

const Utility: React.FC = () => {
    const uiStore = UIStore.getInstance()
    const appStore = AppStore.getInstance()
    const socket = WebSocketService
    const [miniplayer, setMiniplayer] = useState<boolean>(uiStore.getMiniplayerMode() != 'hidden')
    const [apps, setApps] = useState<App[]>(appStore.getApps())
    const [settings, setSettings] = useState<Settings>(appStore.getSettings())
    const [selectedApp, setSelectedApp] = useState<string>('')
    const [currentSetting, setCurrentSetting] = useState<string>('')

    const sendSettingsUpdate = (app: string, setting: string, value: string) => {
        if (socket.is_ready()) {
          const data = {
            app: app,
            type: 'set',
            request: 'update_setting',
            data: {
              setting: setting,
              value: value,
            }
          };
          socket.post(data);
        }

        
      }

    useEffect(() => {
        const updateMiniplayer = (state: string) => {
            setMiniplayer(state != 'hidden')
        }

        const updateApps = (apps: App[]) => {
            setApps(apps)
        }
        
        const updateSettings = (settings: Settings) => {
            console.log('Setting the settings')
            setSettings(settings)
        }
        
        const uiListener = uiStore.on('miniplayerMode', updateMiniplayer)
        const appListener = appStore.onAppUpdates(updateApps)
        const settingListener = appStore.onSettingsUpdates(updateSettings)
        return () => {
            uiListener()
            appListener()
            settingListener()
        }
    }, [uiStore, appStore])

    const selectApp = (appName: string) => {
        setSelectedApp(appName)
    }
    const selectSetting = (setting: string) => {
        if (setting == currentSetting) {
            setCurrentSetting('')
        } else {
            setCurrentSetting(setting)
        }
    }

    return (

        <div className={`flex w-full max-h-full h-full flex-col sm:flex-row bg-black`}>
            <div className="border w-32 h-full border-slate-500 flex flex-row sm:flex-col rounded-lg py-5 overflow-y-scroll overflow-x-hidden pb-10 m-2">
                {apps.map((app, index) => (
                    <button key={index} className={`p-5 rounded-xl border-l-2 ${selectedApp == app.name ? 'border-green-500 bg-slate-800' : '' }`} onClick={() => selectApp(app.name)}>
                        {app.name}
                    </button>
                )
                )}
            </div>            
            <div className="border border-slate-500 h-full w-full m-2 rounded-lg p-5 overflow-y-scroll">
                {selectedApp && settings[selectedApp] ? 
                    Object.keys(settings[selectedApp]).map((setting, index) => (
                        <div key={index} className={`${currentSetting == setting && 'bg-gray-700'} w-full border mb-5 rounded-2xl h-fit overflow-hidden`}>
                            <button className={`w-full font-semibold flex justify-between p-5`} onClick={() => selectSetting(setting)}>
                                <p>
                                    {settings[selectedApp][setting].label}
                                </p>
                                <p className="bg-gray-500 font-geistMono min-w-fit w-1/2">
                                    {settings[selectedApp][setting].value}
                                </p>
                            </button>
                            <div className="px-2 overflow-y-scroll">
                                {currentSetting == setting && settings[selectedApp][setting].options.map((option, index) => (
                                    <button 
                                        key={index} 
                                        className={`${settings[selectedApp][setting].value == option.value && 'border-x-green-500'} w-full my-4 rounded-xl border-x flex justify-between p-5`}
                                        onClick={() => sendSettingsUpdate(selectedApp, setting, option.value)}>
                                        <p>{option.label}</p>
                                        <p>{option.value}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))
                :
                (
                    <Landing />
                )
                }
            </div>
        </div>
    )
}

export default Utility;