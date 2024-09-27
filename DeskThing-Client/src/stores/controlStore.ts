/**
 * @file ControlStore.ts
 * @description This file contains the ControlStore class, which is responsible for managing the button mappings and handling button presses.
 * @author Riprod
 * @version 0.8.0
 */
import WebSocketService from '../helpers/WebSocketService';
import { Action, Button, ButtonMapping, EventFlavor, SocketData, SongData } from '../types';
import logStore from './logStore';
import musicStore from './musicStore';

type MappingCallback = () => void

export class ControlStore {
  private static instance: ControlStore;
  private buttonMapping: ButtonMapping = {};
  private listener: (() => void)[] = []
  private ActionListeners: MappingCallback[] = []

  private constructor() {
    this.initializeTrays();
    this.setupWebSocket();
  }

  private async setupWebSocket() {
    await new Promise(resolve => setTimeout(resolve, 100));
    const socket = await WebSocketService; // Ensure WebSocketService is initialized
    this.listener.push(socket.on('client', this.handleClientData.bind(this)))
    this.listener.push(musicStore.subscribeToSongDataUpdate(this.updateButtonStates.bind(this)))
  }

  static getInstance(): ControlStore {
    if (!ControlStore.instance) {
      ControlStore.instance = new ControlStore();
    }
    return ControlStore.instance;
  }

  private initializeTrays(): void {
    // Setting up the default maps
    const initialTrayConfig: ButtonMapping = {
      Pad1: {
        [EventFlavor.Down]: { flair: '', name: 'VolUp', id: 'volUp', description: 'VolUp', source: 'server' }
      },
      Pad2: {
        [EventFlavor.Down]: { flair: '', name: 'Swipe Left', id: 'swipeL', description: 'Goes to left app', source: 'server' }
      },
      Pad3: {
        [EventFlavor.Down]: { flair: '', name: 'Swipe Right', id: 'swipeR', description: 'Goes to right app', source: 'server' }
      },
      Pad4: {
        [EventFlavor.Down]: { flair: '', name: 'VolDown', id: 'volDown', description: 'VolDown', source: 'server' }
      },
      Pad5: {
        [EventFlavor.Down]: { flair: '', name: 'Hide AppsList', id: 'hide', description: 'Hides the apps list', source: 'server' }
      },
      Pad6: {
        [EventFlavor.Down]: { flair: '', name: 'Show AppsList', id: 'show', description: 'Shows the apps list', source: 'server' }
      },
      Pad7: {
        [EventFlavor.Down]: { flair: '', name: 'Repeat', id: 'repeat', description: 'Repeat', source: 'server' }
      },
      Pad8: {
        [EventFlavor.Down]: { flair: '', name: 'PlayPause', id: 'play', description: 'Plays or Pauses Audio', source: 'server' }
      },
      Pad9: {
        [EventFlavor.Down]: { flair: '', name: 'Fullscreen', id: 'fullscreen', description: 'Fullscreens the application', source: 'server' }
      },
      DynamicAction1: {
        [EventFlavor.Down]: { flair: '', name: 'Repeat', id: 'repeat', description: 'Repeat', source: 'server' }  
      },
      DynamicAction2: {
        [EventFlavor.Down]: { flair: '', name: 'Shuffle', id: 'shuffle', description: 'Shuffle', source: 'server' }  
      },
      DynamicAction3: {
          [EventFlavor.Down]: { flair: '', name: 'Rewind', id: 'rewind', description: 'Rewind', source: 'server' }
      },
      DynamicAction4: {
        [EventFlavor.Down]: { name: 'Hidden Button', id: 'hidden', description: 'Hides the button. Has no action', source: 'server', flair: '' }
      },
      Action5: {
        [EventFlavor.Down]: { name: 'Hidden Button', id: 'hidden', description: 'Hides the button. Has no action', source: 'server', flair: '' }
      },
      Action6: {
          [EventFlavor.Down]: { flair: '', name: 'PlayPause', id: 'play', description: 'Plays or Pauses Audio', source: 'server' }
      },
      Action7: {
          [EventFlavor.Down]: { flair: '', name: 'Skip', id: 'skip', description: 'Skip', source: 'server' }
      },
      Digit1: {
          [EventFlavor.Short]: { flair: '', name: 'Pref', id: 'pref', description: 'Changed Pref', source: 'server' },
          [EventFlavor.Long]: { flair: '', name: 'Swap', id: 'swap', description: 'Swap', source: 'server' }
        },
        Digit2: {
          [EventFlavor.Short]: { flair: '', name: 'Pref', id: 'pref', description: 'Changed Pref', source: 'server' },
          [EventFlavor.Long]: { flair: '', name: 'Swap', id: 'swap', description: 'Swap', source: 'server' }
        },
        Digit3: {
        [EventFlavor.Short]: { flair: '', name: 'Pref', id: 'pref', description: 'Changed Pref', source: 'server' },
        [EventFlavor.Long]: { flair: '', name: 'Swap', id: 'swap', description: 'Swap', source: 'server' }
      },
      Digit4: {
          [EventFlavor.Short]: { flair: '', name: 'Pref', id: 'pref', description: 'Changed Pref', source: 'server' },
          [EventFlavor.Long]: { flair: '', name: 'Swap', id: 'swap', description: 'Swap', source: 'server' }
      },
      KeyM: {
          [EventFlavor.Short]: { flair: '', name: 'Dashboard', id: 'dashboard', description: 'Open Dashboard', source: 'server' },
          [EventFlavor.Long]: { flair: '', name: 'Utility', id: 'utility', description: 'Open Utility', source: 'server' }
      },
      Scroll: {
          [EventFlavor.Right]: { flair: '', name: 'VolUp', id: 'volUp', description: 'VolUp', source: 'server' },
          [EventFlavor.Up]: { flair: '', name: 'VolUp', id: 'volUp', description: 'VolUp', source: 'server' },
          [EventFlavor.Left]: { flair: '', name: 'VolDown', id: 'volDown', description: 'VolDown', source: 'server' },
          [EventFlavor.Down]: { flair: '', name: 'VolDown', id: 'volDown', description: 'VolDown', source: 'server' }
      },
      Enter: {
          [EventFlavor.Down]: { flair: '', name: 'playPause', id: 'play', description: 'PlayPause', source: 'server' },
          [EventFlavor.Long]: { flair: '', name: 'Skip', id: 'skip', description: 'Skip', source: 'server' }
      },
      Escape: {
          [EventFlavor.Short]: { flair: '', name: 'Show AppsList', id: 'show', description: 'Shows the apps list', source: 'server' },
          [EventFlavor.Long]: { flair: '', name: 'Hide AppsList', id: 'hide', description: 'Hides the apps list', source: 'server' }
      },
      Swipe: {
        [EventFlavor.Up]: { flair: '', name: 'Hide AppsList', id: 'hide', description: 'Hides the apps list', source: 'server' },
        [EventFlavor.Down]: { flair: '', name: 'Show AppsList', id: 'show', description: 'Shows the apps list', source: 'server' },
        [EventFlavor.Left]: { flair: '', name: 'Swipe Left', id: 'swipeL', description: 'Goes to left app', source: 'server' },
        [EventFlavor.Right]: { flair: '', name: 'Swipe Right', id: 'swipeR', description: 'Goes to right app', source: 'server' },
      }
  };
    this.handleConfigUpdate(initialTrayConfig);
  }

