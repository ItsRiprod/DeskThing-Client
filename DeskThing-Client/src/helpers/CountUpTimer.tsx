import React, { useEffect, useState, useRef } from 'react';
import { msToTime } from '../utils/TimeUtils';
import { SongData } from '../types';
import { MusicStore } from '../stores';
import ActionHelper from './ActionHelper';
import { ScrollingText } from './AutoSizingText';

interface CountUpTimerProps {
  expand: boolean
}

const CountUpTimer: React.FC<CountUpTimerProps> = ({
  expand = false
}) => {
  const musicStore = MusicStore.getInstance()
  const [songData, setSongData] = useState<SongData>(musicStore.getSongData());
  const [ms, setMs] = useState(0);
  const [msEnd, setMsEnd] = useState(6000);
  const [touching, setTouching] = useState(false);
  const [songId, setSongID] = useState<number>(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const touchBuffer = 10000
  useEffect(() => {
    const Interval = setInterval(() => {
      setMs((prevMs) => {
        if (songData && songData.is_playing && !touching) {
          if (prevMs < msEnd) {
            return prevMs + 1000;
          } else {
            console.log('Sending request because song is over');
            musicStore.requestMusicData();
            return 0;
          }
        }
        return prevMs;
      });
    }, 1000);
    
    return () => clearInterval(Interval);
  }, [songData, touching]);

  useEffect(() => {
    if (songData) {
      if (songData.timestamp == songId) return

      setMs(songData.track_progress);
      setMsEnd(songData.track_duration);
      setSongID(songData.timestamp)
    }
  }, [songData, songId]);

  useEffect(() => {
    const handleSongData = (songData: SongData) => {
      setSongData(songData);
    };

    const Listener = musicStore.subscribeToSongDataUpdate(handleSongData);

    return () => Listener();
  }, [musicStore, songId])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const progressBar = progressBarRef.current;
    if (progressBar) {

      const rect = progressBar.getBoundingClientRect();
      let newMs = 0;
      setTouching(true);
      const handleTouchMove = (e: TouchEvent) => {
        e.stopPropagation()
        const currentX = e.touches[0].clientX - rect.left;
        const curMs = Math.round((currentX / rect.width) * msEnd);
        setMs(curMs);
        newMs = curMs;
      };

      const handleTouchEnd = () => {
        if (Math.abs(newMs) < 400) {
          // Do Nothing
        } else if (newMs >= msEnd - touchBuffer ) {
          ActionHelper.Skip()
          setMs(0);
        } else if (newMs < touchBuffer ) {
          ActionHelper.Rewind()
        } else {
          ActionHelper.Seek(newMs)
        }
        setTouching(false);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }
  };

  const handleMouseStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const progressBar = progressBarRef.current;
    if (progressBar) {

      const rect = progressBar.getBoundingClientRect();
      let newMs = 0;
      setTouching(true);
      const handleTouchMove = (e: MouseEvent) => {
        e.stopPropagation()
        const currentX = e.clientX - rect.left;
        const curMs = Math.round((currentX / rect.width) * msEnd);
        setMs(curMs);
        newMs = curMs;
      };

      const handleTouchEnd = () => {
        if (Math.abs(newMs) < 400) {
          // Do Nothing
        } else if (newMs >= msEnd - touchBuffer ) {
          ActionHelper.Skip()
          setMs(0);
        } else if (newMs < touchBuffer ) {
          ActionHelper.Rewind()
        } else {
          ActionHelper.Seek(newMs)
        }
        setTouching(false);
        document.removeEventListener('mousemove', handleTouchMove);
        document.removeEventListener('mouseup', handleTouchEnd);
      };

      document.addEventListener('mousemove', handleTouchMove);
      document.addEventListener('mouseup', handleTouchEnd);
    }
  };

  return (
    <div className={`${!expand && 'pt-8'}`} onTouchStart={handleTouchStart} onMouseDown={handleMouseStart}>
      <div className={` rounded-sm m-auto transition-all overflow-hidden bg-zinc-800 ${expand || touching ? 'h-11' : 'h-2'}`} ref={progressBarRef}>
        <div className={`m-0 pointer-events-none fixed w-full h-11 items-center text-2xl pr-5 flex justify-between p-0 font-bold ${expand || touching ? 'block' : 'hidden'}`}>
          <div className="w-5/6 h-full">
            <ScrollingText className="content-center text-2xl" text={songData.track_name} fades={false} />
          </div>
          <p>{msToTime(ms)}/{msToTime(msEnd)}</p>
        </div>
        <div
          className={`bg-green-500 ${!touching && 'transition-all'} static rounded-r-lg h-full`}
          style={{
            width: `${(ms / msEnd) * 100 || 0}%`
          }}
          />
      </div>
    </div>
  );
};

export default CountUpTimer;
