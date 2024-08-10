import socket from './WebSocketService';
import { AppStore, ControlStore, MusicStore, UIStore } from '../stores';
import { Action, AUDIO_REQUESTS, Button, EventFlavor } from '../types';

export class ActionHandler {
  private static instance: ActionHandler;
  private musicStore = MusicStore.getInstance();
  private uiStore = UIStore.getInstance();
  private appStore = AppStore.getInstance();

  private constructor() {
  }

  static getInstance(): ActionHandler {
    if (!ActionHandler.instance) {
      ActionHandler.instance = new ActionHandler();
    }
    return ActionHandler.instance;
  }

  /**
   * Execute an action based on its source
   * @param button The button or action identifier to be executed
   */
  executeAction = async (button: Button, flavor: EventFlavor): Promise<void> => {
    const action = ControlStore.getInstance().getButtonMapping(button, flavor);
    if (!action) {
      // console.warn(`No action found for button: ${button} ${EventFlavor[flavor]}`);
      return;
    }

    const { source, id } = action;

    // Extract the first number from the button's name
    const buttonNumber = button.match(/\d+/);
    const extractedNumber = buttonNumber ? parseInt(buttonNumber[0], 10) : null;

    if (source === 'server') {
      this.handleServerAction(action, extractedNumber);
    } else {
      await this.handleClientAction(source, id, extractedNumber);
    }
  }

  /**
   * Handle server-side actions
   * @param action The action to be handled
   */
  private async handleServerAction(action: Action, val: number = null): Promise<void> {
    const handler = this.actionMap[action.id];
    if (handler) {
      handler.call(this, val);
    } else {
      console.warn(`No handler found for action: ${action.id}`);
    }
  }

  /**
   * Handle client-side actions by forwarding them to the server
   * @param source The source of the action
   * @param id The id of the action
   */
  private async handleClientAction(source: string, id: string, val: number = null): Promise<void> {
    try {
      const socketData = {
        app: source,
        type: 'button',
        data: { id: id, val: val }
      }
      await socket.post(socketData);
    } catch (error) {
      console.error(`Failed to forward action to server: ${error}`);
    }
  }


  private handleShowAction(): void {
    const mode = this.uiStore.getAppsListMode();
    switch (mode) {
      case 'hidden':
        this.uiStore.setAppsListMode('peek');
        break;
      case 'peek':
        this.uiStore.setAppsListMode('full');
        break;
      // If already fullscreen, do nothing
      case 'full':
        break;
    }
  }

  // Handle "hide" action (swiping down)
  private handleHideAction(): void {
    const mode = this.uiStore.getAppsListMode();
    switch (mode) {
      case 'full':
        this.uiStore.setAppsListMode('peek');
        break;
      case 'peek':
        this.uiStore.setAppsListMode('hidden');
        break;
      // If already hidden, do nothing
      case 'hidden':
        break;
    }
  }

  PlayPause = () => {
    const songData = this.musicStore.getSongData();
    if (songData.is_playing) {
      this.handleSendCommand(AUDIO_REQUESTS.PAUSE);
      ControlStore.getInstance().updateFlair('play', 'server', '')
    } else {
      this.handleSendCommand(AUDIO_REQUESTS.PLAY, songData.id);
      ControlStore.getInstance().updateFlair('play', 'server', 'Pause')
    }
    this.musicStore.updateSongData({ is_playing: !songData.is_playing });
  };

  private Skip = () => {
    const songData = this.musicStore.getSongData();
    this.handleSendCommand(AUDIO_REQUESTS.NEXT, songData.id);
  };

  private Rewind = () => {
    const songData = this.musicStore.getSongData();
    this.handleSendCommand(AUDIO_REQUESTS.PREVIOUS, songData.id);
  };

  private Shuffle = () => {
    const songData = this.musicStore.getSongData();
    if (songData.shuffle_state) {
      ControlStore.getInstance().updateFlair('shuffle', 'server', 'Disabled')
    } else {
      ControlStore.getInstance().updateFlair('shuffle', 'server', '')
    }
    this.handleSendCommand(AUDIO_REQUESTS.SHUFFLE, !songData.shuffle_state);
    this.musicStore.updateSongData({ shuffle_state: !songData.shuffle_state });
  };

  private Repeat = () => {
    const songData = this.musicStore.getSongData();
    let newRepeatState;
    switch (songData.repeat_state) {
      case 'off':
        newRepeatState = 'all';
        ControlStore.getInstance().updateFlair('repeat', 'server', '')
        break;
      case 'all':
        newRepeatState = 'track';
        ControlStore.getInstance().updateFlair('repeat', 'server', 'Active')
        break;
      case 'track':
        newRepeatState = 'off';
        ControlStore.getInstance().updateFlair('repeat', 'server', 'Disabled')
        break;
      default:
        newRepeatState = 'off';
    }
    this.musicStore.updateSongData({ repeat_state: newRepeatState });
    this.handleSendCommand(AUDIO_REQUESTS.REPEAT, newRepeatState);
  };


  private Pref = (num: number) => {
    this.uiStore.setCurrentView(this.getAppByButtonIndex(num - 1));
  }

  private getAppByButtonIndex = (index: number): string => {
    const apps = this.appStore.getApps()
    if (index <= apps.length) {
      return apps[index].name;
    }
    return 'dashboard'; // Default to dashboard if no valid app found
  };
  private Swap = async (index: number = 5) => {
    const currentView = this.uiStore.getCurrentView();
    this.uiStore.setPrefIndex(currentView, index);
  }
  private VolUp = () => {
    const volume = this.musicStore.getSongData().volume
    if (volume <= 95) {
      this.handleSendCommand(AUDIO_REQUESTS.VOLUME, volume + 5)
      this.musicStore.updateSongData({ volume: volume + 5 })
    }
  }
  private VolDown = () => {
    const volume = this.musicStore.getSongData().volume
    if (volume >= 5) {
      this.handleSendCommand(AUDIO_REQUESTS.VOLUME, volume - 5)
      this.musicStore.updateSongData({ volume: volume - 5 })
    }
  }

  private handleSendCommand = (request: string, payload = null, app = 'utility', type = 'set') => {
    if (socket.is_ready()) {
      const data = {
        type: type,
        request: request,
        app: app,
        data: payload
      };
      socket.post(data);
    }
  }

  // THESE ARE ALL FUNCTIONS
  private actionMap = {
    'shuffle': this.Shuffle,
    'rewind': this.Rewind,
    'play': this.PlayPause,
    'skip': this.Skip,
    'repeat': this.Repeat,
    'pref': (val: number) => this.Pref(val),
    'swap': (val: number) => this.Swap(val),
    'volDown': this.VolDown,
    'volUp': this.VolUp,
    'hide': this.handleHideAction,
    'show': this.handleShowAction,
    'swipeL': this.uiStore.shiftViewLeft,
    'swipeR': this.uiStore.shiftViewRight,
    'dashboard': () => this.uiStore.setCurrentView('dashboard'),
    'utility': () => this.uiStore.setCurrentView('utility'),
    'landing': () => this.uiStore.setCurrentView('landing')
  };
}

export default ActionHandler.getInstance();
