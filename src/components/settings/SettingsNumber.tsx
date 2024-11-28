import React from 'react';
import SettingComponent from './SettingComponent';
import { SettingsNumber } from '../../types/settings';

interface SettingsNumberProps {
  setting: SettingsNumber;
  handleSettingChange: (value: number) => void;
  className?: string;
}

const commonClasses = 'px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';

export const SettingsNumberComponent: React.FC<SettingsNumberProps> = ({ className, setting, handleSettingChange }) => {

  const clampValue = (value: number, min?: number, max?: number): number => {
    if (min !== undefined && value < min) return min
    if (max !== undefined && value > max) return max
    return value
  }

  return (
    <SettingComponent setting={setting} className={className}>
              <div>
                {setting.type == 'number' && (
                  <input
                    type="number"
                    value={setting.value as number}
                    min={setting.min}
                    max={setting.max}
                    onChange={(e) => {
                      let inputValue = Number(e.target.value)
                      inputValue = clampValue(inputValue, setting.min, setting.max)
                      handleSettingChange(inputValue)
                    }}
                    className={commonClasses}
                  />
                )}
              </div>
            </SettingComponent>
  );
};
