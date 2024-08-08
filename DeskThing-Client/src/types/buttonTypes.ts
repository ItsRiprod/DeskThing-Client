export enum Button {
    BUTTON_1,
    BUTTON_2,
    BUTTON_3,
    BUTTON_4,
    BUTTON_5,
    SCROLL_LEFT,
    SCROLL_RIGHT,
    SCROLL_UP,
    SCROLL_DOWN,
    SCROLL_PRESS,
    FRONT_BUTTON,
    SWIPE,
    OTHER,
    KEYBOARD_KEY,
    MOUSE_BUTTON,
  }
  
  export enum EventFlavor {
    Down,
    Up,
    Long,
    Short,
    LongPress,
    LeftSwipe,
    RightSwipe,
    UpSwipe,
    DownSwipe,
  }

  export type Action = {
    name: string
    description: string
    id: string
    source: string
  }
  export type Key = {
    id: string
    source: string
  }

  export type ButtonMapping = {
    [key: string]: Action
  }