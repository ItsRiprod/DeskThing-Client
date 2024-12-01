import {
  useMusicStore,
  useSettingsStore,
  useAppStore,
  useMappingStore,
  useWebSocketStore,
} from "../stores";
import {
  Action,
  ActionReference,
  AUDIO_REQUESTS,
  EventMode,
  OutgoingSocketAction,
  OutgoingSocketData,
  OutgoingSocketMusic,
  OutgoingSocketServer,
  ViewMode,
} from "@src/types";
import { useActionStore } from "@src/stores/actionStore";

export class ActionHandler {
  private static instance: ActionHandler;

  private constructor() {
  }

  static getInstance(): ActionHandler {
    if (!ActionHandler.instance) {
      ActionHandler.instance = new ActionHandler();
    }
    return ActionHandler.instance;
  }

  private sendMessage = async (data: OutgoingSocketData) => {
    const send = useWebSocketStore.getState().send;
    await send(data);
  }

  executeAction = async (button: string, mode: EventMode): Promise<void> => {
    const action = useMappingStore.getState().getButtonAction?.(button, mode);
    if (!action) {
      return;
    }

    this.runAction(action);
  };

  public runAction = async (action: Action | ActionReference): Promise<void> => {
    const { source } = action;
    console.log("Running action:", action.id);

    if (source === "server") {
      this.handleServerAction(action);
    } else {
      await this.handleAppAction(action);
    }
  };

  private async handleServerAction(action: Action | ActionReference): Promise<void> {
    const handler = this.actionMap[action.id];
    if (handler) {
      handler(action);
    } else {
      console.warn(`No handler found for action: ${action.id}`);
    }
  }

  private async handleAppAction(action: Action | ActionReference): Promise<void> {
    try {
      const socketData: OutgoingSocketAction = {
        type: "action",
        app: 'server',
        payload: action,
      };
      await this.sendMessage(socketData);
    } catch (error) {
      console.error(`Failed to forward action to server: ${error}`);
    }
  }

  private handleHideAction(action: Action): void {
    const currentState = useSettingsStore.getState().preferences.appTrayState;
    const stateTransitions = {
      hide: {
        full: ViewMode.PEEK,
        peek: ViewMode.HIDDEN,
        hidden: ViewMode.HIDDEN
      },
      show: {
        hidden: ViewMode.PEEK,
        peek: ViewMode.FULL,
        full: ViewMode.FULL
      }
    };

    console.log(action.value, currentState)

    const newState = stateTransitions[action.value][currentState];
    useSettingsStore.getState().updatePreferences({ appTrayState: newState });
  }
  PlayPause = () => {
    const songData = useMusicStore.getState().song;
    if (songData?.is_playing || false) {
      this.handleSendCommand(AUDIO_REQUESTS.PAUSE);
      useMappingStore.getState().updateIcon("play", "");
    } else {
      this.handleSendCommand(AUDIO_REQUESTS.PLAY, songData?.id || '');
      useMappingStore.getState().updateIcon("play", "pause");
    }
    useMusicStore
      .getState()
      .setSong({ ...songData, is_playing: !songData?.is_playing || false });
  };

  Skip = () => {
    const songData = useMusicStore.getState().song;
    this.handleSendCommand(AUDIO_REQUESTS.NEXT, songData.id);
  };

  Seek = (ms: number) => {
    this.handleSendCommand(AUDIO_REQUESTS.SEEK, ms);
  };

  Rewind = () => {
    const songData = useMusicStore.getState().song;
    this.handleSendCommand(AUDIO_REQUESTS.PREVIOUS, songData.id);
    setTimeout(() => {
      useMusicStore.getState().requestMusicData();
    }, 1000);
  };

  Shuffle = () => {
    const songData = useMusicStore.getState().song;
    if (songData?.shuffle_state) {
      useMappingStore.getState().updateIcon("shuffle", "shuffleDisabled");
    } else {
      useMappingStore.getState().updateIcon("shuffle", "");
    }
    this.handleSendCommand(AUDIO_REQUESTS.SHUFFLE, !songData?.shuffle_state || false);
    useMusicStore
      .getState()
      .setSong({ ...songData, shuffle_state: !songData?.shuffle_state || false });
  };

