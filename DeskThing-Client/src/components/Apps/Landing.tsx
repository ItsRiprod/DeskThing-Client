/**
 * @file Landing.tsx
 * @description Landing component for the DeskThing-Client.
 * @author Riprod
 * @version 0.8.0
 */
import { IconLogo, IconLogoGear } from '../../assets/Icons';
import React, { useState, useEffect } from 'react';
import socket from '../../helpers/WebSocketService';
import { ManifestStore, ServerManifest } from '../../stores';
import WebSocketService from '../../helpers/WebSocketService';
import { LogStore } from '../../stores';

const Landing: React.FC = (): JSX.Element => {
  const logStore = LogStore.getInstance()
    const manifestStore = ManifestStore.getInstance();
  const [manifest, setManifest] = useState<ServerManifest>(manifestStore.getManifest())
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
    const listener = (manifest: ServerManifest) => {
      setManifest(manifest)
    };

    requestPreferences()

    const removeListener = manifestStore.on(listener);

    return () => {
      removeListener();
    };
  }, []);

  const reconnectServer = () => {
    if (manifest.ip) {
      logStore.sendMessage('LNDG', 'Reconnecting to server...')
      WebSocketService.reconnect(manifest.ip)
    } else {
      logStore.sendError('LNDG', 'Error! No IP found')
    }
  }

  return (
    <div className="w-full flex flex-col justify-center h-full text-center items-center">
      <div className="flex items-center font-THEBOLDFONT">
        <IconLogoGear iconSize={124} /><IconLogo width={250} height={119}/>
      </div>
      {manifest && (
          <div>
            <p>
              Client Version: {manifest.version}
            </p>
            <p>
              {manifest.name}: {manifest.description}
            </p>
            <p>
              Built By: {manifest.author}
            </p>
            <p>
              IP: {manifest.ip}
            </p>
            <p>
              PORT: {manifest.port}
            </p>
            <div>
              <button
                onClick={requestPreferences}
                className="p-3 border border-blue-500 rounded-2xl hover:bg-blue-400">
                  Ping
              </button>
              <button
                onClick={reconnectServer}
                className="p-3 border border-blue-500 rounded-2xl hover:bg-blue-400">
                  Reconnect
              </button>

            </div>
          </div>
        )
      }

    </div>
  );
};

export default Landing;
