import { IconAlbum, IconLogoGearLoading } from '@src/assets/Icons'
import { useSettingsStore } from '@src/stores'
import { useMusicStore } from '@src/stores/musicStore'
import { useState } from 'react'

/**
 * The `NowPlaying` component displays the currently playing song, including the album cover, song title, artist, and album name. It also provides a button to refresh the currently playing song.
 *
 * The component uses the `useMusicStore` and `useSettingsStore` hooks to access the current song data and theme preferences, respectively. It also uses the `useState` hook to manage the state of the refresh button.
 *
 * When the refresh button is clicked, the `refreshSong` function is called, which updates the currently playing song by calling the `requestMusicData` function from the `useMusicStore` hook. The `isRefreshing` state is used to display a loading indicator while the song is being refreshed.
 *
 * The component renders the album cover, song title, artist, and album name, with the colors and styles adjusted based on the current song's color and the user's theme preferences.
 */
export default function NowPlaying() {
  const song = useMusicStore((state) => state.song)
  const refresh = useMusicStore((state) => state.requestMusicData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const textLight = useSettingsStore((state) => state.preferences.theme.textLight)
  const textDark = useSettingsStore((state) => state.preferences.theme.textDark)

  const refreshSong = async () => {
    setIsRefreshing(true)
    await refresh()
    setTimeout(() => setIsRefreshing(false), Math.random() * 1000 + 1000)
  }

  return (
    <div
      style={{ background: song?.color?.rgb }}
      className="w-screen h-full max-h-full flex-shrink bg-black flex-col flex items-center justify-center"
    >
      <div className="grid grid-cols-6 w-5/6 h-full">
        <div className="w-full col-span-2 h-full flex items-center justify-center">
          <button
            disabled={isRefreshing}
            onClick={refreshSong}
            className="relative w-full pb-[100%]"
          >
            {isRefreshing ? (
              <IconLogoGearLoading className="absolute animate-fade top-0 left-0 w-full h-full object-cover rounded-lg border shadow-lg" />
            ) : (
              <>
                <IconAlbum className="absolute animate-fade top-0 left-0 w-full h-full object-cover rounded-lg border shadow-lg" />
                <img
                  className="absolute animate-fade top-0 left-0 w-full h-full object-cover rounded-lg border shadow-lg"
                  src={song?.thumbnail || ''}
                  alt=""
                  style={{ display: song?.thumbnail ? 'block' : 'none' }}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </>
            )}
          </button>
        </div>
        <div
          style={{ color: song?.color?.isLight ? textDark : textLight }}
          className={`ml-10 col-span-4 flex justify-center flex-col`}
        >
          <h1 className={`md:text-2xl lg:text-4xl`}>{song?.album || ''}</h1>
          <p className={`text-xl sm:text-3xl md:text-6xl xl:text-9xl line-clamp-3 overflow-hidden`}>
            {song?.track_name || 'Waiting For Track...'}
          </p>
          <p className={`md:text-2xl lg:text-4xl`}>{song?.artist || ''}</p>
        </div>
      </div>
    </div>
  )
}
