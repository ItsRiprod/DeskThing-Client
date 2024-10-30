import socket from './WebSocketService';
import { AppStore, ControlStore, LogStore, MusicStore, UIStore } from '../stores';
import { Action, AUDIO_REQUESTS, Button, EventFlavor } from '../types';

export class ActionHandler {
  private static instance: ActionHandler;
  private musicStore = MusicStore.getInstance();
  private uiStore = UIStore.getInstance();
  private appStore = AppStore.getInstance();

  private constructor() {
    this.musicStore = MusicStore.getInstance();
    this.uiStore = UIStore.getInstance();
    this.appStore = AppStore.getInstance();

    this.uiStore.shiftViewLeft = this.uiStore.shiftViewLeft.bind(this.uiStore);
    this.uiStore.shiftViewRight = this.uiStore.shiftViewRight.bind(this.uiStore);
    this.uiStore.setCurrentView = this.uiStore.setCurrentView.bind(this.uiStore);
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
      return;
    }

    const buttonNumber = button.match(/\d+/);
    const extractedNumber = buttonNumber ? parseInt(buttonNumber[0], 10) : null;
    
    this.runAction(action, extractedNumber)
  }

  /**
   * Executes an action based on the Action information
   * @params action The action to be executed
   */
  runAction = async (action: Action, val = 0): Promise<void> => {

    const { source, id } = action;

    if (source === 'server') {
      this.handleServerAction(action, val);
    } else {
      await this.handleClientAction(source, id, val);
    }
  }

    /**
   * Handle server-side actions
   * @param action The action to be handled
   */
  private async handleServerAction(action: Action, val: number = null): Promise<void> {
    const handler = this.actionMap[action.id];
    if (handler) {
      handler(val);
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
        type: 'action',
        payload: { id: id, value: val }
      }
      await socket.post(socketData);
    } catch (error) {
      console.error(`Failed to forward action to server: ${error}`);
    }
  }


  private handleShowAction(): void {
    if (LogStore.handleNext('d')) return
    const uiStore = UIStore.getInstance()
    const mode = uiStore.getAppsListMode()
    switch (mode) {
      case 'hidden':
        uiStore.setAppsListMode('peek');
        break;
      case 'peek':
        uiStore.setAppsListMode('full');
        break;
      // If already fullscreen, do nothing
      case 'full':
        break;
    }
  }

  // Handle "hide" action (swiping down)
  private handleHideAction(): void {
    LogStore.handleNext('u')
    const uiStore = UIStore.getInstance()
    const mode = uiStore.getAppsListMode()
    switch (mode) {
      case 'full':
        uiStore.setAppsListMode('peek');
        break;
      case 'peek':
        uiStore.setAppsListMode('hidden');
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

  Skip = () => {
    const songData = this.musicStore.getSongData();
    this.handleSendCommand(AUDIO_REQUESTS.NEXT, songData.id);
  };

  Seek = (ms: number) => {
    this.handleSendCommand(AUDIO_REQUESTS.SEEK, ms)
  };

  Rewind = () => {
    const songData = this.musicStore.getSongData();
    this.handleSendCommand(AUDIO_REQUESTS.PREVIOUS, songData.id);
    setTimeout(() => {
      this.musicStore.requestMusicData()
    }, 1000);
  };

  Shuffle = () => {
    const songData = this.musicStore.getSongData();
    if (songData.shuffle_state) {
      ControlStore.getInstance().updateFlair('shuffle', 'server', 'Disabled')
    } else {
      ControlStore.getInstance().updateFlair('shuffle', 'server', '')
    }
    this.handleSendCommand(AUDIO_REQUESTS.SHUFFLE, !songData.shuffle_state);
    this.musicStore.updateSongData({ shuffle_state: !songData.shuffle_state });
  };

  Repeat = () => {
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


  Pref = (num: number) => {
    this.uiStore.setCurrentView(this.getAppByButtonIndex(num - 1));
  }

  private getAppByButtonIndex = (index: number): string => {
    const apps = this.appStore.getApps()
    if (index <= apps.length) {
      return apps[index].name;
    }
    return 'dashboard'; // Default to dashboard if no valid app found
  };
  Swap = async (index: number = 5) => {
    const currentView = this.uiStore.getCurrentView();
    this.uiStore.setPrefIndex(currentView, index -1);
  }
  VolUp = () => {
    const volume = this.musicStore.getSongData().volume
    if (volume <= 95) {
      this.handleSendCommand(AUDIO_REQUESTS.VOLUME, volume + 5)
      this.musicStore.updateSongData({ volume: volume + 5 })
    }
  }
  VolDown = () => {
    const volume = this.musicStore.getSongData().volume
    if (volume >= 5) {
      this.handleSendCommand(AUDIO_REQUESTS.VOLUME, volume - 5)
      this.musicStore.updateSongData({ volume: volume - 5 })
    }
  }

  private handleSendCommand = (request: string, payload = null, app = 'music', type = 'set') => {
    if (socket.is_ready()) {
      const data = {
        type: type,
        request: request,
        app: app,
        payload: payload
      };
      socket.post(data);
    }
  }

  toggleFullscreen = () => {
    const doc = document as any;
    const docEl = document.documentElement as any;
    try {

      if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement) {
        // Enter fullscreen
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) { // Safari
          docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) { // Firefox
          docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) { // IE/Edge
          docEl.msRequestFullscreen();
        }
        LogStore.getInstance().sendMessage('ACTION', `Entering fullscreen`);
        ControlStore.getInstance().updateFlair('fullscreen', 'server', 'Reverse')
      } else {
        // Exit fullscreen
        if (doc.exitFullscreen) {
          doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) { // Safari
          doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) { // Firefox
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) { // IE/Edge
          doc.msExitFullscreen();
        }
        LogStore.getInstance().sendMessage('ACTION', `Leaving`);
        ControlStore.getInstance().updateFlair('fullscreen', 'server', '')
      }
    } catch (error) {
      LogStore.getInstance().sendError('ACTION', `Error! ${error}`);

    }
  };
  
  swipeL() {
    if (LogStore.handleNext('l')) return
    const uiStore = UIStore.getInstance()
    uiStore.shiftViewLeft()
  } 
  swipeR() {
    if (LogStore.handleNext('r')) return
    const uiStore = UIStore.getInstance()
    uiStore.shiftViewRight()
  } 

  // THESE ARE ALL FUNCTIONS
  private actionMap = {
    'fullscreen': this.toggleFullscreen,
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
    'swipeL': this.swipeL,
    'swipeR': this.swipeR,
    'dashboard': () => this.uiStore.setCurrentView('dashboard'),
    'utility': () => this.uiStore.setCurrentView('utility'),
    'landing': () => this.uiStore.setCurrentView('landing')
  };
}

export default ActionHandler.getInstance();
