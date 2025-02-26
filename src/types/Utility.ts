import { LOGGING_LEVELS } from "@deskthing/types"

export interface Log {
    type: LOGGING_LEVELS
    payload: string
    app: string
  }
  