  private handleConfigUpdate(data: ButtonMapping): void {
    for (const [button, eventFlavors] of Object.entries(data)) {
      this.buttonMapping[button] = eventFlavors;
      this.notifyListeners();
    }
  }

  private handleClientData(msg: SocketData): void {
    if (msg.type === 'button_mappings') {
      logStore.sendLog('controlStore', 'ControlStore: Received Button Mappings')
      this.handleConfigUpdate(msg.payload as ButtonMapping);
    }
  }

  getButtonMapping(button: Button, flavor: EventFlavor): Action | undefined {
    return this.buttonMapping[button]?.[flavor];
  }

  on(callback: MappingCallback): () => void {
    this.ActionListeners.push(callback)

    return () => this.removeListener(callback);
  }

  private removeListener(callback: MappingCallback) {
    this.ActionListeners.filter(listener => listener !== callback);
  }

  /**
   * Updates the flair for a specific Action.
   * @param id The Action's ID to update.
   * @param source The Action's source.
   * @param flair The new flair value.
   */
  updateFlair(id: string, source: string, flair: string): void {
    let updated = false;

    // Iterate through all buttons and their respective flavors
    for (const [_button, eventFlavors] of Object.entries(this.buttonMapping)) {
        for (const [_flavor, action] of Object.entries(eventFlavors)) {
            if (action.id === id && action.source === source) {
                action.flair = flair;
                updated = true;
            }
        }
    }

    // If any action was updated, notify listeners
    if (updated) {
        this.notifyListeners();
    }
  }

  async updateButtonStates(songData: SongData): Promise<void> {
    if (songData.is_playing) {
      this.updateFlair('play', 'server', 'Pause')
    } else {
      this.updateFlair('play', 'server', '')
    }
    if (songData.shuffle_state) {
      this.updateFlair('shuffle', 'server', '')
    } else {
      this.updateFlair('shuffle', 'server', 'Disabled')
    }
    if (songData.repeat_state == 'off') {
      this.updateFlair('repeat', 'server', 'Disabled')
    } else if (songData.repeat_state == 'all') {
      this.updateFlair('repeat', 'server', '')
    } else {
      this.updateFlair('repeat', 'server', 'Active')
    }
  }

  getButtonMappings(): ButtonMapping {
    return this.buttonMapping;
  }

  destroy(): void {
    if (this.listener && typeof this.listener === 'object') {
        Object.values(this.listener).forEach(unsubscribe => {
          unsubscribe();
        });
    }
}


  notifyListeners() {
    this.ActionListeners.forEach(callback => callback());
  }
}

export default ControlStore.getInstance();