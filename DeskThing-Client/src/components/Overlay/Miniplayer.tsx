import { useEffect, useState } from "react";
import { MusicStore, UIStore } from "../../stores";
import { EventFlavor, SongData, ViewMode } from "../../types";
import ActionIcon from "../ActionIcon";
import { IconPlayPause } from "../../assets/Icons";

const Miniplayer: React.FC = () => {
    const uiStore = UIStore.getInstance();
    const musicStore = MusicStore.getInstance();
    const [state, setState] = useState<ViewMode>(uiStore.getMiniplayerMode());
    const [musicData, setMusicData] = useState<SongData>(musicStore.getSongData());
    const [svgContent, setSvgContent] = useState<string>("");

    useEffect(() => {
        const handleStateUpdate = (state: ViewMode) => setState(state);
        const handleSongData = (data: SongData) => {
            setMusicData(data)
        };

        const musicListener = musicStore.subscribeToSongDataUpdate(handleSongData);
        const stateListener = uiStore.on('miniplayerMode', handleStateUpdate);

        return () => {
            musicListener();
            stateListener();
        };
    }, [musicStore, uiStore]);

    return (
        <div className="w-screen absolute left-0 bottom-0 bg-gray-500">
            <div className="h-[95vh]">
                <div className="bottom-0 bg-black">
                    <div className="w-screen h-3 bg-green-200" />
                    <div className="w-5 h-5 bg-red-50" style={{
                        backgroundImage: `url(${musicData.thumbnail})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}></div>
                    <ActionIcon Button={'Action1'} iconSize={64} />
                    <ActionIcon Button={'Action2'} iconSize={64} />
                    <ActionIcon Button={'Action3'} iconSize={64} />
                    <ActionIcon Button={'Action4'} iconSize={64} />
                    <ActionIcon Button={'Action5'} iconSize={64} />
                </div>
            </div>
        </div>
    );
};

export default Miniplayer;
