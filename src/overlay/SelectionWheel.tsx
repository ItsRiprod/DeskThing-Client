import React, { useEffect, useState } from "react";
import ActionComponent from "../components/ui/Action";
import { useMappingStore } from "@src/stores";
import { Action, EventMode } from "@src/types";

const actionKeys = [
  "Wheel1",
  "Wheel2",
  "Wheel3",
  "Wheel4",
];

const Wheel: React.FC = () => {
  const [isTurning, setIsTurning] = useState(false);
  const [_currentIndex, setCurrentIndex] = useState(0);
  const [totalRotation, setTotalRotation] = useState(0);
  const [buttons, setButtons] = useState<Action[]>([]);
  const getButtonAction = useMappingStore((store) => store.getButtonAction);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = (e: WheelEvent) => {
      setIsTurning(true);
      clearTimeout(timeoutId);
      const isClockwise = e.deltaX > 0 || e.deltaY > 0;
      setTotalRotation((prevRotation) => prevRotation + (isClockwise ? 90 : -90));
      setCurrentIndex((currentIndex) => ((isClockwise ? currentIndex + 1 : currentIndex - 1 + 4) % 4))
      timeoutId = setTimeout(() => {
        setIsTurning(false);
      }, 1000);
    };

    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      clearTimeout(timeoutId);
      console.log("Unmount");
    };
  }, []);

  useEffect(() => {
    const getActions = async () => {
      const actions = actionKeys.map((key) =>
        getButtonAction(key, EventMode.KeyDown)
      );
      setButtons(actions);
    };
    getActions();
  }, [getButtonAction]);

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center bg-white/10 backdrop-blur-md border border-white/20 w-[350px] h-[350px] transition-[transform,opacity] origin-center translate-x-[65vw] -translate-y-[15vh] fixed ${isTurning ? "scale-[2] opacity-100" : "scale-0 opacity-0"}`}
    >
      <div 
        style={{transform: `rotate(${totalRotation + 45}deg)`}} className="transition-all grid grid-cols-2 w-full h-full">
        {buttons.length > 0 &&
          [buttons[0],buttons[1],buttons[2],buttons[3]].map((action, index) => (
            <div
              key={index}
              className={`w-full h-full duration-300 flex items-center justify-center transition-all`}>
              <div
                style={{transform: `rotate(${-totalRotation - 45}deg)`}}
                className={`transition-all items-center justify-start w-1/2 h-1/2 flex`}
              >
                <ActionComponent action={action} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Wheel;
