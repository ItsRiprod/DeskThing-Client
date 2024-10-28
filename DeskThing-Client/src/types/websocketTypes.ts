import { App, ViewMode } from ".";

export interface SocketData {
    app: string;
    type: string;
    request?: string;
    payload?: Array<string> | string | object | number | { [key:string]: string | Array<string> } | App[] | boolean | ViewMode;
  }
