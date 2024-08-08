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

interface OverlayProps {
  children: ReactNode;
}

const Overlay: FC<OverlayProps> = ({ children }) => {
  return <div className="flex-col flex overflow-hidden">
      <AppsList />
      <Volume />
          {children}
      <Miniplayer />
    </div>;
};

export default Overlay;
