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
import { IconRefresh } from '../../assets/Icons';
import musicStore from '../../stores/musicStore';
import Notification from './Notification';
import messageStore from '../../stores/messageStore';

interface OverlayProps {
  children: ReactNode;
}

const Overlay: FC<OverlayProps> = ({ children }) => {
  return <div className="select-none flex-col flex overflow-hidden font-geist bg-slate-900 text-white">
      <AppsList />
      <Volume />
          {children}
      <Miniplayer />
      <button className="fixed left-0 top-0" onClick={() => {musicStore.requestMusicData(); messageStore.sendMessage('RQ: Getting Data')}}>
        <IconRefresh strokeWidth={3} fill={'none'} iconSize={64} />
      </button>
      <Notification />
    </div>;
};

export default Overlay;
