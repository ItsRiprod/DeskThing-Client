/**
 * @file Utility.tsx
 * @description Utility component for the DeskThing-Client.
 * @author Riprod
 * @version 0.8.0
 */

import { useState } from "react";
import UtilLogs from "./Logs";
import UtilDev from "./Dev";
import AppList from "./AppList";
import AppSetting from "./AppSetting";

const Utility: React.FC = () => {
    const [selectedView, setSelectedView] = useState<string>('default')

    return (
      <div
        className={`flex w-full max-h-full h-full flex-col-reverse sm:flex-row bg-black`}
      >
        <div className="border border-slate-500 h-full w-full m-2 rounded-lg p-5 overflow-y-scroll">
          {selectedView === "default" ? (
            <AppList onViewSelect={(view: string) => setSelectedView(view)} />
          ) :selectedView === "logs" ? (
            <UtilLogs onBack={() => setSelectedView('default')} />
          ) : selectedView === "dev" ? (
           <UtilDev onBack={() => setSelectedView('default')} /> 
          ) : (
            <AppSetting appName={selectedView} onBack={() => setSelectedView('default')} />
          )}
        </div>
      </div>
    );
}

export default Utility;