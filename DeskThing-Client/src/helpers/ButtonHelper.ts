import { Button, EventFlavor } from '../types';
import { mapButton, mapMouseButton, listenerKey } from '../utils/buttonMapping';

type ButtonListener = (btn: Button, flv: EventFlavor, identifier?: string) => void;

class ButtonHelper {
    private static instance: ButtonHelper;
    private listeners: Map<string, ButtonListener[]>;
    private buttonStates: { [key: string]: EventFlavor };
    private longPressTimeouts: Map<string, number>;
    private callback: ButtonListener | null;
    private touchStartX = 0
    private touchStartY = 0
    private mouseStartX = 0
    private mouseStartY = 0
    private touchEndX = 0
    private touchEndY = 0

    private constructor() {
        this.listeners = new Map();
        this.buttonStates = {};
        this.longPressTimeouts = new Map();
        this.callback = null;

        this.registerEventListeners();
    }

    static getInstance(): ButtonHelper {
        if (!ButtonHelper.instance) {
            ButtonHelper.instance = new ButtonHelper();
        }
        return ButtonHelper.instance;
    }

    private registerEventListeners() {
        document.addEventListener('wheel', this.wheelEventHandler);
        document.addEventListener('keydown', this.keyDownEventHandler);
        document.addEventListener('keyup', this.keyUpEventHandler);
        document.addEventListener('mousedown', this.mouseDownEventHandler);
        document.addEventListener('mouseup', this.mouseUpEventHandler);
        document.addEventListener('touchstart', this.touchStartHandler);
        document.addEventListener('touchmove', this.touchMoveHandler);
        document.addEventListener('touchend', this.touchEndHandler);
    }

    getButtonStates(): { [key: string]: EventFlavor } {
        return { ...this.buttonStates };
    }

    on(btn: Button, flv: EventFlavor, fn: ButtonListener, identifier: string = ''): () => void {
        const key = listenerKey(btn, flv, identifier);
        const currentListeners = this.listeners.get(key) || [];
        this.listeners.set(key, [...currentListeners, fn]);
        return () => this.removeListener(btn, flv, fn, identifier);
    }

    removeListener(btn: Button, flv: EventFlavor, fn: ButtonListener, identifier: string = ''): void {
        const key = listenerKey(btn, flv, identifier);
        const currentListeners = this.listeners.get(key);
        if (currentListeners) {
            this.listeners.set(key, currentListeners.filter(listener => listener !== fn));
        }
    }

    setCallback(callback: ButtonListener): void {
        this.callback = callback;
    }

    private wheelEventHandler = (event: WheelEvent) => {
        if (event.deltaX < 0) {
            this.notify('Scroll', EventFlavor.Left);
        } else if (event.deltaX > 0) {
            this.notify('Scroll', EventFlavor.Right);
        } else if (event.deltaY < 0) {
            this.notify('Scroll', EventFlavor.Up);
        } else if (event.deltaY > 0) {
            this.notify('Scroll', EventFlavor.Down);
        }
    };

    private notify(btn: Button, flv: EventFlavor, identifier: string = '') {
        const key = listenerKey(btn, flv, identifier);
        const currentListeners = this.listeners.get(key) || [];
        currentListeners.forEach(listener => listener(btn, flv, identifier));
        if (this.callback) {
            this.callback(btn, flv, identifier);
        }
    }

    private keyDownEventHandler = (event: KeyboardEvent) => {
        const button = mapButton(event.code);
        const identifier = event.key;

        // Only set down if it is not already down or already a long press
        if (this.buttonStates[identifier] != EventFlavor.Long && this.buttonStates[identifier] != EventFlavor.Down) {
            this.notify(button, EventFlavor.Down, identifier);
            this.buttonStates[identifier] = EventFlavor.Down;
        }
        if (button === 'Enter' || button === 'Escape') {
            event.preventDefault();
        }

        // Ensure that you dont double-call a long press
        if (!this.longPressTimeouts.has(identifier)) {
            const timeout = window.setTimeout(() => {
                this.buttonStates[identifier] = EventFlavor.Long;
                this.notify(button, EventFlavor.Long, identifier);
            }, 400);

            this.longPressTimeouts.set(identifier, timeout);
        }
    }

