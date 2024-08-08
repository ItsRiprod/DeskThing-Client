import { IconCarThing } from '../../assets/Icons';
import React, { useState, useEffect } from 'react';
import socket from '../../helpers/WebSocketService';
import { SocketData } from '../../types/websocketTypes';
const Default: React.FC = (): JSX.Element => {
  const [time, setTime] = useState('00:00');
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
        setTime(msg.data as string);
      }
    };

    requestPreferences()

    const removeListener = socket.on('client', listener);

    return () => {
      removeListener();
    };
  }, []);

  return (
    <div className="view_default">
      <IconCarThing iconSize={445} text={time} fontSize={150}/>
    </div>
  );
};

export default Default;
