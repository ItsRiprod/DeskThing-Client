import React, { useEffect, useState, useRef } from 'react';
import { msToTime } from '../utils/TimeUtils';
import { SongData } from '../types';
import { MusicStore } from '../stores';
import ActionHelper from './ActionHelper';

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
  const [songId, setSongID] = useState<string>('');
  const progressBarRef = useRef<HTMLDivElement>(null);
  const touchBuffer = 10000
  useEffect(() => {
    const myInterval = setInterval(() => {
      if (songData && songData.is_playing && !touching) {
        if (ms < msEnd) {
          setMs((prev) => prev + 1000);
        } else {
          console.log('Sending request because song is over')
            musicStore.requestMusicData()
            setMs(0);
        }
      }
    }, 1000);
    return () => clearInterval(myInterval);
  }, [songData, touching, ms, songId]);

  useEffect(() => {
    if (songData) {
      if (songData.id == songId) return
      setMs(songData.track_progress);
      setMsEnd(songData.track_duration);
      setSongID(songData.id)
    }
  }, [songData]);

  useEffect(() => {
    const handleSongData = (songData: SongData) => {
      setSongData(songData);
      setSongID('')
    };

    const Listener = musicStore.subscribeToSongDataUpdate(handleSongData);

    return () => Listener();
  }, [musicStore])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const progressBar = progressBarRef.current;
    if (progressBar) {

      const rect = progressBar.getBoundingClientRect();
      let newMs = 0;
      setTouching(true);
      const handleTouchMove = (e: TouchEvent) => {
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
    <div className="pt-11" onTouchStart={handleTouchStart} onMouseDown={handleMouseStart}>
      <div className={` rounded-sm m-auto transition-all overflow-hidden bg-zinc-800 ${expand || touching ? 'h-11' : 'h-2'}`} ref={progressBarRef}>
        <div className={`m-0 pointer-events-none fixed w-full h-11 items-center text-2xl px-5 flex justify-between p-0 font-bold ${expand || touching ? 'block' : 'hidden'}`}>
          <p>{songData.track_name}</p>
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