    private keyUpEventHandler = (event: KeyboardEvent) => {
        const button = mapButton(event.code);
        const identifier = event.key;
        // Dont notify if the most recent action was a longpress
        if (this.buttonStates[identifier] != EventFlavor.Long) {
            this.notify(button, EventFlavor.Short, identifier);
        }
        
        // Set the most recent press state 
        this.notify(button, EventFlavor.Up, identifier);
        this.buttonStates[identifier] = EventFlavor.Up;

        // Clear the event timeout to cancel a long press and cleanup
        if (this.longPressTimeouts.has(identifier)) {
            clearTimeout(this.longPressTimeouts.get(identifier)!);
            this.longPressTimeouts.delete(identifier);
        }
    };

    private mouseDownEventHandler = (event: MouseEvent) => {
        this.mouseStartX = event.clientX;
        this.mouseStartY = event.clientY;
        //document.addEventListener('mousemove', this.mouseMoveEventHandler);

        const button = mapMouseButton(event.button);
        const identifier = `Mouse${event.button}`;
        this.buttonStates[identifier] = EventFlavor.Down;
        this.notify(button, EventFlavor.Down, identifier);
    };

    private mouseUpEventHandler = (event: MouseEvent) => {
        const deltaX = event.clientX - this.mouseStartX;
        const deltaY = event.clientY - this.mouseStartY;
        this.handleSwipe(deltaX, deltaY);

        //document.removeEventListener('mousemove', this.mouseMoveEventHandler);

        const button = mapMouseButton(event.button);
        const identifier = `Mouse${event.button}`;
        this.buttonStates[identifier] = EventFlavor.Up;
        this.notify(button, EventFlavor.Up, identifier);
    };

    // isn't needed because the swipe can be calculated from the mouseup event
    //private mouseMoveEventHandler = (event: MouseEvent) => {
    //  // This is where we could handle real-time swipe preview if needed
    //};

    private touchStartHandler = (event: TouchEvent) => {
        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
        this.touchEndX = event.touches[0].clientX;
        this.touchEndY = event.touches[0].clientY;
    };

    /*
    Hypothetically don't need this because we could just use the touchend event to get the coords
    */
    private touchMoveHandler = (event: TouchEvent) => {
      this.touchEndX = event.touches[0].clientX;
      this.touchEndY = event.touches[0].clientY;
    };

    private touchEndHandler = () => {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        this.handleSwipe(deltaX, deltaY);
    };

    // Handles the swiping with just the delta of the x and y coords. Notifies the swipe event accordingly
    private handleSwipe(deltaX: number, deltaY: number) {
        if (Math.abs(deltaX) > 400 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                this.notify('Swipe', EventFlavor.Left);
            } else {
                this.notify('Swipe', EventFlavor.Right);
            }
        } else if (Math.abs(deltaY) > 200) {
            if (deltaY > 0) {
                this.notify('Swipe', EventFlavor.Down);
            } else {
                this.notify('Swipe', EventFlavor.Up);
            }
        }
    }

    destroy() {
        document.removeEventListener('wheel', this.wheelEventHandler);
        document.removeEventListener('keydown', this.keyDownEventHandler);
        document.removeEventListener('keyup', this.keyUpEventHandler);
        document.removeEventListener('mousedown', this.mouseDownEventHandler);
        document.removeEventListener('mouseup', this.mouseUpEventHandler);
        document.removeEventListener('touchstart', this.touchStartHandler);
        document.removeEventListener('touchmove', this.touchMoveHandler);
        document.removeEventListener('touchend', this.touchEndHandler);

        this.listeners.clear();
        this.longPressTimeouts.forEach(timeout => clearTimeout(timeout));
        this.longPressTimeouts.clear();
        this.callback = null;
    }
}

export default ButtonHelper.getInstance();
