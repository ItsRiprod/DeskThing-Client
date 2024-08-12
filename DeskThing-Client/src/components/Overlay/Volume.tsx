/**
 * @file Volume.tsx
 * @description This file contains the Volume component.
 * @author Riprod
 * @version 0.8.0
 */
import React, { useEffect, useState } from 'react';
import { SongData } from '../../types';
import musicStore from '../../stores/musicStore';
import ActionHelper from '../../helpers/ActionHelper';
import { IconVolDown, IconVolUp } from '../../assets/Icons';

const Volume: React.FC = () => {
  const [volume, setVolume] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleDeviceData = (data: SongData) => {
    setVolume(data.volume);
  };

  useEffect(() => {
    const removeFn = musicStore.subscribeToSongDataUpdate(handleDeviceData);

    return () => {
        removeFn()
    };
  }, []);

  useEffect(() => {
    setVisible(true);

    // Set visible to false after 2 seconds
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 1500);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, [volume]);

  const volUp = () => {
    ActionHelper.VolUp()
  }
  const volDown = () => {
    ActionHelper.VolDown()
  }

  return (
    <div className={`fixed transition-all z-20 h-full items-center flex w-8 ${visible ? 'translate-x-3' : '-translate-x-8'}`}>
      <div className="bg-gray-500 bg-opacity-40 rounded-full overflow-hidden flex flex-col justify-end items-center w-full h-3/5">
          <div className="absolute h-3/5 flex flex-col justify-between items-center py-2 w-8">
            <button className="" onClick={volUp}>
              <IconVolUp />
            </button>
            <button className="" onClick={volDown}>
              <IconVolDown className="w-full" />
            </button>
          </div>
          <div className="w-full bg-green-500" style={{ height: `${volume}%` }}></div>
        </div>
    </div>
  );
};

export default Volume;
