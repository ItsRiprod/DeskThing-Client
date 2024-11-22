import React, { useEffect, useState } from "react";
import ActionComponent from "../components/ui/Action";
import { useMappingStore } from "@src/stores";
import { Action, EventMode } from "@src/types";
import { useActionStore } from "@src/stores/actionStore";

const actionKeys = [
  "Wheel1",
  "Wheel2",
  "Wheel3",
  "Wheel4",
];

const Wheel: React.FC = () => {
  const [totalRotation, setTotalRotation] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [buttons, setButtons] = useState<Action[]>([]);
  const getButtonAction = useMappingStore((store) => store.getButtonAction);
  const executeAction = useMappingStore((store) => store.executeAction);
  const [opened, setIsOpened] = useState<boolean>(false)
  const setWheelState = useActionStore((store) => store.setWheelState)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = (e: WheelEvent) => {
      clearTimeout(timeoutId);
      const isClockwise = e.deltaX > 0 || e.deltaY > 0;
      setTotalRotation((prevRotation) => prevRotation + (isClockwise ? 1 : -1));
      timeoutId = setTimeout(() => {
        setIsOpened(false)
        timeoutId = setTimeout(() => {
          setWheelState(false);
        }, 200)
      }, 8000);
    };

    window.addEventListener("wheel", handleScroll);
    
    setIsOpened(true)
    
    return () => {
      window.removeEventListener("wheel", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      e.stopPropagation()
      e.preventDefault()
      e.stopImmediatePropagation()
      if (e.key === "Enter") {
        setIsOpened(false)
        const action = getButtonAction(selectedAction as string, EventMode.KeyDown);
        if (action) {
          executeAction(action);
        }
        setTimeout(() => {
          setWheelState(false);
        }, 200)
      }
    }

    window.addEventListener("keydown", handleEnter);
    
    setIsOpened(true)
    
    return () => {
      window.removeEventListener("keydown", handleEnter);
    };
  }, [selectedAction])

  useEffect(() => {
    const normalizedRotation = ((totalRotation % 4) + 4) % 4;
    const gridToWheelMapping = [2, 3, 1, 0]; // Maps grid positions to wheel positions
    const selectedIndex = gridToWheelMapping[normalizedRotation];
    setSelectedAction(actionKeys[selectedIndex]);
  }, [totalRotation, buttons])

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
      className={`rounded-full lg:rotate-90 overflow-hidden flex items-center bg-gradient-radial from-black via-black/10 to-transparent w-[350px] h-[350px] transition-[transform,opacity] origin-center translate-x-[65vw] lg:translate-x-0 lg:translate-y-0 -translate-y-[15vh] fixed ${opened ? "scale-[2] lg:scale-100 opacity-100" : "scale-0 opacity-0"}`}
    >
      <div 
        style={{transform: `rotate(${totalRotation * 90 + 45}deg)`}} className="transition-all grid grid-cols-2 w-full h-full">
        {buttons.length > 0 &&
          [buttons[0],buttons[1],buttons[2],buttons[3]].map((action, index) => (
            <div
              key={index}
              className={`w-full h-full duration-300 flex lg:-rotate-90 items-center justify-center transition-all`}>
              <div
                style={{transform: `rotate(${-totalRotation * 90 - 45}deg)`}}
                className={`transition-all items-center justify-start w-1/4 h-1/4 flex`}
              >
                <ActionComponent action={action} className={`transition ${selectedAction == actionKeys[index] ? 'delay-300 lg:delay-100 scale-[2]' : 'opacity-75'}`} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Wheel;
