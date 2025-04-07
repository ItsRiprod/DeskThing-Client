import { IconAlbum, IconLogoGearLoading } from '@src/assets/Icons'
import { useSettingsStore } from '@src/stores'
import { useMusicStore } from '@src/stores/musicStore'

import { useState, useRef } from 'react'

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
  const [customSize, setCustomSize] = useState({ width: 300, height: 300 })
  const mouseDownTime = useRef(0)
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })

  const refreshSong = async () => {
    setIsRefreshing(true)
    await refresh(true)
    setTimeout(() => setIsRefreshing(false), Math.random() * 1000 + 1000)
  }

  const handleStart = (clientX: number, clientY: number) => {
    mouseDownTime.current = Date.now()
    isDragging.current = false
    startPos.current = { x: clientX, y: clientY }
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (Date.now() - mouseDownTime.current > 200) {
      isDragging.current = true
      const deltaX = clientX - startPos.current.x
      const deltaY = clientY - startPos.current.y
      setCustomSize((prev) => ({
        width: prev.width + deltaX,
        height: prev.height + deltaY
      }))
      startPos.current = { x: clientX, y: clientY }
    }
  }

  const handleEnd = () => {
    if (!isDragging.current && Date.now() - mouseDownTime.current < 1000) {
      refreshSong()
    }
    isDragging.current = false
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleStart(e.clientX, e.clientY)
    
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      handleMove(e.clientX, e.clientY)
    }

    const handleMouseUp = () => {
      handleEnd()
      window.removeEventListener('mousemove', handleMouseMove, { capture: true })
      window.removeEventListener('mouseup', handleMouseUp, { capture: true })
    }
    window.addEventListener('mousemove', handleMouseMove, { capture: true, passive: false })
    window.addEventListener('mouseup', handleMouseUp, { capture: true, passive: false })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }

    const handleTouchEnd = () => {
      handleEnd()
      window.removeEventListener('touchmove', handleTouchMove, { capture: true })
      window.removeEventListener('touchend', handleTouchEnd, { capture: true })
    }
    window.addEventListener('touchmove', handleTouchMove, { capture: true, passive: false })
    window.addEventListener('touchend', handleTouchEnd, { capture: true, passive: false })
  }

  return (
    <div
      style={{ background: song?.color?.rgb }}
      className="w-screen h-full max-h-full flex-shrink bg-black flex-col flex items-center justify-center"
    >
        <div className="w-full col-span-2 h-full flex items-center justify-center">
          <div
            className="relative flex-shrink-0"
            style={{
              width: `${customSize.width}px`,
              height: `${customSize.height}px`
            }}
          >
            <button
              disabled={isRefreshing}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className={`relative h-full flex-shrink-0 w-full cursor-grab active:cursor-grabbing `}
            >
              {isRefreshing ? (
                <IconLogoGearLoading className="select-none absolute animate-fade top-0 left-0 w-full h-full object-cover rounded-lg border shadow-lg" />
              ) : (
                <>
                  <IconAlbum
                    className="select-none w-full h-full absolute animate-fade top-0 left-0 object-cover rounded-lg border shadow-lg"
                    style={{ pointerEvents: 'none' }}
                  />
                  <img
                    className="select-none absolute w-full h-full animate-fade top-0 left-0 object-cover rounded-lg border shadow-lg"
                    src={song?.thumbnail || ''}
                    alt=""
                    style={{
                      display: song?.thumbnail ? 'block' : 'none',
                      pointerEvents: 'none',
                      userSelect: 'none'
                    }}
                    draggable="false"
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