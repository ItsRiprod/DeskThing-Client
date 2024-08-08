export interface SocketData {
    app: string;
    type: string;
    request?: string;
    data?: Array<string> | string | object | number | { [key:string]: string | Array<string> };
  }
