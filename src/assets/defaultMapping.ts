import { EventMode, ButtonMapping } from '@src/types'


export const defaults: ButtonMapping = {
  id: 'default',
  name: 'The Default Mapping',
  description: 'The default mapping for the DeskThing',
  version: '0.9.0',
  version_code: 9,
  mapping: {
    Wheel1: {
      [EventMode.KeyDown]: {
        version: '0.9.1',
        version_code: 9.1,
        enabled: true,
        icon: '',
        name: 'Pref',
        id: 'pref',
        description: 'Changed Pref',
        source: 'server',
        value: '0'
      }
    },
    Wheel2: {
      [EventMode.KeyDown]: {
        version: '0.9.1',
        version_code: 9.1,
        enabled: true,
        icon: '',
        name: 'Pref',
        id: 'pref',
        description: 'Changed Pref',
        source: 'server',
        value: '1'
      }
    },
    Wheel3: {
      [EventMode.KeyDown]: {
        version: '0.9.1',
        version_code: 9.1,
        enabled: true,
        icon: '',
        name: 'Pref',
        id: 'pref',
        description: 'Changed Pref',
        source: 'server',
        value: '2'
      }
    },
    Wheel4: {
      [EventMode.KeyDown]: {
        version: '0.9.1',
        version_code: 9.1,
        enabled: true,
        icon: '',
        name: 'Pref',
        id: 'pref',
        description: 'Changed Pref',
        source: 'server',
        value: '3'
      }
    },
    Pad1: {
      [EventMode.KeyDown]: {
        name: 'Volume Up',
        id: 'volUp',
        value: '15',
        value_instructions: 'The amount of volume to change by',
        description: 'Turns the volume up',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Pad2: {
      [EventMode.KeyDown]: {
        name: 'Open Previous',
        id: 'swipeL',
        description: 'Opens the app at the previous index',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Pad3: {
      [EventMode.KeyDown]: {
        name: 'Open Next',
        id: 'swipeR',
        description: 'Opens the app at the next index',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Pad4: {
      [EventMode.KeyDown]: {
        name: 'Volume Down',
        id: 'volDown',
        value: '15',
        value_instructions: 'The amount of volume to change by',
        description: 'Turns the volume down',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Pad5: {
      [EventMode.KeyDown]: {
        name: 'Toggle AppsList',
        id: 'appsList',
        value: 'hide',
        value_options: ['hide', 'toggle', 'show'],
        value_instructions: 'How the button behaves',
        description: 'Toggles the apps list.',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Pad6: {
      [EventMode.KeyDown]: {
        name: 'Toggle AppsList',
        id: 'appsList',
        value: 'show',
        value_options: ['hide', 'toggle', 'show'],
        value_instructions: 'How the button behaves',
        description: 'Toggles the apps list.',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Pad7: {
      [EventMode.KeyDown]: {
        name: 'Repeat',
        id: 'repeat',
        description: 'Toggles repeat',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Pad8: {
      [EventMode.KeyDown]: {
        name: 'PlayPause',
        id: 'play',
        icon: 'play',
        description: 'Plays or Pauses the song',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Pad9: {
      [EventMode.KeyDown]: {
        name: 'Fullscreen',
        id: 'fullscreen',
        description: 'Toggles Fullscreen on most devices',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    DynamicAction1: {
      [EventMode.KeyDown]: {
        name: 'Shuffle',
        id: 'shuffle',
        value: 'toggle',
        value_options: ['off', 'toggle', 'on'],
        value_instructions: 'Toggles the shuffle setting',
        description: 'Shuffles the song',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    DynamicAction2: {
      [EventMode.KeyDown]: {
        name: 'Repeat',
        id: 'repeat',
        description: 'Repeats the song',
        source: 'server',
        enabled: true,
        version_code: 9,
        version: '0.9.0'
      }
    },
    DynamicAction3: {
      [EventMode.KeyDown]: {
        name: 'Rewind',
        id: 'rewind',
        value: 'stop',
        value_options: ['rewind', 'stop'],
        value_instructions:
          'Determines if the song should skip to 0 and then skip to previous track or just skip to previous track',
        description: 'Rewinds the song',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    DynamicAction4: {
      [EventMode.KeyDown]: {
        name: 'Hidden Button',
        id: 'hidden',
        description: 'Hides the button. Has no action',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Action5: {
      [EventMode.KeyDown]: {
        name: 'Hidden Button',
        id: 'hidden',
        description: 'Hides the button. Has no action',
        source: 'server',
        enabled: true,
        version_code: 9,
        version: '0.9.0'
      }
    },
    Action6: {
      [EventMode.KeyDown]: {
        name: 'PlayPause',
        id: 'play',
        icon: 'play',
        description: 'Plays or Pauses the song',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Action7: {
      [EventMode.KeyDown]: {
        name: 'Skip',
        id: 'skip',
        description: 'Skips the song',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Digit1: {
      [EventMode.PressShort]: {
        name: 'Open Preference App',
        id: 'pref',
        value: '0',
        value_instructions: 'The index of the app to open',
        description: 'Opens the app at the index in the value',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      },
      [EventMode.PressLong]: {
        name: 'Swap Apps',
        id: 'swap',
        value: '0',
        value_instructions: 'The index of the app to swap with the current app',
        description: 'Swaps the current app with the selected one',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Digit2: {
      [EventMode.PressShort]: {
        name: 'Open Preference App',
        id: 'pref',
        value: '1',
        value_instructions: 'The index of the app to open',
        description: 'Opens the app at the index in the value',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      },
      [EventMode.PressLong]: {
        name: 'Swap Apps',
        id: 'swap',
        value: '1',
        value_instructions: 'The index of the app to swap with the current app',
        description: 'Swaps the current app with the selected one',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Digit3: {
      [EventMode.PressShort]: {
        name: 'Open Preference App',
        id: 'pref',
        value: '2',
        value_instructions: 'The index of the app to open',
        description: 'Opens the app at the index in the value',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      },
      [EventMode.PressLong]: {
        name: 'Swap Apps',
        id: 'swap',
        value: '2',
        value_instructions: 'The index of the app to swap with the current app',
        description: 'Swaps the current app with the selected one',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Digit4: {
      [EventMode.PressShort]: {
        name: 'Open Preference App',
        id: 'pref',
        value: '3',
        value_instructions: 'The index of the app to open',
        description: 'Opens the app at the index in the value',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      },
      [EventMode.PressLong]: {
        name: 'Swap Apps',
        id: 'swap',
        value: '3',
        value_instructions: 'The index of the app to swap with the current app',
        description: 'Swaps the current app with the selected one',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    KeyM: {
      [EventMode.PressShort]: {
        name: 'Open App',
        id: 'open',
        value: 'dashboard',
        value_instructions: 'The id of the app to open',
        description: 'Opens the app defined in the value',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      },
      [EventMode.PressLong]: {
        name: 'Open App',
        id: 'open',
        value: 'utility',
        value_instructions: 'The id of the app to open',
        description: 'Opens the app defined in the value',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Scroll: {
      [EventMode.ScrollRight]: {
        name: 'Volume Up',
        id: 'volUp',
        value: '15',
        value_instructions: 'The amount of volume to change by',
        description: 'Turns the volume up',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      },
      [EventMode.ScrollUp]: {
        name: 'Volume Up',
        id: 'volUp',
        value: '15',
        value_instructions: 'The amount of volume to change by',
        description: 'Turns the volume up',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      },
      [EventMode.ScrollLeft]: {
        name: 'Volume Down',
        id: 'volDown',
        value: '15',
        value_instructions: 'The amount of volume to change by',
        description: 'Turns the volume down',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      },
      [EventMode.ScrollDown]: {
        name: 'Volume Down',
        id: 'volDown',
        value: '15',
        value_instructions: 'The amount of volume to change by',
        description: 'Turns the volume down',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Enter: {
      [EventMode.KeyDown]: {
        name: 'WheelSelect',
        id: 'wheel',
        icon: 'wheel',
        description: 'Opens the selection wheel',
        source: 'server',
        version: '0.9.1',
        version_code: 9.1,
        enabled: true
      },
      [EventMode.PressLong]: {
        name: 'Skip',
        id: 'skip',
        description: 'Skips the song',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Escape: {
      [EventMode.PressShort]: {
        name: 'Toggle AppsList',
        id: 'appsList',
        value: 'show',
        value_options: ['hide', 'toggle', 'show'],
        value_instructions: 'How the button behaves',
        description: 'Toggles the apps list.',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      },
      [EventMode.PressLong]: {
        name: 'Toggle AppsList',
        id: 'appsList',
        value: 'hide',
        value_options: ['hide', 'toggle', 'show'],
        value_instructions: 'How the button behaves',
        description: 'Toggles the apps list.',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    },
    Swipe: {
      [EventMode.SwipeUp]: {
        name: 'Toggle AppsList',
        id: 'appsList',
        value: 'hide',
        value_instructions: 'hide, toggle, show',
        description: 'Toggles the apps list.',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      },
      [EventMode.SwipeDown]: {
        name: 'Toggle AppsList',
        id: 'appsList',
        value: 'show',
        value_instructions: 'hide, toggle, show',
        description: 'Toggles the apps list.',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      },
      [EventMode.SwipeLeft]: {
        name: 'Open Previous',
        id: 'swipeL',
        description: 'Opens the app at the previous index',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      },
      [EventMode.SwipeRight]: {
        name: 'Open Next',
        id: 'swipeR',
        description: 'Opens the app at the next index',
        source: 'server',
        version: '0.9.0',
        version_code: 9,
        enabled: true
      }
    }
  }
}