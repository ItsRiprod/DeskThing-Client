import { useSettingsStore, useAppStore } from "@src/stores";
import { ViewMode } from "@src/types";
import AppTrayButton from "./AppButton";
import Key from "@src/components/ui/Key";

const actionKeys = [
    "Tray1",
    "Tray2",
    "Tray3",
    "Tray4",
    "Tray5",
    "Tray6",
  ];

const TrayContent = () => {
    
    const appTrayState = useSettingsStore((store) => store.preferences.appTrayState)
    const apps = useAppStore((store) => store.apps)

    
    return (
        <div className={`${appTrayState == ViewMode.PEEK && 'do stuff'} grid grid-cols-1 justify-items-center sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 p-2 w-full overflow-hidden max-h-full h-fit [&>*]:h-24`}>
                {appTrayState == ViewMode.PEEK ? 
                    actionKeys.map((aKey) =>
                        <div key={aKey} className=" px-20 w-full">
                            <Key keyId={aKey} />
                        </div> 
                    )

                : appTrayState == ViewMode.FULL && 
                    apps && apps.map((app) => <AppTrayButton app={app} key={app.name} />
                    )
                }
            </div>
    )
}

export default TrayContent