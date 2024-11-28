import React from 'react';
import SettingComponent from './SettingComponent';
import { SettingsSelect } from '../../types/settings';

interface SettingsSelectProps {
  setting: SettingsSelect;
  handleSettingChange: (value: string) => void;
  className?: string
}

export const SettingsSelectComponent: React.FC<SettingsSelectProps> = ({ className, setting }) => {
  return (
    <SettingComponent setting={setting} className={className}>
              {setting.type == 'select' && (
                <div className="w-96 max-w-s">
                  <select className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {setting.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </SettingComponent>
  );
};
