import { useSettingsStore } from '@src/stores'
import { ViewMode } from '@src/types'
import React, { useEffect, useState } from 'react'



const AppTray: React.FC = () => {
    const appTrayState = useSettingsStore((store) => store.preferences.appTrayState)
    const setPreferences = useSettingsStore((store) => store.updatePreferences)
    const [height, setHeight] = useState('h-16')

    useEffect(() => {
        setHeight(appTrayState === ViewMode.PEEK ? 'h-16' : appTrayState === ViewMode.HIDDEN ? 'h-0' : 'h-screen') 
    }, [appTrayState])

    const onClick = () => {
        if (appTrayState === ViewMode.HIDDEN) {
            setPreferences({ appTrayState: ViewMode.PEEK })
        } else if (appTrayState === ViewMode.PEEK) {
            setPreferences({ appTrayState: ViewMode.FULL })
        } else {
            setPreferences({ appTrayState: ViewMode.HIDDEN })
        }
    }

    return (
        <div className={`w-screen absolute top-0 bg-slate-500 transition-[height] z-10 ${height}`}>
            <button className='w-screen absolute -bottom-14 h-28 flex justify-center' onClick={onClick}>
                <div className="bg-black/50 h-28 w-28 rounded-xl"></div>
            </button>
        </div>
    )
}

export default AppTray