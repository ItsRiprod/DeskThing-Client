import { useEffect } from 'react';
import { useTimeStore } from '@src/stores/timeStore';
import { useSettingsStore } from '@src/stores';

export const TimeUpdater = () => {
  const updateCurrentTime = useTimeStore((state) => state.updateCurrentTime);
  const is24Hour = useSettingsStore((state) => state.preferences.use24hour)

  useEffect(() => {
    const interval = setInterval(updateCurrentTime, 60000); // Update every minute
    return () => clearInterval(interval); // Cleanup on unmount
  }, [updateCurrentTime, is24Hour]);

  return null;
};