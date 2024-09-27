import { useEffect, useState } from "react";
import { Action, Button, EventFlavor } from "../types";
import { ControlStore, ManifestStore } from "../stores";
import ActionHelper from "./ActionHelper";
import { Icon, IconProps } from "../assets/Icons/Icons";
import { 
    IconArrowLeft, 
    IconArrowRight, 
    IconPlayPause, 
    IconPlay, 
    IconPref, 
    IconRewind, 
    IconShuffle, 
    IconSkip, 
    IconRepeat, 
    IconSwap,
    IconCarThing,
    IconRepeatActive,
    IconFullscreen,
    IconFullscreenReverse,
    IconVolDown,
    IconVolUp,
    IconArrowDown,
    IconArrowUp
} from '../assets/Icons';

// Map action IDs to icon components
const iconMap: { [key: string]: React.FC<IconProps> } = {
    'playPause': IconPlayPause,
    'play': IconPlay,
    'pref': IconPref,
    'rewind': IconRewind,
    'shuffle': IconShuffle,
    'skip': IconSkip,
    'repeat': IconRepeat,
    'repeatActive': IconRepeatActive,
    'swap': IconSwap,
    'volDown': IconVolDown,
    'volUp': IconVolUp,
    'fullscreen': IconFullscreen,
    'fullscreenReverse': IconFullscreenReverse,
    'hide': IconArrowUp,
    'show': IconArrowDown,
    'swipeL': IconArrowLeft,
    'swipeR': IconArrowRight,
    'default': IconCarThing,
};

interface IconHelperProps extends IconProps {
    Button: Button;
    flavor?: EventFlavor;
}

const ActionIcon: React.FC<IconHelperProps> = ({ Button, flavor = EventFlavor.Down, ...props }) => {
    const controlStore = ControlStore.getInstance();
    const manifestStore = ManifestStore.getInstance();
    const [action, setAction] = useState<Action | null>(null);
    const [ip, setIp] = useState<string>(manifestStore.getManifest().ip);
    const [port, setPort] = useState<number>(manifestStore.getManifest().port);
    const [svgContent, setSvgContent] = useState<string | null>(null);

    useEffect(() => {
        const updateHandler = () => {
            const newAction = controlStore.getButtonMapping(Button, flavor);
            setAction(newAction);
        };

        const manifestHandler = (Manifest: ServerManifest) => {
            setIp(Manifest.ip);
            setPort(Manifest.port);
        };

        updateHandler();

        const actionListener = controlStore.on(updateHandler);
        const settingListener = manifestStore.on(manifestHandler);

        return () => {
            actionListener();
            settingListener();
        };
    }, [Button, flavor, controlStore, manifestStore]);

    useEffect(() => {
        const loadIcon = async () => {
            if (!action) return;

            if (action.source === 'server') {
                setSvgContent(null); // Clear any existing SVG content
            } else {
                try {
                    const response = await fetch(`http://${ip}:${port}/${action.source}/icon/${action.id}${action.flair}.svg`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const svgData = await response.text();
                    setSvgContent(svgData);
                    console.log(svgData)
                } catch (error) {
                    console.error('Failed to fetch SVG content:', error);
                }
            }
        };

        loadIcon();
    }, [action, ip, port]);


    const handleClick = () => {
        console.log('Handling Click', Button, flavor, action)
        ActionHelper.executeAction(Button, flavor);
    };
    let show = true
    let className = "";
    let IconComponent: React.FC<IconProps> | null = null;

    if (action) {
        if (action.flair.includes("Disabled")) {
            className = "text-gray-500";
        }
        if (action.id.includes("hidden")) {
            className = "text-gray-500 hidden";
            show = false
        }

        // Exclude "Disabled" from the iconMap lookup
        const flairWithoutDisabled = action.flair.replace("Disabled", "").trim();
        IconComponent = iconMap[action.id + flairWithoutDisabled] || iconMap['default'];
    }

    return show && (

        
        <button onClick={handleClick} className={`${className}`}>
        {IconComponent && svgContent === null ? (
                <IconComponent {...props} />
            ) : (
                <Icon {...props}>
                    {svgContent ? (
                        <svg dangerouslySetInnerHTML={{ __html: svgContent }} />
                    ) : (
                        <text>loading...</text>
                    )}
                </Icon>
            )}
            </button>
        )
};

export default ActionIcon;