/**
 * @file Overlay.tsx
 * @description This file contains the Overlay components.
 * @author Riprod
 * @version 0.8.0
 */

import {FC, ReactNode } from 'react';
import Miniplayer from './Miniplayer'
import Volume from './Volume'
import AppsList from './AppsList'
import Notification from './Notification';

interface OverlayProps {
  children: ReactNode;
}

const Overlay: FC<OverlayProps> = ({ children }) => {
  return <div className="select-none flex-col flex overflow-hidden font-geist bg-slate-900 text-white">
      <AppsList />
      <Volume />
          {children}
      <Miniplayer />
      <Notification />
    </div>;
};

export default Overlay;
