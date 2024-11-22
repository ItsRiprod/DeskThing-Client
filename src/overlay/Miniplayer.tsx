import Key from '@src/components/ui/Key'
import { useMusicStore, useSettingsStore } from '@src/stores'
import React, { useEffect } from 'react'



const Miniplayer: React.FC = () => {
    const miniplayer = useSettingsStore((store) => store.settings.miniplayer)
    const theme = useSettingsStore((store) => store.settings.theme)
    const song = useMusicStore((store) => store.song)
    const getSong = useMusicStore((store) => store.requestMusicData)

    const height = theme.scale == 'small' ? 'h-16' : theme.scale == 'medium' ? 'h-24' : 'h-32'

    useEffect(() => {
        console.log(song)
    }, [song])

    useEffect(() => {
        getSong()
    }, [])
    if (miniplayer.position == 'left') return null
    return (
        <div style={{background: theme.background}} className={`${height} w-screen flex bottom-0`}>
            <img src={song?.thumbnail || ''} className='h-full w-full object-cover' />
            <Key keyId='DynamicAction1' />
            <Key keyId='DynamicAction2' />
            <Key keyId='DynamicAction3' />
            <Key keyId='DynamicAction4' />
            <Key keyId='Action5' />
            <Key keyId='Action6' />
            <Key keyId='Action7' />
        </div>
    )
}

export default Miniplayer