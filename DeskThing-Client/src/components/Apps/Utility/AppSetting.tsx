  import React, { useEffect, useState, useCallback } from 'react';
  import appStore from '../../../stores/appStore';
  import { AppSettings, SettingsType, SocketData } from '../../../types';
  import Button from '../../Button';
  import { IconCheck, IconToggle, IconX } from '../../../assets/Icons';
import WebSocketService from '../../../helpers/WebSocketService';

  export interface AppSettingProps {
    appName: string
    onBack: () => void
  }

  const AppSetting: React.FC<AppSettingProps> = ({ appName, onBack }) => {
      const [appSettings, setAppSettings] = useState<AppSettings | null>(null)
      const socket = WebSocketService

      useEffect(() => {
            
            // Initial data
            const apps = appStore.getApps();
            const currentApp = apps.find(a => a.name === appName);
            const appSettings = appStore.getSettings()
            setAppSettings(appSettings[currentApp.name])

            console.log('appSettings', appSettings[currentApp.name])
            
      }, [appName]);

      const handleSettingChange = useCallback(
          (key: string, value: string | number | boolean | string[] | boolean[]) => {
              console.log('Setting changed:', key, value);
              setAppSettings((prev) =>
                  prev && prev[key]
                      ? {
                          ...prev,
                          [key]: { ...prev[key], value: value as any }
                          }
                      : prev
              );

              if (socket.is_ready()) {
                const data: SocketData = {
                    app: appName,
                    type: 'set',
                    request: 'settings',
                    payload: {
                        id: key,
                        value: value
                    }
                }
                socket.post(data)
              }
          },
          []
      );

      const renderSettingInput = useCallback(
          (setting: SettingsType, key: string) => {
              const commonClasses =
                  'mt-1 block px-3 py-2 bg-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

              switch (setting.type || '') {
                  case 'string':
                      return (
                          <SettingComponent key={key} setting={setting}>
                              <div className="flex items-center w-full">
                                  <input
                                      type="text"
                                      value={setting.value as string}
                                      onChange={(e) => handleSettingChange(key, e.target.value)}
                                      className={commonClasses + ' w-full'}
                                      disabled={true}
                                  />
                              </div>
                          </SettingComponent>
                      );
                  case 'number':
                      return (
                          <SettingComponent key={key} setting={setting}>
                              <div>
                                  {setting.type == 'number' && (
                                      <input
                                          type="number"
                                          value={setting.value as number}
                                          min={setting.min}
                                          max={setting.max}
                                          onChange={(e) => handleSettingChange(key, Number(e.target.value))}
                                          className={commonClasses}
                                          disabled={true}
                                      />
                                  )}
                              </div>
                          </SettingComponent>
                      );
                  case 'boolean':
                      return (
                          <SettingComponent key={key} setting={setting}>
                              <Button onClick={() => handleSettingChange(key, !setting.value)}>
                                  <IconToggle
                                      iconSize={48}
                                      checked={setting.value as boolean}
                                      className={`${setting.value ? 'text-green-500' : 'text-gray-500'} w-full h-full`}
                                  />
                              </Button>
                          </SettingComponent>
                      );
                  case 'select':
                      return (
                          <SettingComponent key={key} setting={setting}>
                              {setting.type == 'select' && (
                                  <select
                                      value={setting.value}
                                      onChange={(e) => handleSettingChange(key, e.target.value)}
                                      className={commonClasses}
                                  >
                                      {setting.options?.map((option, index) => (
                                          <option key={index} value={option.value}>
                                              {option.label}
                                          </option>
                                      ))}
                                  </select>
                              )}
                          </SettingComponent>
                      );
                  case 'multiselect':
                      return (
                          <SettingComponent key={key} setting={setting}>
                              {setting.type == 'multiselect' && (
                                  <div className="gap-2 flex max-w-1/2 flex-wrap p-2 bg-zinc-900 border border-gray-700 rounded-md">
                                      {setting.options?.map((option, index) => (
                                          <Button
                                              key={index}
                                              className={`flex items-center hover:bg-zinc-800 ${(setting.value as string[]).includes(option.value) ? 'text-green-500' : 'text-red-500'}`}
                                              onClick={(e) => {
                                                  e.preventDefault();
                                                  const currentValues = [...(setting.value as string[])];
                                                  if (currentValues.includes(option.value)) {
                                                      currentValues.splice(currentValues.indexOf(option.value), 1);
                                                  } else {
                                                      currentValues.push(option.value);
                                                  }
                                                  handleSettingChange(key, currentValues);
                                              }}
                                          >
                                              {(setting.value as string[]).includes(option.value) ? <IconCheck /> : <IconX />}
                                              <p className="text-lg">{option.label}</p>
                                          </Button>
                                      ))}
                                  </div>
                              )}
                          </SettingComponent>
                      );
                  default:
                      if (setting.type == 'number' || setting.type == 'string' || setting.type == 'boolean') return
                      return (
                          <SettingComponent key={key} setting={setting}>
                              <div className="flex flex-col space-y-2">
                                  {setting.options?.map((option, index) => (
                                      <div key={index} className="flex items-center">
                                          <span className="text-sm text-gray-600">{option.label}: </span>
                                          <span className="ml-2 text-sm font-medium">{option.value.toString()}</span>
                                      </div>
                                  ))}
                              </div>
                          </SettingComponent>
                      );
              }
          },
          [handleSettingChange]
      );

      return (
          <div className="w-full h-full p-6 flex flex-col">
            <Button className="my-2 bg-zinc-900 w-fit" onClick={onBack}>{'<-'} Go Back</Button>
            {appSettings && Object.entries(appSettings).map(([key, setting]) => renderSettingInput(setting, key))}
          </div>
      );
  };

  
  interface SettingComponentProps {
      setting: SettingsType;
      children?: React.ReactNode;
      className?: string;
    }
    
    const SettingComponent = ({ setting, children, className }: SettingComponentProps): JSX.Element => {
        return (
            <div
            className={`py-3 flex gap-3 items-center hover:bg-zinc-950 justify-between w-full border-t relative border-gray-900 ${className}`}
            >
              <div className="w-fit text-nowrap">
                  <p className="text-md text-gray-500 font-geistMono absolute -top-2 inset">
                      {setting.type?.toUpperCase() || 'Legacy Setting'}
                  </p>
                  <div className="group relative w-full">
                      <p className="py-3 text-3xl cursor-help">{setting.label}</p>
                      {setting.description && (
                          <div className="absolute left-0 -bottom-1 translate-y-full invisible group-hover:visible bg-zinc-800 text-sm text-gray-300 px-2 py-1 rounded-md whitespace-normal max-w-xs z-10">
                              {setting.description}
                          </div>
                      )}
                  </div>
              </div>
              {children}
          </div>
      );
    };

    export default AppSetting;