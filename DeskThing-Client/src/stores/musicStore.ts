/**
 * @file MusicStore.ts
 * @description This file contains the MusicStore class which is responsible for managing the music data and actions.
 * @author Riprod
 * @version 0.8.0
 */
import { AUDIO_REQUESTS, SocketData, SongData } from '../types';
import WebSocketService from '../helpers/WebSocketService';
import { findAlbumArtColor, getContrastingColor } from '../utils/colorUtil';

type SongDataUpdateCallback = (data: SongData) => void;

export class MusicStore {
  private static instance: MusicStore;
  private songData: SongData = {} as SongData;
  private songDataUpdateCallbacks: SongDataUpdateCallback[] = [];

  private constructor() {
    this.setupWebSocket();
  }

  private async setupWebSocket() {
    const socket = await WebSocketService; // Ensure WebSocketService is initialized
    socket.on('client', this.handleClientData.bind(this));
    this.requestMusicData()
  }

  static getInstance(): MusicStore {
    if (!MusicStore.instance) {
        MusicStore.instance = new MusicStore();
    }
    return MusicStore.instance;
  }

  private async handleClientData(msg: SocketData): Promise<void> {
    if (msg.type === 'song') {
      const data = msg.payload as SongData;
      if (data.thumbnail && data.thumbnail != this.songData.thumbnail) {
        this.songData = { ...this.songData, ...data, timestamp: new Date().getTime() };
        const imageElement = new Image();
        imageElement.src = data.thumbnail;
        imageElement.onload = () => {
          findAlbumArtColor(imageElement).then((avgColor) => {
            document.documentElement.style.setProperty('--album-color', avgColor);
            getContrastingColor(avgColor).then((contrastColor) => {
              document.documentElement.style.setProperty('--text-color', contrastColor);
              this.notifySongDataUpdate();
            })
          });
        };
      } else {
        if (!data.thumbnail && data.id != this.songData.id && this.songData.track_name != undefined) {
          this.requestMusicData();
        }
        this.songData = { ...this.songData ,...data, timestamp: new Date().getTime() };
        this.notifySongDataUpdate();
      }

    }
  }

  private async notifySongDataUpdate(): Promise<void> {
    this.songDataUpdateCallbacks.forEach(callback => callback(this.songData));
  }

  subscribeToSongDataUpdate(callback: SongDataUpdateCallback): () => void {
    this.songDataUpdateCallbacks.push(callback);
    return () => {
      this.songDataUpdateCallbacks = this.songDataUpdateCallbacks.filter(cb => cb !== callback);
    };
  }

  getSongData(): SongData {
    return this.songData;
  }

  async requestMusicData(): Promise<void> {
    if (WebSocketService.is_ready()) {
      const data = { app: 'music', type: 'get', request: AUDIO_REQUESTS.SONG };
      WebSocketService.post(data);
    }
  }

  updateSongData(updatedData: Partial<SongData>): void {
    this.songData = { ...this.songData, ...updatedData };
    this.notifySongDataUpdate();
  }

  cleanup(): void {
    this.songDataUpdateCallbacks = [];
  }
}

export default MusicStore.getInstance();