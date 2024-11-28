import React from 'react';
import SettingComponent from './SettingComponent';
import { SettingsList } from '../../types/settings';

interface SettingsListProps {
  setting: SettingsList;
  handleSettingChange: (value: string) => void;
  className?: string
}


export const SettingsListComponent: React.FC<SettingsListProps> = ({className, setting }) => {
  return (
    <SettingComponent setting={setting} className={className}>
      <div className="flex items-center w-full">
        <div>
          {setting.value.join(', ')}
        </div>
      </div>
    </SettingComponent>
  );
};
