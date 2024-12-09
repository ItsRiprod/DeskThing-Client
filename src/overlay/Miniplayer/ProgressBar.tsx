import { useMusicStore, useSettingsStore } from "@src/stores"
import { ViewMode } from "@src/types"
import { useEffect, useState, memo } from "react"

interface ProgressBarProps {
    className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = memo(() => {
    const miniplayerState = useSettingsStore((store) => store.preferences.miniplayer)
    const primary = useSettingsStore((store) => store.preferences.theme.primary)
    const setMiniplayerState = useSettingsStore((store) => store.updatePreferences)
    const songData = useMusicStore((store) => store.song)
    const seek = useMusicStore((store) => store.seek)
    const next = useMusicStore((store) => store.next)
    const previous = useMusicStore((store) => store.previous)
    const requestSongData = useMusicStore((store) => store.requestMusicData)
    const [totalLength, setTotalLength] = useState(0)
    const [progress, setCurrentProgress] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [prevId, setPrevId] = useState('')

    useEffect(() => {

        if (!songData) return
        
        setPrevId(songData.id)
        
        if (songData && !isDragging) {
            if (songData.id != prevId) {
                setTotalLength(songData.track_duration || 999)
                setCurrentProgress(songData.track_progress || 0)
            }

            if (songData.is_playing) {
                const timer = setInterval(() => {
                    setCurrentProgress(prev => {
                        if (songData.track_progress !== undefined) {
                            return Math.min(prev + 1000, totalLength)
                        }
                        return prev
                    })
                }, 1000)
                return () => clearInterval(timer)
            }


        }
    }, [songData, totalLength, isDragging])

    useEffect(() => {
        if (totalLength <= progress && !isDragging) {
            setTotalLength(9999)
            setCurrentProgress(0)
            setIsDragging(false)
            requestSongData()
            
            setTimeout(() => {
                requestSongData()
            }, 2000)
        }
    }, [progress, totalLength, isDragging])

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
        if (miniplayerState.state == 'hidden') return
        if (e.cancelable) {
            e.preventDefault()
        }
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleMouseUp = () => {
        if (miniplayerState.state == 'hidden') return
        console.log('mouse up', progress)
        if (totalLength <= progress) {
            next()
            setTotalLength(9999)
            setCurrentProgress(0)
            
            setTimeout(() => {
                requestSongData()
            }, 2000)
        } else if (progress <= 0) {
            previous()
            setCurrentProgress(0)
        } else if (isDragging) {
            console.log('seeking to ', progress)
            seek(Math.round(progress))
        }
        setIsDragging(false)
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (miniplayerState.state == 'hidden') return
        if (isDragging) {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const percentage = x / rect.width
            const newProgress = Math.max(0, Math.min(totalLength, percentage * totalLength))
            setCurrentProgress(newProgress)
            
        }
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (miniplayerState.state == 'hidden') return
        if (isDragging) {
            const rect = e.currentTarget.getBoundingClientRect()
            const touch = e.touches[0]
            const x = touch.clientX - rect.left
            const percentage = x / rect.width
            const newProgress = Math.max(0, Math.min(totalLength, percentage * totalLength))
            setCurrentProgress(newProgress)
        }
    }

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (miniplayerState.state == 'hidden') {
            setMiniplayerState({
                miniplayer: {
                    position: miniplayerState.position || 'bottom',
                    state: ViewMode.PEEK,
                    visible: miniplayerState.visible ?? true
                }
            })
        } else {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const percentage = x / rect.width
            const newProgress = Math.max(0, Math.min(totalLength, percentage * totalLength))
            setCurrentProgress(newProgress)
        }
    }

    return (
        <button 
            className={`w-screen ${isDragging ? 'h-6' : 'h-2'} transition-[height] bg-zinc-900`}
            onClick={onClick}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleTouchMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            <div 
                style={{width: `${progress/totalLength * 100}%`,backgroundColor: primary}} 
                className="h-full w-full bottom-0 bg-gray-200"
            >
            </div>
        </button>
    )
})

export default ProgressBar