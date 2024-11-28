
import { useMusicStore } from '@src/stores/musicStore'

export default function NowPlaying() {
  const song = useMusicStore((state) => state.song)
  
  if (!song) {
    return <div>No track playing</div>
  }

  return (
    <div style={{background: song?.color?.rgb }} className="w-screen h-full max-h-full flex-shrink bg-black flex-col flex items-center justify-center">
      <div className="grid grid-cols-6 w-5/6 h-2/3">
      <div className="w-full col-span-2 h-full">
        <div className="relative w-full pb-[100%]">
          <img 
            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg border shadow-lg" 
            src={song.thumbnail || ''} 
          />
        </div>
      </div>
        <div className="ml-10 col-span-3 flex justify-center flex-col">
          <h1>{song.album}</h1>
          <p className="text-4xl">{song.track_name}</p>
          <p>{song.artist}</p>
        </div>
      </div>
    </div>
  )
}
