  import { useState } from "react";
  import { AppStore } from "../../../stores";
  import { App } from "../../../types";
import { IconArrowRight } from "../../../assets/Icons";


  interface AppListInterface {
    onViewSelect: (view: string) => void
  }
    const AppList: React.FC<AppListInterface> = ({ onViewSelect }: AppListInterface) => {
        const appStore = AppStore.getInstance();
        const [ apps ] = useState<App[]>(appStore.getApps() || []);

        return (
            <div className="w-full h-full flex flex-col">
                <h1 className="p-4 text-5xl font-semibold">App Settings</h1>
                <div className="flex flex-col bg-zinc-950 gap-2 pb-10">
                  <ListItem title="Logs" value="logs" onClick={onViewSelect} />
                    {apps.map((app, index) => (
                        <ListItem
                            key={index}
                            title={app.manifest.label || app.name}
                            value={app.name}
                            onClick={onViewSelect}
                        />
                    ))}
                    <ListItem title="Config" value="dev" onClick={onViewSelect} />
                </div>
            </div>
        );
    };

  interface ListItemInterface {
    title: string
    value: string
    onClick: (view: string) => void
  }

  const ListItem: React.FC<ListItemInterface> = ({ title, value, onClick }) => {
    return (
        <button onClick={() => onClick(value)} className="text-4xl w-full p-3 bg-zinc-900 flex justify-between items-center">
            <p>{title}</p>
            <IconArrowRight iconSize={48} />
        </button>
    )
  }

  export default AppList;
