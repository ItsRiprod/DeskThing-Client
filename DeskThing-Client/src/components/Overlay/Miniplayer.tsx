import { useEffect, useRef, useState } from "react";
import { MusicStore, UIStore } from "../../stores";
import { SongData, ViewMode } from "../../types";
import ActionIcon from "../../helpers/ActionIcon";
import AutoSizingText from "../../helpers/AutoSizingText";
import CountUpTimer from "../../helpers/CountUpTimer";
import { IconAlbum, IconArrowDown } from "../../assets/Icons";

const Miniplayer: React.FC = () => {
    const uiStore = UIStore.getInstance();
    const musicStore = MusicStore.getInstance();
    const [state, setState] = useState<ViewMode>(uiStore.getMiniplayerMode());
    const [musicData, setMusicData] = useState<SongData>(musicStore.getSongData());
    const [showActions, setShowActions] = useState<boolean>(false);
    const [iconSize, setIconSize] = useState<number>(64);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);


    const updateIconSize = () => {
        const height = window.innerHeight;
        const width = window.innerWidth;
        if (height < 300 || width < 500) {
            setIconSize(50); // Small size
        } else if (height < 500 || width < 700) {
            setIconSize(75); // Medium size
        } else {
            setIconSize(100); // Large size
        }
    };

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setShowActions(false);
        }, 7000);
    };

    useEffect(() => {
        const handleStateUpdate = (state: ViewMode) => setState(state);
        const handleSongData = (data: SongData) => {
            setMusicData(data);
        };

        updateIconSize();
        window.addEventListener('resize', updateIconSize);

        const musicListener = musicStore.subscribeToSongDataUpdate(handleSongData);
        const stateListener = uiStore.on('miniplayerMode', handleStateUpdate);

        return () => {
            musicListener();
            stateListener();
            window.removeEventListener('resize', updateIconSize);
        };
    }, [musicStore, uiStore]);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (showActions) {
            timeoutRef.current = setTimeout(() => {
                setShowActions(false);
            }, 7000);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [showActions]);

    const handleExpand = () => {
        uiStore.setCurrentView('player')
        uiStore.setMiniplayerMode('full')
    }
    const handleShrink = () => {
        if (uiStore.getMiniplayerMode() == 'full') {
            uiStore.setMiniplayerMode('peek')
        } else {
            uiStore.setMiniplayerMode('hidden')
        }
    }
    const handleTrackbarClick = () => {
        if (state == 'hidden') {
            uiStore.setMiniplayerMode('peek')
        }
    }


    return (
        <div className="max-w-full absolute left-0 bottom-0 bg-gray-500">
            <div className="fixed w-full bottom-0">
                <div
                    onClick={handleTrackbarClick}
                    className="w-full h-fit">
                    <CountUpTimer expand={showActions} />
                </div>
                <div className={`flex xs:flex-nowrap ${showActions && 'flex-wrap'} transition-all justify-between bg-black ${state == 'hidden' ? 'h-0' : 'h-fit'}`}>
                    {state != 'hidden' &&
                        <>
                            {state == 'peek' &&
                                (musicData.thumbnail != null 
                                    ? 
                                    <button
                                        onClick={handleExpand}
                                        className="w-20 h-20 xs:w-28 xs:h-28 block shrink-0 bg-red-50"
                                        style={{
                                            backgroundImage: `url(${musicData.thumbnail})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                    : 
                                    <button
                                        onClick={handleExpand}
                                        className="xs:w-28 xs:h-28 w-20 h-10 p-1 block shrink-0"
                                    >
                                        <IconAlbum className="w-full h-full" />
                                    </button>
                                )
                                }
                            {state == 'peek' && <div onClick={() => setShowActions(true)} className={`overflow-hidden max-w-full font-geist grow pl-5 pt-5 ${showActions && 'hidden'}`} ref={textContainerRef}>
                                <div className={`font-semibold text-wrap text-sm overflow-x-hidden`}>
                                    <AutoSizingText textContent={musicData.track_name} textSizesDescending={['text-4xl', 'text-2xl', 'text-xl', 'text-sm']} />
                                </div>
                                <p className={'text-sm'}>
                                    {musicData.artist}
                                </p>
                            </div>
                            }
                            <div onClick={resetTimeout} className={`flex xs:flex-nowrap flex-wrap justify-around items-center w-fit justify-self-end ${showActions || state == 'full' ? 'w-full' : 'w-fit'}`}>
                                <div className={`${showActions || state == 'full' ? '' : 'hidden px-2'} `}>
                                    <button
                                        onClick={handleShrink}>
                                        <IconArrowDown iconSize={iconSize} />
                                    </button>
                                </div>
                                <ActionIcon Button={'DynamicAction1'} iconSize={iconSize} className={`${showActions || state == 'full' ? '' : 'hidden px-2'} `} />
                                <ActionIcon Button={'DynamicAction2'} iconSize={iconSize} className={`${showActions || state == 'full' ? '' : 'hidden px-2'} `} />
                                <ActionIcon Button={'DynamicAction3'} iconSize={iconSize} className={`${showActions || state == 'full' ? '' : 'hidden px-2'} `} />
                                <ActionIcon Button={'DynamicAction4'} iconSize={iconSize} className={`${showActions || state == 'full' ? '' : 'hidden px-2'} `} />
                                <ActionIcon Button={'Action5'} iconSize={iconSize} className={`${showActions || state == 'full' ? '' : 'hidden'} lg:block `} />
                                <ActionIcon Button={'Action6'} iconSize={iconSize} className={`${showActions || state == 'full' ? '' : 'hidden'} sm:block `} />
                                <ActionIcon Button={'Action7'} iconSize={iconSize} />
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default Miniplayer;
