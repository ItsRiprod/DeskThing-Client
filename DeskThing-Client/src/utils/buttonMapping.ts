import { Button, EventFlavor } from '../types';

export function mapButton(event: string): Button {
  return event as Button;
}

export function mapMouseButton(button: number): Button {
  switch (button) {
    case 0:
      return 'MouseLeft'; // Left button
    case 1:
      return 'MouseMiddle'; // Middle button
    case 2:
      return 'MouseRight'; // Right button
    default:
      console.log('Unknown mouse button:', button);
      return null
  }
}

export function listenerKey(btn: Button, flv: EventFlavor, identifier: string = ''): string {
  return `${btn}_${flv}_${identifier}`;
}
