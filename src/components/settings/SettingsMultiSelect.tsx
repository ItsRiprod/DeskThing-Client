import React from 'react';
import SettingComponent from './SettingComponent';
import { SettingsMultiSelect } from '../../types/settings';

interface SettingsMultiSelectProps {
  setting: SettingsMultiSelect;
  handleSettingChange: (value: string) => void;
  className?: string
}

export const SettingsMultiSelectComponent: React.FC<SettingsMultiSelectProps> = ({ className, setting }) => {
  return (
    <SettingComponent setting={setting} className={className}>
              {setting.type == 'multiselect' && (
                <div className="w-96 max-w-s">
                  {setting.value.join(' ,')}
                  {setting.label}
                </div>
              )}
            </SettingComponent>
  );
};
