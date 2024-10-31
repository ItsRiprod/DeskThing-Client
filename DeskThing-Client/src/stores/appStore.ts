/**
 * @file AppStore.ts
 * @description This file contains the AppStore class, which is responsible for managing the state of the apps and settings.
 * @author Riprod
 * @version 0.8.0
 * 
 */
import WebSocketService from '../helpers/WebSocketService';
import { App, AppListSettings, SocketData } from '../types';
type AppUpdateCallbacks = (data: App[]) => void
type settingsUpdateCallbacks = (data: AppListSettings) => void

export class AppStore {
  private static instance: AppStore;
  // Websocket listener
  private listeners: (() => void)[] = []
  // Handled listeners
  private appUpdateCallbacks: AppUpdateCallbacks[] = [];
  private settingsUpdateCallbacks: settingsUpdateCallbacks[] = [];
  private apps: App[] = []
  private settings: AppListSettings = undefined


  private constructor() {
    this.initialize()
  }

  static getInstance(): AppStore {
    if (!AppStore.instance) {
      AppStore.instance = new AppStore();
    }
    return AppStore.instance;
  }

  private async initialize() {
    const socket = await WebSocketService;
    this.listeners.push(socket.on('client', this.handleClientData.bind(this)));
    this.requestUpdatedData()
  }

  // Notify all registered callbacks of the song data update
  private async notifyAppUpdates(): Promise<void> {
    // Update available apps
    this.appUpdateCallbacks.forEach(callback => callback(this.apps));
  }

  // Notify all registered callbacks of the settings update
  private async notifySettingsUpdates(): Promise<void> {
    this.settingsUpdateCallbacks.forEach(callback => callback(this.settings));
  }

  onAppUpdates(callback: AppUpdateCallbacks) {
    this.appUpdateCallbacks.push(callback);
    return () => {
      this.appUpdateCallbacks = this.appUpdateCallbacks.filter(cb => cb !== callback);
    };
  }
  onSettingsUpdates(callback: settingsUpdateCallbacks) {
    this.settingsUpdateCallbacks.push(callback);
    return () => {
      this.settingsUpdateCallbacks = this.settingsUpdateCallbacks.filter(cb => cb !== callback);
    };
  }

  getApps(): App[] {
    return this.apps;
  }

  getSettings(): AppListSettings {
    return this.settings;
  }

  requestUpdatedData(): void {
    const socket = WebSocketService;
    socket.post({
      app: 'server',
      type: 'get'
    })
  }

  updateApps(newApp: App) {
    this.apps = [...this.apps, newApp];
    this.notifyAppUpdates();
  }

  private handleClientData = (msg: SocketData) => {
    if (msg.type === 'config') {
      const data = msg.payload as App[]
      this.apps = data;
      this.notifyAppUpdates()
    } else if (msg.type === 'settings') {
      const data = msg.payload as AppListSettings
      this.settings = data;
      this.notifySettingsUpdates()
    }
  };

  cleanup() {
    this.listeners.forEach(removeListener => removeListener())
    this.appUpdateCallbacks = []
  }
}

export default AppStore.getInstance();