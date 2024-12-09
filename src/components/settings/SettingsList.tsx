import React, { useState } from 'react';
import SettingComponent from './SettingComponent';
import { SettingsList } from '../../types/settings';
import { IconArrowDown } from '@src/assets/Icons';

interface SettingsListProps {
  setting: SettingsList;
  handleSettingChange: (value: string[]) => void;
  className?: string
}

export const SettingsListComponent: React.FC<SettingsListProps> = ({ handleSettingChange, className, setting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(setting.value || []);

  const toggleItem = (item: string) => {
    const newItems = selectedItems.includes(item)
      ? selectedItems.filter(i => i !== item)
      : [...selectedItems, item];
    setSelectedItems(newItems);
    handleSettingChange(newItems);
  };

  return (
    <SettingComponent setting={setting} className={className}>
      <div className="w-96 max-w-s relative">
        <button
          disabled={setting.disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 w-full focus:outline-none flex justify-between items-center"
        >
          <span>{selectedItems.length ? selectedItems.join(', ') : 'Select items'}</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}><IconArrowDown /></span>
        </button>
        {isOpen && (
          <div className="absolute w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-10">
            {setting.options.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleItem(option.value)}
                className="w-full text-left text-white hover:bg-gray-600 px-2 py-1 flex items-center"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(option.value)}
                  onChange={() => {}}
                  className="mr-2"
                />
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </SettingComponent>
  );
};