
/**
 * @file Dev.tsx
 * @description Dev component for the DeskThing-Client utility view.
 * @author Riprod
 * @version 0.8.0
 */

import Button from "../../Button";
import { UIStore } from "../../../stores";

interface UtilDevInterface {
    onBack: () => void
}

const UtilDev: React.FC<UtilDevInterface> = ({ onBack }) => {
    const openDevView = () => {
        UIStore.getInstance().setCurrentView('dev')
    }

    return (
        <div className="w-full">
            <Button className="my-2 bg-zinc-900 w-fit" onClick={onBack}>{'<-'} Go Back</Button>
            <div className="w-full flex justify-between mb-3">
                <button
                    className={`border-2 border-slate-500 rounded-xl p-5`}
                    onClick={openDevView}
                >
                    <p>Dev Mode</p>
                </button>
            </div>
        </div>
    );
}

export default UtilDev;
