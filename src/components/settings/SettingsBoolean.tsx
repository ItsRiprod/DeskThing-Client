import React from 'react';
import SettingComponent from './SettingComponent';
import { SettingsBoolean } from '@src/types';
import Button from '../ui/Button';
import { IconToggle } from '@src/assets/Icons';

interface SettingsBooleanProps {
  setting: SettingsBoolean;
  handleSettingChange: (value: boolean) => void;
  className?: string
}

export const SettingsBooleanComponent: React.FC<SettingsBooleanProps> = ({ className, setting, handleSettingChange }) => {

  return (
    <SettingComponent setting={setting} className={className}>
              <Button disabled={setting.disabled} onClick={() => handleSettingChange(!setting.value as boolean)}>
                <IconToggle
                  iconSize={64}
                  checked={setting.value as boolean}
                  className={`${setting.value ? 'text-green-500' : 'text-gray-500'} w-full h-full`}
                />
              </Button>
            </SettingComponent>
  );
};
