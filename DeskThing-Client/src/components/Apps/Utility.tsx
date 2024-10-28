/**
 * @file Utility.tsx
 * @description Utility component for the DeskThing-Client.
 * @author Riprod
 * @version 0.8.0
 */

import { useEffect, useState } from "react";
import { AppStore, log, LOG_TYPES, LogStore, UIStore } from "../../stores";
import { App, AppSettings } from "../../types";
import Landing from "./Landing";
import WebSocketService from "../../helpers/WebSocketService";

const Utility: React.FC = () => {
    const appStore = AppStore.getInstance()
    const socket = WebSocketService
    const logStore = LogStore.getInstance()
    const [logs, setLogs] = useState<log[]>(logStore.getAllLogs() || [])
    const [apps, setApps] = useState<App[]>(appStore.getApps() || [])
    const [settings, setSettings] = useState<AppSettings>(appStore.getSettings())
    const [selectedApp, setSelectedApp] = useState<string>('')
    const [currentSetting, setCurrentSetting] = useState<string>('')
    const [logFilter, setLogFilter] = useState<LOG_TYPES | 'all'>('all');

    const sendSettingsUpdate = (app: string, setting: string, value: string | number) => {
        if (socket.is_ready()) {
          const data = {
            app: app,
            type: 'set',
            request: 'settings',
            payload: {
              id: setting,
              value: value,
            }
          };
          socket.post(data);
        }

        appStore.requestUpdatedData()
        
      }

    useEffect(() => {

        const updateApps = (apps: App[]) => {
            setApps(apps)
        }
        
        const updateSettings = (settings: AppSettings) => {
            console.log('Setting the settings')
            setSettings(settings)
        }
        
        const appListener = appStore.onAppUpdates(updateApps)
        const settingListener = appStore.onSettingsUpdates(updateSettings)
        const removeLogListener = logStore.on('all', (log: log) => {
            setLogs(oldLogs => [...oldLogs, log])
        })
        return () => {
            appListener()
            settingListener()
            removeLogListener()
        }
    }, [appStore])

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

    const clearLogs = () => {
        logStore.clearLogs();
        setLogs([]);
    }

    const filterLogs = (type: LOG_TYPES | 'all') => {
        setLogFilter(type);
    }

    const openDevView = () => {
      UIStore.getInstance().setCurrentView('dev')
    }

    return (
      <div
        className={`flex w-full max-h-full h-full flex-col-reverse sm:flex-row bg-black`}
      >
        <div
          className="border sm:w-32 smL:h-full border-slate-500 flex flex-row sm:flex-col rounded-lg sm:py-5 overflow-y-scroll sm:overflow-x-hidden sm:pb-10 m-2">
          <button
            className={`p-5 rounded-xl border sm:border-l-2 ${selectedApp == "logs" ? "border-green-500 bg-slate-800" : ""}`}
            onClick={() => selectApp("logs")}>
            <p className="h-full items-center flex ">Logs</p>
          </button>
          {apps.map((app, index) => (
            <button
              key={index}
              className={`p-5 rounded-xl border sm:border-l-2 ${selectedApp == app.name ? "border-green-500 bg-slate-800" : ""}`}
              onClick={() => selectApp(app.name)}
            >
              <p className="h-full items-center flex ">{app.name}</p>
            </button>
          ))}
          <button
            className={`p-5 rounded-xl border sm:border-l-2 ${selectedApp == "logs" ? "border-green-500 bg-slate-800" : ""}`}
            onClick={() => selectApp("dev")}>
            <p className="h-full items-center flex ">config</p>
          </button>
        </div>
        <div className="border border-slate-500 h-full w-full m-2 rounded-lg p-5 overflow-y-scroll">
          {selectedApp && selectedApp !== 'logs' && settings[selectedApp] ? (
            Object.keys(settings[selectedApp]).map((setting, index) => (
              <div
                key={index}
                className={`${currentSetting == setting && "bg-gray-700"} w-full border mb-5 rounded-2xl h-fit overflow-hidden`}
              >
                <button
                  className={`w-full font-semibold flex justify-between p-5`}
                  onClick={() => selectSetting(setting)}
                >
                  <p>{settings[selectedApp][setting].label}</p>
                  <p className="bg-gray-500 font-geistMono min-w-fit w-1/2">
                    {settings[selectedApp][setting].value}
                  </p>
                </button>
                <div className="px-2 overflow-y-scroll">
                  {currentSetting == setting &&
                    settings[selectedApp][setting].options.map(
                      (option, index) => (
                        <button
                          key={index}
                          className={`${settings[selectedApp][setting].value == option.value && "border-x-green-500 bg-green-800 bg-opacity-20"} w-full my-4 rounded-xl border-x-2 flex justify-between p-5`}
                          onClick={() =>
                            sendSettingsUpdate(
                              selectedApp,
                              setting,
                              option.value
                            )
                          }
                        >
                          <p>{option.label}</p>
                          <p>{option.value}</p>
                        </button>
                      )
                    )}
                </div>
              </div>
            ))
          ) : selectedApp == "logs" && logs && logs.length > 0 ? (
            <div className="w-full">
              <div className="w-full flex justify-between mb-3">
                <button
                  className={`border-2 border-slate-500 rounded-xl p-5`}
                  onClick={clearLogs}
                >
                  <p>Clear Logs</p>
                </button>
                <button
                  className={`${logFilter == "log" ? "bg-slate-800 border-green-500" : "border-slate-500"} border-2 rounded-xl p-5`}
                  onClick={() => filterLogs("log")}
                >
                  <p>Logs</p>
                </button>
                <button
                  className={`${logFilter == "error" ? "bg-slate-800 border-green-500" : "border-slate-500"} border-2 rounded-xl p-5`}
                  onClick={() => filterLogs("error")}
                >
                  <p>Errors</p>
                </button>
                <button
                  className={`${logFilter == "message" ? "bg-slate-800 border-green-500" : "border-slate-500"} border-2 rounded-xl p-5`}
                  onClick={() => filterLogs("message")}
                >
                  <p>Messages</p>
                </button>
                <button
                  className={`${logFilter == "all" ? "bg-slate-800 border-green-500" : "border-slate-500"} border-2 rounded-xl p-5`}
                  onClick={() => filterLogs("all")}
                >
                  <p>All</p>
                </button>
              </div>
              {logs && logs.map((log, index) => (
                <div
                  key={index}
                  className={`${logFilter != "all" && log.type != logFilter && "hidden"} ${log.type == "error" && "bg-red-500"} ${log.type == "log" && "bg-slate-900"} ${log.type == "message" && "bg-slate-500"} w-full border-x-2 mb-1 rounded-2xl h-fit overflow-hidden hover:overflow-fit`}
                >
                  <p className="p-5">
                    {log.app}:{" " + log.payload}
                  </p>
                </div>
              ))}
            </div>
          ) : selectedApp == "dev" ? (
            <div className="w-full">
              <div className="w-full flex justify-between mb-3">
                <button
                  className={`border-2 border-slate-500 rounded-xl p-5`}
                  onClick={openDevView}
                >
                  <p>Dev Mode</p>
                </button>
              </div>
            </div>
          ) : (
            <Landing />
          )}
        </div>
      </div>
    );
}

export default Utility;