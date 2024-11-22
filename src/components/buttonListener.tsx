import { useMappingStore } from "@src/stores";
import { useEffect } from "react";
import { EventMode } from "@src/types/buttons";

export const ButtonListener = () => {
    const executeAction = useMappingStore((store) => store.executeAction)
    const getActions = useMappingStore((store) => store.getButtonAction)

    useEffect(() => {
      const pressStartTimes = new Map<string, number>();
      const LONG_PRESS_DURATION = 200; // 500ms for long press

      const keyDownHandler = (e: KeyboardEvent) => {
        if (e.defaultPrevented) return;
        pressStartTimes.set(e.key, Date.now());
        const action = getActions(e.key, EventMode.KeyDown);
        action && executeAction(action);
      };

      const keyUpHandler = (e: KeyboardEvent) => {
        if (e.defaultPrevented) return;
        const action = getActions(e.key, EventMode.KeyUp);
        action && executeAction(action);

        // Check for short/long press
        const pressStartTime = pressStartTimes.get(e.key);
        if (pressStartTime) {
          const pressDuration = Date.now() - pressStartTime;
          if (pressDuration < LONG_PRESS_DURATION) {
            const shortPressAction = getActions(e.key, EventMode.PressShort);
            shortPressAction && executeAction(shortPressAction);
          } else {
            const longPressAction = getActions(e.key, EventMode.PressLong);
            
            longPressAction && executeAction(longPressAction);
          }
          pressStartTimes.delete(e.key);
        }
      };

      window.addEventListener('keydown', keyDownHandler);
      window.addEventListener('keyup', keyUpHandler);
      
      return () => {
        window.removeEventListener('keydown', keyDownHandler);
        window.removeEventListener('keyup', keyUpHandler);
      }
    }, []);
  
    return null;
};

