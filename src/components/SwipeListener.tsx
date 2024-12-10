import { useMappingStore } from "@src/stores";
import { useEffect } from "react";
import { EventMode } from "@src/types/buttons";

export const SwipeListener = () => {
    const executeAction = useMappingStore((store) => store.executeAction)
    const getActions = useMappingStore((store) => store.getButtonAction)

    useEffect(() => {
      let touchStartX: number | null = null;
      let touchStartY: number | null = null;
      let touchStartTime: number | null = null;
      const swipeThreshold = 50;
      const swipeTimeThreshold = 500; // 500ms timeout for swipe

      const touchStartHandler = (e: TouchEvent) => {
        if (e.defaultPrevented) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      };

      const touchEndHandler = (e: TouchEvent) => {
        if (e.defaultPrevented) return;
        if (!touchStartX || !touchStartY || !touchStartTime) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = touchEndTime - touchStartTime;

        if (deltaTime <= swipeTimeThreshold) {
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > swipeThreshold) {
              if (deltaX > 0) {
                const action = getActions('Swipe', EventMode.SwipeRight);
                action && executeAction(action);
              } else {
                const action = getActions('Swipe', EventMode.SwipeLeft);
                action && executeAction(action);
              }
            }
          } else {
            // Vertical swipe
            if (Math.abs(deltaY) > swipeThreshold) {
              if (deltaY > 0) {
                const action = getActions('Swipe', EventMode.SwipeDown);
                action && executeAction(action);
              } else {
                const action = getActions('Swipe', EventMode.SwipeUp);
                action && executeAction(action);
              }
            }
          }
        }

        touchStartX = null;
        touchStartY = null;
        touchStartTime = null;
      };

      window.addEventListener('touchstart', touchStartHandler, { passive: true });
      window.addEventListener('touchend', touchEndHandler, { passive: true });
      
      return () => {
        window.removeEventListener('touchstart', touchStartHandler);
        window.removeEventListener('touchend', touchEndHandler);
      }
    }, []);

    useEffect(() => {

      const handleScroll = (event: WheelEvent) => {
        if (event.defaultPrevented) return;
        const deltaY = event.deltaY;
        const deltaX = event.deltaX;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal scroll
          const action = getActions('Scroll', deltaX > 0 ? EventMode.ScrollRight : EventMode.ScrollLeft);
          action && executeAction(action);
        } else {
          // Vertical scroll
          const action = getActions('Scroll', deltaY > 0 ? EventMode.ScrollDown : EventMode.ScrollUp);
          action && executeAction(action);
        }
      };

      window.addEventListener('wheel', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('wheel', handleScroll);
      };
    }, [])  
    return null;
};