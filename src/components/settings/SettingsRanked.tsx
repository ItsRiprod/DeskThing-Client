import React from 'react';
import SettingComponent from './SettingComponent';
import { SettingsRanked } from '../../types/settings';

interface SettingsRankedProps {
  setting: SettingsRanked;
  handleSettingChange: (value: string) => void;
  className?: string;
}

export const SettingsRankedComponent: React.FC<SettingsRankedProps> = ({ className, setting }) => {
  return (
    <SettingComponent setting={setting} className={className}>
                <div className="w-96 max-w-s">
                  {setting.value.join(', ')}
                  {setting.label}
                </div>
            </SettingComponent>
  );
};
