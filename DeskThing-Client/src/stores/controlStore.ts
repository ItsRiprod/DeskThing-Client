/**
 * @file ControlStore.ts
 * @description This file contains the ControlStore class, which is responsible for managing the button mappings and handling button presses.
 * @author Riprod
 * @version 0.8.0
 */
import WebSocketService from '../helpers/WebSocketService';
import { Action, ButtonMapping, SocketData } from '../types';

export class ControlStore {
  private static instance: ControlStore;
  private buttonMapping: ButtonMapping = {};

  private constructor() {
    this.initializeTrays();
    this.setupWebSocket();
  }

  private async setupWebSocket() {
    await new Promise(resolve => setTimeout(resolve, 100));
    const socket = await WebSocketService; // Ensure WebSocketService is initialized
    socket.on('client', this.handleClientData.bind(this));
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
        tray1: { name: 'Shuffle', id: 'shuffle', description: 'Shuffle', source: 'server' },
        tray2: { name: 'Rewind', id: 'rewind', description: 'Rewind', source: 'server' },
        tray3: { name: 'PlayPause', id: 'playPause', description: 'PlayPause', source: 'server' },
        tray4: { name: 'Skip', id: 'skip', description: 'Skip', source: 'server' },
        tray5: { name: 'Repeat', id: 'repeat', description: 'Repeat', source: 'server' },
        button1: { name: 'Pref1', id: 'pref1', description: 'Pref1', source: 'server' },
        button2: { name: 'Pref2', id: 'pref2', description: 'Pref2', source: 'server' },
        button3: { name: 'Pref3', id: 'pref3', description: 'Pref3', source: 'server' },
        button4: { name: 'Pref4', id: 'pref4', description: 'Pref4', source: 'server' },
        button1_long: { name: 'Swap', id: 'swap', description: 'Swap', source: 'server' },
        button2_long: { name: 'Swap', id: 'swap', description: 'Swap', source: 'server' },
        button3_long: { name: 'Swap', id: 'swap', description: 'Swap', source: 'server' },
        button4_long: { name: 'Swap', id: 'swap', description: 'Swap', source: 'server' },
        dial_scroll_right: { name: 'VolUp', id: 'volUp', description: 'VolUp', source: 'server' },
        dial_scroll_left: { name: 'VolDown', id: 'volDown', description: 'VolDown', source: 'server' },
        dial_press: { name: 'PlayPause', id: 'playPause', description: 'PlayPause', source: 'server' },
        dial_press_long: { name: 'Skip', id: 'skip', description: 'Skip', source: 'server' },
        face_press: { name: 'Repeat', id: 'repeat', description: 'Repeat', source: 'server' },
        face_long: { name: 'Repeat', id: 'repeat', description: 'Repeat', source: 'server' }
    };
    this.handleConfigUpdate(initialTrayConfig);
  }

  private handleConfigUpdate(data: ButtonMapping): void {
    for (const [key, action] of Object.entries(data)) {
        this.buttonMapping[key] = action;
    }
  }

  private handleClientData(msg: SocketData): void {
    if (msg.type === 'button_mappings') {
      this.handleConfigUpdate(msg.data as ButtonMapping);
    }
  }

  getButtonMapping(button: string): Action | undefined {
    return this.buttonMapping[button];
  }

  getButtButtonMappings(): ButtonMapping {
    return this.buttonMapping;
  }
}

export default ControlStore.getInstance();