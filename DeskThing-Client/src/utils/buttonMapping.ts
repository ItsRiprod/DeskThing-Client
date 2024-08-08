import { Button, EventFlavor } from '../types';

export function mapButton(event: string): Button {
  switch (event) {
    case 'Digit1':
      return Button.BUTTON_1;
    case 'Digit2':
      return Button.BUTTON_2;
    case 'Digit3':
      return Button.BUTTON_3;
    case 'Digit4':
      return Button.BUTTON_4;
    case 'KeyM':
      return Button.BUTTON_5;
    case 'Enter':
      return Button.SCROLL_PRESS;
    case 'Escape':
      return Button.FRONT_BUTTON;
    default:
      if (event.startsWith('Key') || event.startsWith('Digit') || event.length === 1) {
        return Button.KEYBOARD_KEY;
      }
      return Button.OTHER;
  }
}

export function mapMouseButton(button: number): Button {
  switch (button) {
    case 0:
      return Button.MOUSE_BUTTON; // Left button
    case 1:
      return Button.SCROLL_PRESS; // Middle button
    case 2:
      return Button.MOUSE_BUTTON; // Right button
    default:
      return Button.OTHER;
  }
}

export function listenerKey(btn: Button, flv: EventFlavor, identifier: string = ''): string {
  return `${btn}_${flv}_${identifier}`;
}
