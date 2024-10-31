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

const Landing: React.FC = (): JSX.Element => {
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


  return (
    <div className="w-full flex flex-col justify-center h-full text-center items-center">
      <div className="flex relative items-center font-THEBOLDFONT">
        <div className="flex absolute inset-0 items-center blur-2xl">
          <IconLogoGear iconSize={140} /><div className="flex flex-col justify-start">
            <IconLogo width={255} height={119} className="-my-7" />
            <p className="w-fit text-xs font-geistMono">
              Client Version: {manifest.version}
            </p>
            <p className="w-fit text-xs font-geistMono">
              {manifest.ip}:{manifest.port} 
            </p>
            <p className="w-fit text-xs font-geistMono">
                Built By: {manifest.author}
              </p>
          </div>
        </div>
        <IconLogoGear iconSize={140} />
        <div className="flex flex-col justify-start">
          <IconLogo width={255} height={119} className="-my-7" />
          <p className="w-fit text-xs font-geistMono">
            Client Version: {manifest.version}
          </p>
          <p className="w-fit text-xs font-geistMono">
            {manifest.ip}:{manifest.port} 
          </p>
          <p className="w-fit text-xs font-geistMono">
              Built By: {manifest.author}
            </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