  Repeat = () => {
    const songData = useMusicStore.getState().song;
    let newRepeatState;
    switch (songData.repeat_state) {
      case "off":
        newRepeatState = "all";
        useMappingStore.getState().updateIcon("repeat", "");
        break;
      case "all":
        newRepeatState = "track";
        useMappingStore.getState().updateIcon("repeat", "repeatActive");
        break;
      case "track":
        newRepeatState = "off";
        useMappingStore.getState().updateIcon("repeat", "repeatDisabled");
        break;
      default:
        newRepeatState = "off";
    }
    useMusicStore
      .getState()
      .setSong({ ...songData, repeat_state: newRepeatState });
    this.handleSendCommand(AUDIO_REQUESTS.REPEAT, newRepeatState);
  };

  Pref = (action: Action) => {
    const updateSettings = useSettingsStore.getState().updatePreferences
    
    const app = this.getAppByButtonIndex(Number(action.value))

    updateSettings({
      currentView: { name: app },
    });
  };

  private getAppByButtonIndex = (index: number): string => {
    const apps = useAppStore.getState().apps;
    if (index < apps.length) {
      return apps[index]?.name || 'Unknown';
    }
    return "dashboard";
  };

  Swap = async (action: Action) => {
    const currentView = useSettingsStore.getState().preferences.currentView.name;
    const socketData: OutgoingSocketServer = {
        app: 'server',
        type: 'set',
        request: 'update_pref_index',
        payload: {
            app: currentView,
            index: Number(action.value)
        }
    }

    this.sendMessage(socketData)
  };

  VolUp = () => {
    const volume = useMusicStore.getState().song?.volume;
    if (volume <= 95) {
      this.handleSendCommand(AUDIO_REQUESTS.VOLUME, volume + 5);
      useMusicStore
        .getState()
        .setSong({ ...useMusicStore.getState().song, volume: volume + 5 });
    }
  };

  VolDown = () => {
    const volume = useMusicStore.getState().song?.volume;
    if (volume >= 5) {
      this.handleSendCommand(AUDIO_REQUESTS.VOLUME, volume - 5);
      useMusicStore
        .getState()
        .setSong({ ...useMusicStore.getState().song, volume: volume - 5 });
    }
  };

  private handleSendCommand = (
    request: AUDIO_REQUESTS,
    payload = null,
  ) => {
    const data: OutgoingSocketMusic = {
        type: 'set',
        app: 'music',
        request: request,
        payload: payload,
    };
    this.sendMessage(data);
  };

  toggleFullscreen = () => {
    const doc = document;
    
    try {
      if (!doc.fullscreenElement) {
        document.documentElement.requestFullscreen();
        useSettingsStore
          .getState()
          .addLog({ type: 'log', app: "ACTION", payload: "Entering fullscreen" });
        useMappingStore
          .getState()
          .updateIcon('fullscreen', "fullscreenActive");
      } else {
        doc.exitFullscreen();
        useSettingsStore
          .getState()
          .addLog({ type: "log", app: "ACTION", payload: "Leaving fullscreen" });
        useMappingStore
          .getState()
          .updateIcon('fullscreen', "");
      }
    } catch (error) {
      useSettingsStore
        .getState()
        .addLog({ type: "error", app: 'ACTION', payload: `Error! ${error}` });
    }
  };
  
  swipeL() {
    const currentView = useSettingsStore.getState().preferences.currentView.name;
    const apps = useAppStore.getState().apps;
    const currentIndex = apps.findIndex((app) => app.name === currentView);
    const nextIndex = (currentIndex - 1 + apps.length) % apps.length;
    useSettingsStore.getState().updatePreferences({
      currentView: { name: apps[nextIndex].name },
    });
  }

  Wheel() {
    const setWheel = useActionStore.getState().setWheelState;
    setWheel(true);
  }

  swipeR() {
    const currentView = useSettingsStore.getState().preferences.currentView.name;
    const apps = useAppStore.getState().apps;
    const currentIndex = apps.findIndex((app) => app.name === currentView);
    const nextIndex = (currentIndex + 1) % apps.length;
    useSettingsStore.getState().updatePreferences({
      currentView: { name: apps[nextIndex].name },
    });
  }

  open = (action: Action) => {
    useSettingsStore.getState()
    .updatePreferences({
      currentView: { name: action.value },
    });
  };

  private actionMap = {
    fullscreen: this.toggleFullscreen,
    shuffle: this.Shuffle,
    rewind: this.Rewind,
    play: this.PlayPause,
    skip: this.Skip,
    repeat: this.Repeat,
    wheel: this.Wheel,
    pref: this.Pref,
    swap: this.Swap,
    volDown: this.VolDown,
    volUp: this.VolUp,
    appsList: this.handleHideAction,
    swipeL: this.swipeL,
    swipeR: this.swipeR,
    open: this.open
  };
}

export default ActionHandler.getInstance();
