/**
 * @file Volume.tsx
 * @description This file contains the Volume component.
 * @author Riprod
 * @version 0.8.0
 */
import React, { useEffect, useState } from 'react';
import { SongData } from '../../types';
import musicStore from '../../stores/musicStore';

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

  return (
    <div className={visible ? 'volumeControl visible' : 'volumeControl'}>
      <div className="volumeLevel" style={{ height: `${volume}%` }}></div>
    </div>
  );
};

export default Volume;
