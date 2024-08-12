/**
 * @file Dashboard.tsx
 * @description Dashboard component for the DeskThing-Client.
 * @author Riprod
 * @version 0.8.0
 */
import React, { useState, useEffect } from 'react';
import socket from '../../helpers/WebSocketService';
import { SocketData } from '../../types/websocketTypes';
const Default: React.FC = (): JSX.Element => {
  const [time, setTime] = useState<string>('00:00 AM');
  const [serverTime, setServerTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const formatTime = (date: Date): string => {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const requestPreferences = () => {
    if (socket.is_ready()) {
      const data = {
        app: 'server',
        type: 'get',
      };
      socket.post(data);
    }
  }
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (msg: SocketData) => {
      if (msg.type === 'time') {
        const [timeString, ampm] = (msg.data as string).split(' ');
        const [hours, minutes] = timeString.split(':').map(Number);
        const now = new Date();
        const serverDate = new Date(Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          hours % 12 + (ampm === 'PM' ? 12 : 0),
          minutes
        ));
        setCurrentTime(now)
        setServerTime(serverDate);
      }
    };

    requestPreferences();

    const removeListener = socket.on('client', listener);

    return () => {
      removeListener();
    };
  }, []);

  useEffect(() => {
    const updateClock = () => {
      if (serverTime) {
        const time = new Date()
        const elapsedMilliseconds = time.getTime() - currentTime.getTime();
        const updatedTime = new Date(serverTime.getTime() + elapsedMilliseconds);
        console.log(updatedTime.getTime())
        setTime(formatTime(updatedTime));
      }
    };

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, [serverTime]);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-9xl font-semibold font-geistMono">
      {time}
    </div>
  );
};

export default Default;
