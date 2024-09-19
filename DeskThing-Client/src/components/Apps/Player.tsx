/**
 * @file Player.tsx
 * @description The fullscreen audio player
 * @author Riprod
 * @version 0.8.0
 */

import { useEffect, useRef, useState } from "react";
import { MusicStore, UIStore } from "../../stores";
import { SongData, ViewMode } from "../../types";
import ActionIcon from "../../helpers/ActionIcon";
import { IconAlbum } from "../../assets/Icons";

const Player: React.FC = () => {
    const uiStore = UIStore.getInstance()
    const musicStore = MusicStore.getInstance()
    const [miniplayerState, setMiniplayerState] = useState<ViewMode>(uiStore.getMiniplayerMode())
    const [songData, setSongData] = useState<SongData>(musicStore.getSongData())
    const [verticle, setIsVerticle] = useState<boolean>(false)
    const [padVisible, setPadVisible] = useState<boolean>(false)
    const buttonRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<number | undefined>(undefined);


    useEffect(() => {
        const setMiniplayerMode = (mode: ViewMode) => {
            setMiniplayerState(mode)
        }
        const handleSongDataUpdate = (data: SongData) => {
            setSongData(data)
        }

        const miniListener = uiStore.on('miniplayerMode', setMiniplayerMode)
        const songListener = musicStore.subscribeToSongDataUpdate(handleSongDataUpdate)
        musicStore.requestMusicData()

        return () => {
            miniListener()
            songListener()
        }
    }, [])

    const handleSongClick = () => {
        setPadVisible(true)
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(() => {
            setPadVisible(false);
        }, 5000)
    }

    useEffect(() => {
        const resizeButton = () => {
            const button = buttonRef.current;
            if (window.innerHeight - window.innerWidth * 1.25 > 0) {
                setIsVerticle(true)
            } else {
                setIsVerticle(false)
            }

            if (button) {
                const width = Math.min(button.offsetWidth, window.innerHeight * 0.7)
                button.style.height = `${width}px`;
                button.style.minHeight = `${width}px`;
                button.style.maxHeight = `${width}px`;
            }
        };

        resizeButton(); // Initial resize

        window.addEventListener('resize', resizeButton);

        return () => {
            window.removeEventListener('resize', resizeButton);
        };
    }, [miniplayerState, songData]);

    return (
        <div className={`w-full h-full flex-col bg-black`}
            style={{backgroundImage: "linear-gradient(to right, var(--album-color)75%, rgba(128, 128, 128, 0.5))"}}
        >
            <div className={`h-full max-w-screen flex ${verticle && 'flex-col items-center'} items-center justify-center`}>
                <div
                    ref={buttonRef}
                    onClick={handleSongClick}
                    className={`m-5 ${verticle && 'h-[100vw] w-full max-w-screen'} w-full h-full relative rounded-tl-[25%] rounded-br-[25%] rounded-xl ${!padVisible && 'overflow-hidden'} bg-black`}
                    style={{
                        backgroundImage: songData.thumbnail ? `url(${songData.thumbnail})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {padVisible ?
                        <div className="h-full w-full grid grid-cols-3 grid-rows-3 gap-1">
                            <ActionIcon Button={'Pad1'} iconSize={24} className={"w-full h-full p-3 bg-opacity-50 bg-black rounded-3xl border"} />
                            <ActionIcon Button={'Pad2'} iconSize={24} className={"w-full h-full p-3 bg-opacity-50 bg-black rounded-3xl border"} />
                            <ActionIcon Button={'Pad3'} iconSize={24} className={"w-full h-full p-3 bg-opacity-50 bg-black rounded-3xl border"} />
                            <ActionIcon Button={'Pad4'} iconSize={24} className={"w-full h-full p-3 bg-opacity-50 bg-black rounded-3xl border"} />
                            <ActionIcon Button={'Pad5'} iconSize={24} className={"w-full h-full p-3 bg-opacity-50 bg-black rounded-3xl border"} />
                            <ActionIcon Button={'Pad6'} iconSize={24} className={"w-full h-full p-3 bg-opacity-50 bg-black rounded-3xl border"} />
                            <ActionIcon Button={'Pad7'} iconSize={24} className={"w-full h-full p-3 bg-opacity-50 bg-black rounded-3xl border"} />
                            <ActionIcon Button={'Pad8'} iconSize={24} className={"w-full h-full p-3 bg-opacity-50 bg-black rounded-3xl border"} />
                            <ActionIcon Button={'Pad9'} iconSize={24} className={"w-full h-full p-3 bg-opacity-50 bg-black rounded-3xl border"} />
                        </div>
                        :
                        !songData.thumbnail && <IconAlbum className="absolute w-full h-full" />
                    }
                </div>
                <div className="my-5 max-w-[50%] justify-center flex flex-col w-full" style={{ color: 'var(--text-color)' }}>
                    <p>{songData.album}</p>
                    <div className="font-semibold text-nowrap">
                        <h1 className={`${songData?.track_name?.length > 15 ? 'text-xs text-wrap xs:text-lg sm:text-2xl md:text-3xl xl:text-5xl' : 'text-sm xs:text-xl sm:text-4xl md:text-5xl xl:text-8xl'}`}>
                        {songData.track_name}{verticle && 'Verticle' }
                        </h1>
                    </div>
                    <p>{songData.artist}</p>
                </div>
            </div>
        </div>
    )
}

export default Player;