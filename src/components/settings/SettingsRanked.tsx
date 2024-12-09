import React from 'react';
import SettingComponent from './SettingComponent';
import { SettingsRanked } from '../../types/settings';

interface SettingsRankedProps {
  setting: SettingsRanked;
  handleSettingChange: (value: string[]) => void;
  className?: string;
}

export const SettingsRankedComponent: React.FC<SettingsRankedProps> = ({ className, setting, handleSettingChange }) => {
  const moveItem = (fromIndex: number, toIndex: number) => {
    const newValue = [...setting.value];
    const [removed] = newValue.splice(fromIndex, 1);
    newValue.splice(toIndex, 0, removed);
    handleSettingChange(newValue);
  };

  return (
    <SettingComponent setting={setting} className={className}>
                <div className="w-96 max-w-s">
                  {setting.value.length > 0 && setting.value.map((item, index) => (
                    <div key={item} className="flex items-center gap-2 mb-1">
                      <span>{item}</span>
                      <button 
                        disabled={index === 0 || setting.disabled} 
                        onClick={() => moveItem(index, index - 1)}
                        className="px-2 py-1 disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button 
                        disabled={index === setting.value.length - 1 || setting.disabled} 
                        onClick={() => moveItem(index, index + 1)}
                        className="px-2 py-1 disabled:opacity-50"
                      >
                        ↓
                      </button>
                    </div>
                  ))}
                </div>
            </SettingComponent>
  );
};