export enum EventFlavor {
    Up,
    Down,
    Left,
    Right,
    Short,
    Long,
}

export type Button =
  | 'Pad1'
  | 'Pad2'
  | 'Pad3'
  | 'Pad4'
  | 'Pad5'
  | 'Pad6'
  | 'Pad7'
  | 'Pad8'
  | 'Pad9'
  | 'DynamicAction1'
  | 'DynamicAction2'
  | 'DynamicAction3'
  | 'DynamicAction4'
  | 'Action5'
  | 'Action6'
  | 'Action7'
  | `Key${string}` // This matches any key, like KeyA, KeyB, KeyM, etc.
  | `Digit${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0}` // Matches Digit1, Digit2, etc.
  | 'Enter'
  | 'Escape'
  | 'MouseLeft'
  | 'MouseRight'
  | 'MouseMiddle'
  | 'MouseX1'
  | 'MouseX2'
  | 'Scroll'
  | 'Swipe'
  | 'VolumeUp'
  | 'VolumeDown'
  | `F${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`

export type Action = {
    name: string
    description: string
    id: string
    flair: string
    source: string
}
export type Key = {
    id: string
    source: string
}

export type ButtonMapping = {
    [key: string]: {
      [flavor in EventFlavor]?: Action
    }
  };