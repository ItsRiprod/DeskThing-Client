  import { create } from 'zustand'
import { useSettingsStore } from './settingsStore';

  interface TimeStore {
    currentTimeFormatted: string;
    utcTime: number; // Server's UTC time in ms
    timezoneOffset: number; // Server's timezone offset in minutes
    serverTimeOffset: number; // Offset between server time and client time in ms
    syncTime: (utcTime: number, timezoneOffset: number) => void; // Sync with server time
    updateCurrentTime: () => void; // Update formatted current time
  }

  export const useTimeStore = create<TimeStore>((set, get) => ({
    currentTimeFormatted: '',
    utcTime: 0,
    timezoneOffset: 0,
    serverTimeOffset: 0,
  
    // Sync time with server
    syncTime: (utcTime, timezoneOffset) => {
      const clientTime = Date.now(); // Client's current time in ms
      const serverTimeOffset = utcTime - clientTime; // Calculate server offset
  
      set({
        utcTime,
        timezoneOffset,
        serverTimeOffset,
      });
  
      // Update the formatted current time immediately
      get().updateCurrentTime();
    },
  
    // Update formatted current time based on server's offset
    updateCurrentTime: () => {
      const { serverTimeOffset, timezoneOffset } = get();
      const currentTime = new Date(Date.now() + serverTimeOffset); // Adjust for server offset
      const is24Hour = useSettingsStore.getState().preferences.use24hour
      // Convert to server timezone
      const adjustedTime = new Date(currentTime.getTime() + timezoneOffset * 60 * 1000);
      
      // Format the time
      const formattedTime = adjustedTime.toLocaleString('en-US', {
        timeZone: 'UTC', // Adjust this if you want to specify the server timezone
        hour12: !is24Hour,
        hour: 'numeric',
        minute: '2-digit',
      });

      console.log('Time is: ', formattedTime)
  
      set({ currentTimeFormatted: formattedTime });
    },
  }))
 